
export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'old' | 'new';
  category: 'pentateuch' | 'history' | 'wisdom' | 'prophets' | 'gospels' | 'acts' | 'catholic' | 'pauline' | 'revelation';
}

export interface InterlinearWord {
  original: string;
  transliteration?: string;
  translation: string;
}

export interface Verse {
  verse: number;
  text: string;
  textSecondary?: string; // For parallel reading
  interlinearData?: InterlinearWord[];  // For interlinear word-by-word view
  originalText?: string; // Keep strictly for full text backup if needed
}

export interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface ChapterContent {
  book: string;
  chapter: number;
  verses: Verse[];
}

export type Theme = 'white' | 'sepia' | 'dark';
export type FontFamily = 'serif' | 'sans';
export type FontSize = 0 | 1 | 2 | 3 | 4;
export type Language = string; // Changed to string to support any language
export type TextWidth = 'narrow' | 'normal' | 'wide';
export type ViewMode = 'single' | 'parallel' | 'interlinear';
