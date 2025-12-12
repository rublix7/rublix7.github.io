
import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Scroll, Cross } from 'lucide-react';
import { BIBLE_BOOKS } from '../constants';
import { Theme, BibleBook } from '../types';

interface HomePageProps {
  onSelectBook: (bookName: string) => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
  theme: Theme;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectBook,
  onSearch,
  isSearching,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Harmonious Theme Styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-[#1C1C1E]',
          text: 'text-zinc-300',
          heading: 'text-zinc-100',
          muted: 'text-zinc-500',
          cardBg: 'bg-white/5',
          inputBg: 'bg-white/10 focus:bg-white/15',
          border: 'border-white/10',
          accent: 'text-blue-400',
          bookHover: 'hover:bg-white/10 hover:text-zinc-100',
          iconBg: 'bg-white/10 text-zinc-300',
        };
      case 'sepia':
        return {
          bg: 'bg-[#F9F5EB]',
          text: 'text-[#5B4D3C]',
          heading: 'text-[#433422]',
          muted: 'text-[#8C7B68]',
          cardBg: 'bg-[#F2EFE5]',
          inputBg: 'bg-[#E6DEC8]/50 focus:bg-[#E6DEC8]/80',
          border: 'border-[#DCCFB4]',
          accent: 'text-[#8C735A]',
          bookHover: 'hover:bg-[#E6DEC8]/60 hover:text-[#2C241B]',
          iconBg: 'bg-[#E6DEC8] text-[#5B4D3C]',
        };
      default:
        return {
          bg: 'bg-white',
          text: 'text-slate-600',
          heading: 'text-slate-900',
          muted: 'text-slate-400',
          cardBg: 'bg-slate-50',
          inputBg: 'bg-white shadow-sm border border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10',
          border: 'border-slate-200',
          accent: 'text-blue-600',
          bookHover: 'hover:bg-white hover:shadow-sm hover:text-blue-700',
          iconBg: 'bg-slate-100 text-slate-700',
        };
    }
  };

  const ts = getThemeStyles();

  // Helper to categorize books
  const getBooks = (testament: 'old' | 'new', category?: string) => {
    return BIBLE_BOOKS.filter(b => b.testament === testament && (!category || b.category === category));
  };

  const CategorySection = ({ title, books }: { title: string, books: BibleBook[] }) => {
    if (books.length === 0) return null;
    return (
      <div className="mb-12 break-inside-avoid">
        <h4 className={`text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-4 ${ts.muted}`}>
          {title}
          <div className={`h-px flex-1 opacity-20 ${theme === 'dark' ? 'bg-white' : 'bg-current'}`} />
        </h4>
        {/* Changed grid-cols to 1 for vertical list, removed truncate to show full name */}
        <div className="grid grid-cols-1 gap-1">
          {books.map((book) => (
            <button
              key={book.name}
              onClick={() => onSelectBook(book.name)}
              className={`px-4 py-3 text-left text-lg font-medium rounded-xl transition-all duration-200 whitespace-normal ${ts.text} ${ts.bookHover}`}
            >
              {book.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex-1 h-full overflow-y-auto ${ts.bg} transition-colors duration-500`}>
      <div className={`max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16 flex flex-col min-h-full transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header / Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          {/* Top Icon Removed */}
          
          <h1 className={`text-4xl md:text-6xl font-serif font-black tracking-tight mb-6 mt-4 ${ts.heading}`}>
            БИБЛИЯ
          </h1>
          
          <p className={`text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto ${ts.text}`}>
            Исследуйте Библию глубже, чем когда-либо. Читайте на родном языке или прикасайтесь к истокам, мгновенно открывая подстрочный перевод с иврита и греческого. созданный для тишины и размышлений.
          </p>

          {/* Optimized Search Bar */}
          <div className="mt-12 relative max-w-xl mx-auto z-10">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                placeholder="Поиск по Библии (например: «Любовь»)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-12 py-4 rounded-2xl text-lg outline-none transition-all duration-300 ${ts.inputBg} ${ts.heading} placeholder:opacity-50`}
              />
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearching ? 'animate-spin' : ''} ${ts.muted} group-focus-within:text-blue-500`}>
                 {isSearching ? <Loader2 size={20} /> : <Search size={20} />}
              </div>
              {searchQuery && !isSearching && (
                 <button 
                  type="submit"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all hover:scale-110 ${ts.accent}`}
                 >
                   <Sparkles size={18} fill="currentColor" className="opacity-80" />
                 </button>
              )}
            </form>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
            {/* Decorative Divider for large screens */}
            <div className={`hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -ml-px opacity-10 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}></div>

            {/* Old Testament */}
            <div>
                <div className="flex items-center gap-4 mb-10">
                    <div className={`p-2 rounded-lg ${ts.cardBg}`}>
                        <Scroll size={24} className={ts.accent} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-serif font-bold ${ts.heading}`}>Ветхий Завет</h2>
                        <p className={`text-xs font-bold uppercase tracking-wider opacity-50 ${ts.text}`}>50 Книг</p>
                    </div>
                </div>

                <CategorySection title="Пятикнижие Моисея" books={getBooks('old', 'pentateuch')} />
                <CategorySection title="Книги исторические" books={getBooks('old', 'history')} />
                <CategorySection title="Книги учительные" books={getBooks('old', 'wisdom')} />
                <CategorySection title="Книги пророческие" books={getBooks('old', 'prophets')} />
            </div>

            {/* New Testament */}
            <div>
                <div className="flex items-center gap-4 mb-10">
                    <div className={`p-2 rounded-lg ${ts.cardBg}`}>
                         {/* Changed icon to Cross for Jesus reference */}
                         <Cross size={24} className={ts.accent} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-serif font-bold ${ts.heading}`}>Новый Завет</h2>
                        <p className={`text-xs font-bold uppercase tracking-wider opacity-50 ${ts.text}`}>27 Книг</p>
                    </div>
                </div>

                <CategorySection title="Евангелия" books={getBooks('new', 'gospels')} />
                <CategorySection title="Деяния святых Апостолов" books={getBooks('new', 'acts')} />
                <CategorySection title="Соборные Послания" books={getBooks('new', 'catholic')} />
                <CategorySection title="Послания св. Апостола Павла" books={getBooks('new', 'pauline')} />
                <CategorySection title="Книга пророческая" books={getBooks('new', 'revelation')} />
            </div>
        </div>

        {/* Footer */}
        <div className={`mt-auto pt-24 pb-12 text-center`}>
           <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-60 ${ts.cardBg} ${ts.text}`}>
              <span>создано с любовью</span>
           </div>
        </div>

      </div>
    </div>
  );
};
