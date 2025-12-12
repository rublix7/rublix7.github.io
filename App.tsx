
import React, { useState, useEffect, useCallback } from 'react';
import { BibleViewer } from './components/BibleViewer';
import { HomePage } from './components/HomePage';
import { SearchResults } from './components/SearchResults';
import { fetchChapterText, searchBible } from './services/geminiService';
import { BIBLE_BOOKS } from './constants';
import { Verse, Theme, FontFamily, FontSize, TextWidth, ViewMode, SearchResult } from './types';

const App: React.FC = () => {
  // View State: 'home', 'reader', or 'search_results'
  const [view, setView] = useState<'home' | 'reader' | 'search_results'>('home');

  // State
  const [currentBookIndex, setCurrentBookIndex] = useState(0); 
  const [currentChapter, setCurrentChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // UI Settings State
  const [theme, setTheme] = useState<Theme>('sepia');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [fontSize, setFontSize] = useState<FontSize>(2);
  const [redLetterMode, setRedLetterMode] = useState(true);
  const [textWidth, setTextWidth] = useState<TextWidth>('normal');

  // Language & Mode State
  const [primaryLang, setPrimaryLang] = useState<string>('Русский (Синодальный)');
  const [secondaryLang, setSecondaryLang] = useState<string>('English (KJV)');
  const [viewMode, setViewMode] = useState<ViewMode>('single');

  const currentBook = BIBLE_BOOKS[currentBookIndex];

  // Fetch Logic - Centralized
  const loadChapter = useCallback(async (
    bookName: string, 
    chapter: number, 
    pLang: string, 
    sLang: string, 
    mode: ViewMode
  ) => {
    setIsLoading(true);
    setVerses([]); 
    try {
      // The caching logic is now inside fetchChapterText
      const data = await fetchChapterText(bookName, chapter, pLang, sLang, mode);
      setVerses(data);
    } catch (error: any) {
      console.error("Failed to load chapter", error);
      let errorMessage = "Не удалось загрузить текст. Пожалуйста, проверьте API ключ или подключение к интернету.";
      if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
        errorMessage = "Лимит запросов исчерпан (429). Пожалуйста, попробуйте позже.";
      }
      setVerses([{ verse: 1, text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search Logic
  const handleGlobalSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const results = await searchBible(query, primaryLang);
      setSearchResults(results);
      setView('search_results');
    } catch (e) {
      console.error(e);
      alert("Ошибка поиска. Попробуйте позже.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (book: string, chapter: number, verse: number) => {
    const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === book);
    if (bookIndex !== -1) {
        // Just set state. The useEffect will trigger the load.
        setCurrentBookIndex(bookIndex);
        setCurrentChapter(chapter);
        setView('reader');
    } else {
        alert(`Книга "${book}" не найдена в оглавлении.`);
    }
  };

  // MAIN SYNCHRONIZATION EFFECT
  // This ensures text is fetched ONLY when state settles, preventing race conditions or wrong chapter display.
  useEffect(() => {
    if (view === 'reader') {
      const bookToLoad = BIBLE_BOOKS[currentBookIndex];
      // Ensure we don't try to load a non-existent chapter if switching books with fewer chapters
      const safeChapter = Math.min(Math.max(1, currentChapter), bookToLoad.chapters);
      
      if (safeChapter !== currentChapter) {
        setCurrentChapter(safeChapter); // Will trigger effect again with correct chapter
        return;
      }

      loadChapter(bookToLoad.name, safeChapter, primaryLang, secondaryLang, viewMode);
    }
  }, [
    currentBookIndex, // Dependent on Book
    currentChapter,   // Dependent on Chapter
    primaryLang, 
    secondaryLang, 
    viewMode, 
    view,
    loadChapter
  ]);

  const handleSelectChapter = (bookName: string, chapter: number) => {
    const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === bookName);
    if (bookIndex !== -1) {
      setCurrentBookIndex(bookIndex);
      setCurrentChapter(chapter);
      // Do not call loadChapter manually, let useEffect handle it
    }
  };

  const handleSelectBook = (bookName: string) => {
    const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === bookName);
    if (bookIndex !== -1) {
      setCurrentBookIndex(bookIndex);
      
      // If coming from home, always start at chapter 1
      if (view === 'home' || view === 'search_results') {
        setCurrentChapter(1);
        setView('reader');
      } 
      // If already in reader (e.g. sidebar if we had one, or future implementation), 
      // just switching book resets to 1 implies starting over usually, 
      // but if we wanted to keep chapter, logic would differ. 
      // For now, assuming selecting a book implies starting at 1 is safer UX.
    }
  };

  const handleGoHome = () => {
    setView('home');
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    let newBookIndex = currentBookIndex;
    let newChapter = direction === 'next' ? currentChapter + 1 : currentChapter - 1;

    // Next logic
    if (direction === 'next') {
      if (newChapter > currentBook.chapters) {
        newBookIndex++;
        if (newBookIndex < BIBLE_BOOKS.length) {
          newChapter = 1;
        } else {
          return; // End of Bible
        }
      }
    } 
    // Prev logic
    else {
      if (newChapter < 1) {
        newBookIndex--;
        if (newBookIndex >= 0) {
          newChapter = BIBLE_BOOKS[newBookIndex].chapters;
        } else {
          return; // Start of Bible
        }
      }
    }

    // Just update state, useEffect handles the rest
    setCurrentBookIndex(newBookIndex);
    setCurrentChapter(newChapter);
  };

  const hasPrev = currentBookIndex > 0 || currentChapter > 1;
  const hasNext = currentBookIndex < BIBLE_BOOKS.length - 1 || currentChapter < currentBook.chapters;

  const getPrevLabel = () => {
    if (!hasPrev) return null;
    let c = currentChapter - 1;
    let bIndex = currentBookIndex;
    if (c < 1) {
      bIndex--;
      if (bIndex >= 0) {
        return `${BIBLE_BOOKS[bIndex].name} ${BIBLE_BOOKS[bIndex].chapters}`;
      }
      return null; 
    }
    return `Глава ${c}`;
  };

  const getNextLabel = () => {
    if (!hasNext) return null;
    let c = currentChapter + 1;
    let bIndex = currentBookIndex;
    if (c > BIBLE_BOOKS[bIndex].chapters) {
      bIndex++;
      if (bIndex < BIBLE_BOOKS.length) {
        return `${BIBLE_BOOKS[bIndex].name} 1`;
      }
      return null;
    }
    return `Глава ${c}`;
  };

  const getContainerBg = () => {
    switch (theme) {
      case 'dark': return 'bg-[#1C1C1E]';
      case 'sepia': return 'bg-[#F9F5EB]';
      default: return 'bg-white';
    }
  };

  return (
    <div className={`flex h-full w-full relative overflow-hidden transition-colors duration-500 ease-in-out ${getContainerBg()}`}>
      
      {view === 'home' && (
        <HomePage 
          onSelectBook={handleSelectBook}
          onSearch={handleGlobalSearch}
          isSearching={isSearching}
          theme={theme}
        />
      )}

      {view === 'search_results' && (
        <SearchResults 
          results={searchResults}
          query={searchQuery}
          onBack={handleGoHome}
          onSelectResult={handleSelectSearchResult}
          theme={theme}
        />
      )}

      {view === 'reader' && (
        <BibleViewer
          verses={verses}
          bookName={currentBook.name}
          chapter={currentChapter}
          totalChapters={currentBook.chapters}
          onSelectChapter={handleSelectChapter}
          isLoading={isLoading}
          onNavigate={handleNavigate}
          hasPrev={hasPrev}
          hasNext={hasNext}
          prevLabel={getPrevLabel()}
          nextLabel={getNextLabel()}
          onGoHome={handleGoHome}
          theme={theme}
          setTheme={setTheme}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          redLetterMode={redLetterMode}
          setRedLetterMode={setRedLetterMode}
          textWidth={textWidth}
          setTextWidth={setTextWidth}
          primaryLang={primaryLang}
          setPrimaryLang={setPrimaryLang}
          secondaryLang={secondaryLang}
          setSecondaryLang={setSecondaryLang}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      )}
    </div>
  );
};

export default App;
