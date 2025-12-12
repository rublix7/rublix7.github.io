
import { GoogleGenAI, Type } from "@google/genai";
import { Verse, ViewMode, SearchResult } from '../types';

// Get key injected by Vite
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.error("API Key is missing in configuration.");
}

// --- CACHING SYSTEM ---
const chapterCache = new Map<string, Verse[]>();

const getCacheKey = (book: string, chapter: number, pLang: string, sLang: string, mode: ViewMode) => {
  return `${book}_${chapter}_${pLang}_${sLang}_${mode}`;
};
// ----------------------

export const fetchChapterText = async (
  bookName: string, 
  chapter: number, 
  primaryLang: string, 
  secondaryLang: string = 'English', 
  mode: ViewMode = 'single'
): Promise<Verse[]> => {
  if (!ai) {
    return [{ 
      verse: 1, 
      text: "Ошибка конфигурации: API Key не найден или неверен. Проверьте vite.config.ts." 
    }];
  }

  // 1. Check Cache
  const cacheKey = getCacheKey(bookName, chapter, primaryLang, secondaryLang, mode);
  if (chapterCache.has(cacheKey)) {
    // Return a deep copy to prevent mutation issues
    return JSON.parse(JSON.stringify(chapterCache.get(cacheKey)));
  }

  const model = "gemini-2.5-flash";
  
  // Construct instructions based on mode
  let contentRequest = '';
  let fieldsDescription = '';
  
  const baseInstructions = `
    You are a Bible API. Provide the full text of the Bible book "${bookName}", Chapter ${chapter}.
    Return ONLY a JSON array. 
    
    CRITICAL INSTRUCTION FOR "RED LETTER":
    If the text contains words directly spoken by Jesus Christ, wrap them in double angle brackets like this: ⟪Words of Jesus⟫.
  `;

  if (mode === 'parallel') {
    contentRequest = `Provide the text in TWO languages: 
    1. Primary: ${primaryLang}
    2. Secondary: ${secondaryLang}`;
    
    fieldsDescription = `
    - "verse" (integer): verse number
    - "text" (string): text in ${primaryLang}
    - "textSecondary" (string): text in ${secondaryLang}
    `;
  } else if (mode === 'interlinear') {
    contentRequest = `
      Provide a WORD-FOR-WORD interlinear translation. 
      For each verse, break it down into an array of word objects mapping the Original Biblical Text (Hebrew/Greek) to the ${primaryLang} translation.
      Also provide the full text in ${primaryLang} for context.
    `;
    
    fieldsDescription = `
    - "verse" (integer): verse number
    - "text" (string): full text in ${primaryLang}
    - "interlinearData" (array): array of objects, where each object has:
       - "original": the specific Hebrew or Greek word/particle
       - "translation": the specific ${primaryLang} equivalent word
       - "transliteration": latin transliteration of the original word
    `;
  } else {
    // Single mode
    contentRequest = `Provide the text in ${primaryLang}.`;
    fieldsDescription = `
    - "verse" (integer): verse number
    - "text" (string): text in ${primaryLang}
    `;
  }

  const prompt = `
    ${baseInstructions}
    ${contentRequest}
    
    Each item in the array must be an object with:
    ${fieldsDescription}
    
    Ensure strict fidelity to the translation. Do not include titles, introductions, or extra commentary.
    If the book/chapter doesn't exist in standard canon (e.g. Chapter 151 of Psalms), return the closest valid chapter or an empty array.
  `;

  // Define dynamic schema based on mode
  const properties: any = {
    verse: { type: Type.INTEGER },
    text: { type: Type.STRING },
  };
  
  const required = ["verse", "text"];

  if (mode === 'parallel') {
    properties.textSecondary = { type: Type.STRING };
    required.push("textSecondary");
  }

  if (mode === 'interlinear') {
    properties.interlinearData = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          translation: { type: Type.STRING },
          transliteration: { type: Type.STRING },
        },
        required: ["original", "translation"]
      }
    };
    required.push("interlinearData");
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: properties,
            required: required,
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as Verse[];
      
      // 2. Save to Cache before returning
      chapterCache.set(cacheKey, data);
      
      return data;
    }
    
    throw new Error("Empty response from API");
  } catch (error) {
    console.error("Error fetching scripture:", error);
    throw error;
  }
};

export const searchBible = async (query: string, language: string): Promise<SearchResult[]> => {
  if (!ai) return [];

  const prompt = `
    Find relevant Bible verses (up to 20) for the search query: "${query}".
    Search context/language: ${language}.
    
    Return a JSON array where each object has:
    - book (string, in ${language})
    - chapter (integer)
    - verse (integer)
    - text (string, the content of the verse in ${language})
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              book: { type: Type.STRING },
              chapter: { type: Type.INTEGER },
              verse: { type: Type.INTEGER },
              text: { type: Type.STRING },
            },
            required: ["book", "chapter", "verse", "text"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as SearchResult[];
    }
    return [];
  } catch (error) {
    console.error("Error searching bible:", error);
    throw error;
  }
};
