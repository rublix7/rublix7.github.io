
import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen, X, PanelLeftClose } from 'lucide-react';
import { BIBLE_BOOKS } from '../constants';
import { BibleBook, Theme } from '../types';

interface SidebarProps {
  currentBook: string;
  currentChapter: number;
  onSelectBook: (bookName: string) => void;
  onSelectChapter: (bookName: string, chapter: number) => void;
  onGoHome: () => void;
  isOpen: boolean;
  onCloseSidebar: () => void;
  theme: Theme;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentBook,
  currentChapter,
  onSelectBook,
  onSelectChapter,
  onGoHome,
  isOpen,
  onCloseSidebar,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBook, setExpandedBook] = useState<string | null>(null);

  // Toggle book expansion logic
  const toggleBook = (bookName: string) => {
    if (expandedBook === bookName) {
      setExpandedBook(null);
    } else {
      setExpandedBook(bookName);
      onSelectBook(bookName);
    }
  };

  // Filter books based on search
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter(book =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const oldTestament = filteredBooks.filter(b => b.testament === 'old');
  const newTestament = filteredBooks.filter(b => b.testament === 'new');

  // Dynamic Styles based on Theme
  const getThemeClasses = () => {
    switch(theme) {
      case 'dark':
        return {
          bg: 'bg-[#1c1c1e]',
          border: 'border-white/5',
          text: 'text-zinc-400',
          heading: 'text-zinc-100',
          inputBg: 'bg-white/5',
          inputIcon: 'text-zinc-500',
          itemHover: 'hover:bg-white/5 hover:text-zinc-200',
          itemActive: 'bg-blue-500/10 text-blue-400',
          chapterBtn: 'text-zinc-400 hover:text-white hover:bg-white/10',
          chapterActive: 'bg-blue-600 text-white shadow-lg shadow-blue-900/20',
          divider: 'border-white/5',
          iconButton: 'hover:bg-white/10 text-zinc-400',
        };
      case 'sepia':
        return {
          bg: 'bg-[#F2EFE5]',
          border: 'border-[#E6DEC8]',
          text: 'text-[#6B5A4A]',
          heading: 'text-[#433422]',
          inputBg: 'bg-[#E6DEC8]/40',
          inputIcon: 'text-[#9C8974]',
          itemHover: 'hover:bg-[#E6DEC8]/50 hover:text-[#433422]',
          itemActive: 'bg-[#8C735A]/10 text-[#8C735A]',
          chapterBtn: 'text-[#8C735A] hover:text-[#433422] hover:bg-[#DCCFB4]/50',
          chapterActive: 'bg-[#8C735A] text-[#F9F5EB] shadow-md',
          divider: 'border-[#DCCFB4]',
          iconButton: 'hover:bg-[#E6DEC8] text-[#8C735A]',
        };
      default: // white
        return {
          bg: 'bg-[#F9F9FB]',
          border: 'border-gray-200/60',
          text: 'text-gray-500',
          heading: 'text-gray-900',
          inputBg: 'bg-white shadow-sm ring-1 ring-gray-200',
          inputIcon: 'text-gray-400',
          itemHover: 'hover:bg-white hover:shadow-sm hover:text-gray-900',
          itemActive: 'bg-white shadow-sm text-blue-600 ring-1 ring-gray-200',
          chapterBtn: 'text-gray-400 hover:text-gray-900 hover:bg-gray-100',
          chapterActive: 'bg-black text-white shadow-lg',
          divider: 'border-gray-200',
          iconButton: 'hover:bg-gray-200 text-gray-500',
        };
    }
  };

  const tc = getThemeClasses();

  const renderBookList = (books: BibleBook[]) => {
    if (books.length === 0) return null;
    return (
      <ul className="space-y-0.5">
        {books.map((book) => {
          const isExpanded = expandedBook === book.name || currentBook === book.name;
          const isSelected = currentBook === book.name;
          
          return (
            <li key={book.name} className="select-none">
              <button
                onClick={() => toggleBook(book.name)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200 group ${
                  isSelected
                    ? tc.itemActive
                    : tc.text + ' ' + tc.itemHover
                }`}
              >
                <span>{book.name}</span>
                {isExpanded ? 
                  <ChevronDown size={14} className="opacity-50" /> : 
                  <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                }
              </button>

              {/* Chapter Grid */}
              <div 
                className={`grid grid-cols-5 gap-1.5 overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded 
                    ? `max-h-[3000px] opacity-100 py-2 px-3` 
                    : 'max-h-0 opacity-0'
                }`}
              >
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chap) => (
                  <button
                    key={chap}
                    onClick={() => {
                      onSelectChapter(book.name, chap);
                    }}
                    className={`h-8 rounded-[6px] text-xs font-semibold transition-all duration-200 ${
                      currentBook === book.name && currentChapter === chap
                        ? tc.chapterActive
                        : tc.chapterBtn
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 ${tc.bg} border-r ${tc.border} transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 ${!isOpen ? 'md:-ml-72' : ''}`}
    >
      {/* 1. Header: Title & Search */}
      <div className={`px-4 pt-5 pb-2 flex-shrink-0 flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <button 
            onClick={onGoHome}
            className={`flex items-center gap-2.5 group outline-none`}
            title="На главную"
          >
            <div className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-white/10 group-hover:bg-white/20' : 'bg-black/5 group-hover:bg-black/10'}`}>
              <BookOpen className={`w-4 h-4 ${tc.heading}`} />
            </div>
            <h1 className={`text-base font-bold tracking-tight ${tc.heading}`}>Библия</h1>
          </button>
          
          <button 
            onClick={onCloseSidebar}
            className={`p-1.5 rounded-lg transition-colors ${tc.iconButton}`}
            title="Свернуть меню"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Search moved to top */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Фильтр книг..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400/70 ${tc.inputBg} ${tc.heading}`}
          />
          <Search className={`absolute left-3 top-2.5 w-4 h-4 transition-colors ${tc.inputIcon} group-focus-within:text-blue-500`} />
        </div>
      </div>

      <div className={`mx-4 mt-2 mb-1 border-b ${tc.divider}`} />

      {/* 2. Scrollable Area: Books */}
      <div className={`flex-1 overflow-y-auto px-2 pb-4 ${theme === 'dark' ? 'dark-scroll' : ''}`}>
        {oldTestament.length > 0 && (
          <div className="mb-4 mt-2">
            <h3 className={`px-4 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50 ${tc.heading}`}>
              Ветхий Завет
            </h3>
            {renderBookList(oldTestament)}
          </div>
        )}

        {oldTestament.length > 0 && newTestament.length > 0 && (
          <div className={`mx-4 my-4 border-t ${tc.divider}`} />
        )}

        {newTestament.length > 0 && (
          <div>
            <h3 className={`px-4 text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50 ${tc.heading}`}>
              Новый Завет
            </h3>
            {renderBookList(newTestament)}
          </div>
        )}
        
        {oldTestament.length === 0 && newTestament.length === 0 && (
          <div className="text-center py-12 opacity-40 text-sm">
            Книги не найдены
          </div>
        )}
      </div>

    </aside>
  );
};
