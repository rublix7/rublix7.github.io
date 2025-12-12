
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Verse, Theme, FontFamily, FontSize, TextWidth, ViewMode } from '../types';
import { Loader2, ArrowLeft, ArrowRight, Settings, Type, ToggleLeft, ToggleRight, Minus, Plus, BoxSelect, Maximize2, MoveHorizontal, Globe, Check, Search, Split, BookType, LayoutGrid, BookOpen } from 'lucide-react';

interface BibleViewerProps {
  verses: Verse[];
  bookName: string;
  chapter: number;
  totalChapters: number;
  onSelectChapter: (bookName: string, chapter: number) => void;
  isLoading: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
  prevLabel: string | null;
  nextLabel: string | null;
  onGoHome: () => void;
  // Settings
  theme: Theme;
  setTheme: (t: Theme) => void;
  fontFamily: FontFamily;
  setFontFamily: (f: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  redLetterMode: boolean;
  setRedLetterMode: (v: boolean) => void;
  textWidth: TextWidth;
  setTextWidth: (w: TextWidth) => void;
  // Language
  primaryLang: string;
  setPrimaryLang: (l: string) => void;
  secondaryLang: string;
  setSecondaryLang: (l: string) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}

const COMMON_LANGUAGES = [
  "Русский (Синодальный)", "Русский (Современный)", "Church Slavonic", "English (KJV)", "English (NIV)", "English (ESV)", 
  "Ukrainian", "Belorussian", "Spanish", "French", "German", "Italian", "Portuguese", 
  "Chinese (Simplified)", "Japanese", "Korean", "Arabic", "Hebrew (Modern)", "Greek (Modern)", "Latin (Vulgate)"
];

export const BibleViewer: React.FC<BibleViewerProps> = ({
  verses,
  bookName,
  chapter,
  totalChapters,
  onSelectChapter,
  isLoading,
  onNavigate,
  hasPrev,
  hasNext,
  prevLabel,
  nextLabel,
  onGoHome,
  theme,
  setTheme,
  fontFamily,
  // setFontFamily, // Not used in UI but kept in props
  fontSize,
  setFontSize,
  redLetterMode,
  setRedLetterMode,
  textWidth,
  setTextWidth,
  primaryLang,
  setPrimaryLang,
  secondaryLang,
  setSecondaryLang,
  viewMode,
  setViewMode
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showLangSettings, setShowLangSettings] = useState(false);
  const [showChapterNav, setShowChapterNav] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const langSettingsRef = useRef<HTMLDivElement>(null);
  const chapterNavRef = useRef<HTMLDivElement>(null);
  
  const [langSearch, setLangSearch] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'primary' | 'secondary'>('primary');

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (langSettingsRef.current && !langSettingsRef.current.contains(event.target as Node)) {
        setShowLangSettings(false);
      }
      if (chapterNavRef.current && !chapterNavRef.current.contains(event.target as Node)) {
        setShowChapterNav(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter languages
  const filteredLanguages = useMemo(() => {
    const term = langSearch.toLowerCase();
    const common = COMMON_LANGUAGES.filter(l => l.toLowerCase().includes(term));
    // If user types something not in the list, show it as a custom option
    if (term && !common.find(c => c.toLowerCase() === term)) {
      return [langSearch, ...common];
    }
    return common;
  }, [langSearch]);

  // Refined Color Palettes
  const getThemeStyles = () => {
    switch(theme) {
      case 'dark':
        return {
          bg: 'bg-[#1C1C1E]',
          text: 'text-[#E5E5E7]',
          textSec: 'text-[#9ca3af]',
          // Original text color: blue-ish for Greek/Hebrew
          textOrig: 'text-blue-300', 
          verseNum: 'text-[#525255]',
          heading: 'text-[#FFFFFF]',
          subHeading: 'text-[#8E8E93]',
          navBtn: 'text-[#E5E5E7] hover:bg-[#2C2C2E]',
          navDisabled: 'text-[#3A3A3C]',
          headerBorder: 'border-[#2C2C2E]',
          headerBg: 'bg-[#1C1C1E]/95 backdrop-blur-sm',
          settingsBg: 'bg-[#2C2C2E]',
          settingsBorder: 'border-white/10',
          redLetter: 'text-red-400',
          settingLabel: 'text-[#8E8E93]',
          controlBg: 'bg-black/20',
          controlActive: 'bg-white/10 text-white shadow-sm',
          controlInactive: 'text-[#8E8E93] hover:text-white',
          inputBg: 'bg-black/20',
          divider: 'border-[#3A3A3C]',
          chapterBtn: 'text-[#E5E5E7] hover:bg-white/10 hover:text-white',
          chapterActive: 'bg-blue-600 text-white shadow-lg',
          interlinearHover: 'hover:bg-white/10',
          logoHover: 'hover:bg-white/10',
        };
      case 'sepia':
        return {
          bg: 'bg-[#F9F5EB]',
          text: 'text-[#463C33]',
          textSec: 'text-[#8C7B68]',
          textOrig: 'text-[#0052cc]', // Classic Blue
          verseNum: 'text-[#C5B8A5]',
          heading: 'text-[#352B21]',
          subHeading: 'text-[#8C7B68]',
          navBtn: 'text-[#5B4D3C] hover:bg-[#EBE5D5]',
          navDisabled: 'text-[#DCD4C4]',
          headerBorder: 'border-[#EBE5D5]',
          headerBg: 'bg-[#F9F5EB]/95 backdrop-blur-sm',
          settingsBg: 'bg-[#F2EFE5]',
          settingsBorder: 'border-[#E6DEC8]',
          redLetter: 'text-[#8B0000]',
          settingLabel: 'text-[#8C7B68]',
          controlBg: 'bg-[#E6DEC8]/50',
          controlActive: 'bg-white shadow-sm text-[#463C33]',
          controlInactive: 'text-[#8C7B68] hover:text-[#463C33]',
          inputBg: 'bg-[#E6DEC8]/30',
          divider: 'border-[#E6DEC8]',
          chapterBtn: 'text-[#8C735A] hover:bg-[#DCCFB4]/50 hover:text-[#433422]',
          chapterActive: 'bg-[#8C735A] text-[#F9F5EB] shadow-md',
          interlinearHover: 'hover:bg-[#E6DEC8]',
          logoHover: 'hover:bg-[#E6DEC8]/60',
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-[#282829]',
          textSec: 'text-gray-500',
          textOrig: 'text-[#0000AA]', // Blue
          verseNum: 'text-gray-300',
          heading: 'text-[#111111]',
          subHeading: 'text-[#666666]',
          navBtn: 'text-[#333333] hover:bg-gray-100',
          navDisabled: 'text-gray-200',
          headerBorder: 'border-gray-100',
          headerBg: 'bg-white/95 backdrop-blur-sm',
          settingsBg: 'bg-white',
          settingsBorder: 'border-gray-200',
          redLetter: 'text-[#A00000]',
          settingLabel: 'text-[#666666]',
          controlBg: 'bg-gray-100',
          controlActive: 'bg-white shadow-sm ring-1 ring-black/5 text-black',
          controlInactive: 'text-gray-500 hover:text-gray-900',
          inputBg: 'bg-gray-50',
          divider: 'border-gray-100',
          chapterBtn: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
          chapterActive: 'bg-black text-white shadow-lg',
          interlinearHover: 'hover:bg-yellow-50',
          logoHover: 'hover:bg-gray-100',
        };
    }
  };

  const ts = getThemeStyles();

  // Typography Scaling
  const getFontSize = () => {
    switch(fontSize) {
      case 0: return 'text-[15px] leading-7';
      case 1: return 'text-[17px] leading-8';
      case 2: return 'text-[19px] leading-9';
      case 3: return 'text-[22px] leading-10';
      case 4: return 'text-[26px] leading-[3rem]';
      default: return 'text-[19px] leading-9';
    }
  };

  // Specific sizes for Interlinear Mode (Original Text vs Translation)
  const getInterlinearSizes = () => {
    switch(fontSize) {
      // Return tuples: [OriginalSize, TranslationSize]
      case 0: return { orig: 'text-base', trans: 'text-xs' };
      case 1: return { orig: 'text-lg', trans: 'text-sm' };
      case 2: return { orig: 'text-xl', trans: 'text-base' };
      case 3: return { orig: 'text-2xl', trans: 'text-lg' };
      case 4: return { orig: 'text-3xl', trans: 'text-xl' };
      default: return { orig: 'text-xl', trans: 'text-base' };
    }
  };

  // Text Width Logic
  const getTextWidthClass = () => {
    if (viewMode === 'parallel' || viewMode === 'interlinear') return 'max-w-6xl';
    switch(textWidth) {
      case 'narrow': return 'max-w-lg';
      case 'wide': return 'max-w-4xl';
      case 'normal':
      default: return 'max-w-2xl';
    }
  };

  // Text Parser for Red Letter
  const renderVerseText = (text: string) => {
    if (!text) return null;
    // If Red Letter mode is off, strip the brackets and return text
    if (!redLetterMode) {
      return text.replace(/⟪|⟫/g, '');
    }

    // Split text by the special markers
    const parts = text.split(/(⟪.*?⟫)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('⟪') && part.endsWith('⟫')) {
        // Remove brackets and apply red color
        const content = part.slice(1, -1);
        return <span key={index} className={ts.redLetter}>{content}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleLanguageSelect = (lang: string) => {
    if (activeLangTab === 'primary') {
      setPrimaryLang(lang);
    } else {
      setSecondaryLang(lang);
    }
  };

  const toggleViewMode = (mode: ViewMode) => {
    if (viewMode === mode) {
      setViewMode('single');
    } else {
      setViewMode(mode);
    }
  };

  const ilSizes = getInterlinearSizes();

  return (
    <main className={`flex-1 h-full flex flex-col relative transition-colors duration-500 ease-in-out ${ts.bg}`}>
      
      {/* Header Bar - Persistent */}
      <div className={`flex-shrink-0 h-16 flex items-center justify-between px-4 md:px-8 border-b z-20 transition-colors relative ${ts.headerBorder} ${ts.headerBg}`}>
        
        {/* Left: Home Button & Title */}
        <div className="flex items-center">
          <button 
            onClick={onGoHome}
            className={`flex items-center gap-2.5 py-1.5 px-3 rounded-lg transition-colors ${ts.logoHover}`}
            title="На главную"
          >
            <BookOpen size={20} strokeWidth={2.5} className={ts.heading} />
            <span className={`font-serif font-black tracking-tight text-lg uppercase ${ts.heading}`}>
              БИБЛИЯ
            </span>
          </button>
          
          {/* Vertical Divider */}
          <div className={`h-5 w-px mx-4 ${ts.divider}`} />

          <span className={`font-serif font-semibold tracking-wide text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis ${ts.heading}`}>
            {bookName} {chapter}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="h-full flex items-center gap-2">
          
          {/* Chapter Selector */}
          <div className="relative" ref={chapterNavRef}>
            <button
              onClick={() => {
                setShowChapterNav(!showChapterNav);
                setShowLangSettings(false);
                setShowSettings(false);
              }}
              className={`p-2 rounded-full transition-colors ${showChapterNav ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'} ${ts.text}`}
              title="Выбор главы"
            >
              <LayoutGrid size={20} />
            </button>

            {showChapterNav && (
               <div 
               className={`absolute right-0 top-full mt-2 w-72 shadow-2xl border rounded-3xl p-5 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden ${ts.settingsBg} ${ts.settingsBorder}`}
             >
               <div className={`text-xs font-bold uppercase tracking-widest opacity-60 mb-4 ${ts.settingLabel}`}>
                 {bookName}
               </div>
               
               <div className={`grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto pr-1 ${theme === 'dark' ? 'dark-scroll' : ''}`}>
                 {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chap) => (
                   <button
                     key={chap}
                     onClick={() => {
                       onSelectChapter(bookName, chap);
                       setShowChapterNav(false);
                     }}
                     className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                       chapter === chap ? ts.chapterActive : ts.chapterBtn
                     }`}
                   >
                     {chap}
                   </button>
                 ))}
               </div>
             </div>
            )}
          </div>

          {/* Language Button */}
          <div className="relative" ref={langSettingsRef}>
            <button
              onClick={() => {
                setShowLangSettings(!showLangSettings);
                setShowSettings(false);
                setShowChapterNav(false);
              }}
              className={`p-2 rounded-full transition-colors ${showLangSettings ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'} ${ts.text}`}
              title="Язык и Перевод"
            >
              <Globe size={20} />
            </button>

            {/* Language Popover */}
            {showLangSettings && (
               <div 
               className={`absolute right-0 top-full mt-2 w-80 sm:w-96 shadow-2xl border rounded-3xl p-5 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden flex flex-col max-h-[80vh] ${ts.settingsBg} ${ts.settingsBorder}`}
             >
               {/* Mode Toggles */}
               <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => toggleViewMode('parallel')}
                    className={`flex-1 py-3 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${viewMode === 'parallel' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `${ts.settingsBorder} ${ts.controlBg} ${ts.text}`}`}
                  >
                    <Split size={18} />
                    <span className="text-xs font-medium">Параллельно</span>
                  </button>
                  <button 
                    onClick={() => toggleViewMode('interlinear')}
                    className={`flex-1 py-3 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${viewMode === 'interlinear' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600' : `${ts.settingsBorder} ${ts.controlBg} ${ts.text}`}`}
                  >
                    <BookType size={18} />
                    <span className="text-xs font-medium">Подстрочно</span>
                  </button>
               </div>

               {/* Language Tabs */}
               <div className={`flex p-1 rounded-xl mb-3 ${ts.controlBg}`}>
                 <button 
                    onClick={() => setActiveLangTab('primary')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${activeLangTab === 'primary' ? ts.controlActive : ts.controlInactive}`}
                 >
                   Основной
                 </button>
                 {viewMode === 'parallel' && (
                   <button 
                      onClick={() => setActiveLangTab('secondary')}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${activeLangTab === 'secondary' ? ts.controlActive : ts.controlInactive}`}
                   >
                     Второй
                   </button>
                 )}
               </div>
               
               {/* Current Selection Display */}
               <div className={`text-xs font-bold uppercase tracking-widest opacity-60 mb-2 ${ts.settingLabel}`}>
                 {activeLangTab === 'primary' ? 'Выбранный язык' : 'Второй язык'}
               </div>
               <div className={`text-sm font-semibold mb-4 ${ts.heading}`}>
                 {activeLangTab === 'primary' ? primaryLang : secondaryLang}
               </div>

               {/* Search */}
               <div className="relative mb-3">
                 <Search className={`absolute left-3 top-2.5 w-4 h-4 opacity-50 ${ts.text}`} />
                 <input 
                   type="text" 
                   placeholder="Найти или ввести язык..."
                   value={langSearch}
                   onChange={(e) => setLangSearch(e.target.value)}
                   className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${ts.inputBg} ${ts.text}`}
                 />
               </div>

               {/* List */}
               <div className={`flex-1 overflow-y-auto -mx-2 px-2 ${theme === 'dark' ? 'dark-scroll' : ''}`}>
                 <div className="space-y-1">
                   {filteredLanguages.map((lang, idx) => {
                     const isSelected = activeLangTab === 'primary' ? primaryLang === lang : secondaryLang === lang;
                     return (
                       <button
                         key={idx}
                         onClick={() => handleLanguageSelect(lang)}
                         className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors ${isSelected ? (theme === 'dark' ? 'bg-white/10' : 'bg-black/5') : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                       >
                         <span className={ts.text}>{lang}</span>
                         {isSelected && <Check size={16} className={ts.text} />}
                       </button>
                     );
                   })}
                 </div>
               </div>

             </div>
            )}
          </div>

          {/* Settings Button */}
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                setShowLangSettings(false);
                setShowChapterNav(false);
              }}
              className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-black/5 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'} ${ts.text}`}
            >
              <Settings size={20} />
            </button>

            {/* Settings Popover */}
            {showSettings && (
              <div 
                className={`absolute right-4 top-full mt-2 w-80 shadow-2xl border rounded-3xl p-5 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${ts.settingsBg} ${ts.settingsBorder}`}
              >
                <div className="space-y-6">
                  
                  {/* 1. Theme Selection */}
                  <div className="space-y-2">
                    <div className={`text-xs font-bold uppercase tracking-widest opacity-70 ${ts.settingLabel}`}>Тема</div>
                    <div className={`flex p-1 rounded-xl ${ts.controlBg}`}>
                      {(['white', 'sepia', 'dark'] as Theme[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                            theme === t ? ts.controlActive : ts.controlInactive
                          }`}
                        >
                          {t === 'white' ? 'Светлая' : t === 'sepia' ? 'Сепия' : 'Тёмная'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Font Size */}
                  <div className="space-y-2">
                    <div className={`text-xs font-bold uppercase tracking-widest opacity-70 ${ts.settingLabel}`}>Размер шрифта</div>
                    <div className={`flex items-center justify-between p-1 rounded-xl ${ts.controlBg}`}>
                      <button 
                        onClick={() => setFontSize(Math.max(0, fontSize - 1) as FontSize)}
                        disabled={fontSize === 0}
                        className={`h-10 w-12 flex items-center justify-center rounded-lg transition-colors ${fontSize === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5'} ${ts.text}`}
                      >
                        <Minus size={18} />
                      </button>
                      <div className="flex items-end gap-1 px-4">
                         <Type size={14} className={`mb-1 opacity-50 ${ts.text}`} />
                         <div className={`flex gap-1 mb-1.5`}>
                           {[0, 1, 2, 3, 4].map(i => (
                             <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= fontSize ? (theme === 'dark' ? 'bg-white' : 'bg-black') : 'bg-gray-300 dark:bg-gray-600'}`} />
                           ))}
                         </div>
                         <Type size={20} className={`${ts.text}`} />
                      </div>
                      <button 
                        onClick={() => setFontSize(Math.min(4, fontSize + 1) as FontSize)}
                        disabled={fontSize === 4}
                        className={`h-10 w-12 flex items-center justify-center rounded-lg transition-colors ${fontSize === 4 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5'} ${ts.text}`}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* 3. Text Width */}
                  <div className="space-y-2">
                    <div className={`text-xs font-bold uppercase tracking-widest opacity-70 ${ts.settingLabel}`}>Ширина текста</div>
                    <div className={`flex p-1 rounded-xl ${ts.controlBg}`}>
                      <button
                        onClick={() => setTextWidth('narrow')}
                        className={`flex-1 py-2 flex items-center justify-center rounded-lg transition-all ${textWidth === 'narrow' ? ts.controlActive : ts.controlInactive}`}
                        title="Узкая"
                      >
                        <BoxSelect size={18} />
                      </button>
                      <button
                        onClick={() => setTextWidth('normal')}
                        className={`flex-1 py-2 flex items-center justify-center rounded-lg transition-all ${textWidth === 'normal' ? ts.controlActive : ts.controlInactive}`}
                        title="Нормальная"
                      >
                        <Maximize2 size={18} className="rotate-90" />
                      </button>
                      <button
                        onClick={() => setTextWidth('wide')}
                        className={`flex-1 py-2 flex items-center justify-center rounded-lg transition-all ${textWidth === 'wide' ? ts.controlActive : ts.controlInactive}`}
                        title="Широкая"
                      >
                        <MoveHorizontal size={18} />
                      </button>
                    </div>
                  </div>

                  <div className={`border-t ${ts.settingsBorder}`}></div>

                  {/* 4. Red Letter Toggle */}
                  <button 
                    onClick={() => setRedLetterMode(!redLetterMode)}
                    className="w-full flex items-center justify-between group py-1"
                  >
                    <div className={`text-sm font-medium ${ts.text}`}>Выделить слова Иисуса</div>
                    <div className={`transition-colors ${redLetterMode ? 'text-red-600' : 'text-gray-300 dark:text-gray-600'}`}>
                      {redLetterMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </div>
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Reading Area */}
      <div className={`flex-1 overflow-y-auto px-4 md:px-12 scroll-smooth ${theme === 'dark' ? 'dark-scroll' : ''}`}>
        <div className={`${getTextWidthClass()} mx-auto py-8 md:py-12 transition-all duration-300 ease-in-out`}>
          
          {/* Verses */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <Loader2 className={`w-8 h-8 animate-spin ${ts.subHeading}`} />
              <p className={`text-sm tracking-widest uppercase opacity-70 ${ts.subHeading}`}>Загрузка текста</p>
            </div>
          ) : (
            <div className={`animate-fade-in ${fontFamily === 'serif' ? 'font-georgia' : 'font-sans'} ${getFontSize()} ${ts.text} transition-all duration-300`}>
              
              {/* Single View Mode */}
              {viewMode === 'single' && verses.map((v) => (
                <div key={v.verse} className="relative group mb-2 pl-2 md:pl-0">
                  <span className={`absolute -left-8 md:-left-12 top-1 text-xs md:text-sm font-sans font-medium select-none transition-colors opacity-60 group-hover:opacity-100 ${ts.verseNum} w-8 text-right`}>
                    {v.verse}
                  </span>
                  <p className="transition-colors">
                    {renderVerseText(v.text)}
                  </p>
                </div>
              ))}

              {/* Parallel View Mode */}
              {viewMode === 'parallel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                   {verses.map((v) => (
                     <React.Fragment key={v.verse}>
                        <div className="relative group pl-2 md:pl-0">
                            <span className={`absolute -left-8 top-1 text-xs md:text-sm font-sans font-medium select-none opacity-60 ${ts.verseNum}`}>
                                {v.verse}
                            </span>
                            <p className="transition-colors">{renderVerseText(v.text)}</p>
                        </div>
                        <div className={`relative pl-2 md:pl-0 pb-4 md:pb-0 md:border-l ${ts.divider} md:pl-8`}>
                            <p className={`transition-colors ${ts.textSec}`}>{renderVerseText(v.textSecondary || '')}</p>
                        </div>
                        <div className={`col-span-1 md:col-span-2 border-b ${ts.divider} my-2 md:hidden`}></div>
                     </React.Fragment>
                   ))}
                </div>
              )}

              {/* Interlinear View Mode (UPDATED) */}
              {viewMode === 'interlinear' && verses.map((v) => (
                <div key={v.verse} className="relative mb-8 pl-6 md:pl-8">
                   <span className={`absolute left-0 top-1 text-xs md:text-sm font-sans font-medium select-none opacity-60 ${ts.verseNum}`}>
                    {v.verse}
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-6">
                    {/* Render word-by-word if available */}
                    {v.interlinearData ? (
                      v.interlinearData.map((word, wIdx) => (
                         <div 
                           key={wIdx} 
                           className={`flex flex-col items-center cursor-pointer rounded px-1 transition-colors duration-200 ${ts.interlinearHover} group/word`}
                         >
                           {/* Original (Greek/Hebrew) - ADDED transition-all duration-300 */}
                           <span className={`${ilSizes.orig} font-serif mb-1 ${ts.textOrig} group-hover/word:text-[#d32f2f] transition-all duration-300`}>
                             {word.original}
                           </span>
                           {/* Translation - ADDED transition-all duration-300 */}
                           <span className={`${ilSizes.trans} text-center opacity-80 ${ts.text} group-hover/word:opacity-100 font-medium transition-all duration-300`}>
                             {renderVerseText(word.translation)}
                           </span>
                         </div>
                      ))
                    ) : (
                      /* Fallback if API didn't return structured data yet or error */
                      <p className="italic opacity-50">Данные подстрочного перевода загружаются...</p>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}

          {/* Navigation */}
          {!isLoading && (
            <div className={`flex justify-between items-center mt-20`}>
              <button
                onClick={() => onNavigate('prev')}
                disabled={!hasPrev}
                className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-2xl transition-all duration-200 group text-left ${
                  hasPrev ? ts.navBtn : ts.navDisabled
                }`}
              >
                <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs opacity-60 font-medium">Предыдущая</span>
                  <span className="font-serif font-bold text-sm md:text-base whitespace-nowrap">{prevLabel || 'Начало'}</span>
                </div>
              </button>

              <button
                onClick={() => onNavigate('next')}
                disabled={!hasNext}
                className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-2xl transition-all duration-200 group text-right ${
                  hasNext ? ts.navBtn : ts.navDisabled
                }`}
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs opacity-60 font-medium">Следующая</span>
                  <span className="font-serif font-bold text-sm md:text-base whitespace-nowrap">{nextLabel || 'Конец'}</span>
                </div>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
