import { GoogleGenAI, Type } from "@google/genai";
import { Verse, ViewMode } from '../types';

// In Vite via 'define', process.env.API_KEY is replaced by the string value at build time.
// We assign it to a variable to handle it safely.
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

// Initialize the client only if the key exists
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.warn("API Key is missing. Check your .env file.");
}

export const fetchChapterText = async (
  bookName: string, 
  chapter: number, 
  primaryLang: string, 
  secondaryLang: string = 'English', 
  mode: ViewMode = 'single'
): Promise<Verse[]> => {
  if (!ai) {
    // Return a mock error verse instead of throwing to prevent app crash
    return [{ 
      verse: 1, 
      text: "API Key не найден. Пожалуйста, создайте файл .env в корне проекта и добавьте строку: API_KEY=ваш_ключ" 
    }];
  }

  const model = "gemini-2.5-flash";
  
  // Construct instructions based on mode
  let contentRequest = '';
  let fieldsDescription = '';
  
  const baseInstructions = `
    Provide the full text of the Bible book "${bookName}", Chapter ${chapter}.
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
      const data = JSON.parse(response.text);
      return data as Verse[];
    }
    
    throw new Error("Empty response from API");
  } catch (error) {
    console.error("Error fetching scripture:", error);
    throw error;
  }
};