
import React from 'react';
import { ArrowLeft, BookOpen, SearchX } from 'lucide-react';
import { SearchResult, Theme } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onBack: () => void;
  onSelectResult: (book: string, chapter: number, verse: number) => void;
  theme: Theme;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  onBack,
  onSelectResult,
  theme,
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-[#1C1C1E]',
          card: 'bg-[#2C2C2E]',
          text: 'text-[#E5E5E7]',
          heading: 'text-white',
          subheading: 'text-gray-400',
          border: 'border-white/10',
          highlight: 'bg-yellow-500/20 text-yellow-200',
        };
      case 'sepia':
        return {
          bg: 'bg-[#F9F5EB]',
          card: 'bg-[#F2EFE5]',
          text: 'text-[#5B4D3C]',
          heading: 'text-[#433422]',
          subheading: 'text-[#8C7B68]',
          border: 'border-[#DCCFB4]',
          highlight: 'bg-[#E6DEC8] text-[#433422]',
        };
      default:
        return {
          bg: 'bg-white',
          card: 'bg-gray-50',
          text: 'text-gray-600',
          heading: 'text-gray-900',
          subheading: 'text-gray-500',
          border: 'border-gray-200',
          highlight: 'bg-yellow-100 text-gray-900',
        };
    }
  };

  const ts = getThemeStyles();

  return (
    <div className={`flex-1 h-full overflow-y-auto ${ts.bg}`}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 text-sm font-medium mb-4 transition-opacity hover:opacity-70 ${ts.subheading}`}
          >
            <ArrowLeft size={16} />
            Назад к выбору
          </button>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${ts.heading}`}>
            Результаты поиска
          </h2>
          <p className={`text-sm ${ts.subheading}`}>
            По запросу: «{query}» найдено {results.length} рез.
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((res, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectResult(res.book, res.chapter, res.verse)}
                className={`p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] ${ts.card} ${ts.heading}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="opacity-50" />
                    <span className="font-bold text-sm uppercase tracking-wider">
                      {res.book} {res.chapter}:{res.verse}
                    </span>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed font-serif ${ts.text}`}>
                  {res.text}
                </p>
              </div>
            ))
          ) : (
            <div className={`text-center py-20 opacity-60 flex flex-col items-center gap-4 ${ts.text}`}>
              <SearchX size={48} strokeWidth={1} />
              <p>Ничего не найдено. Попробуйте другой запрос.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
