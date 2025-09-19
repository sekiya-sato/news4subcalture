import React, { useState, useEffect, useCallback } from 'react';
import type { Article, GroundingChunk } from './types';
import { fetchJapaneseNews } from './services/geminiService';
import { NewsCard } from './components/NewsCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleFetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setArticles([]);
    setSources([]);

    try {
      const { articles: fetchedArticles, sources: fetchedSources } = await fetchJapaneseNews();
      setArticles(fetchedArticles);
      setSources(fetchedSources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueSources = Array.from(
    new Map(sources.map(s => [s.web?.uri, s])).values()
  ).filter(s => s.web?.uri);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className='flex items-center space-x-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3m-3 4h3" />
              </svg>
              <h1 className="text-2xl font-bold text-slate-800">AIサブカルニュース</h1>
            </div>
            <button
              onClick={handleFetchNews}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" />
              </svg>
              {isLoading ? '更新中...' : '更新'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        
        {!isLoading && !error && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6">
              {articles.map((article, index) => {
                const isFeatured = index === 0;
                const containerClasses = isFeatured
                  ? 'md:col-span-2 lg:col-span-2 lg:row-span-2'
                  : 'lg:col-span-1';
                
                return (
                  <div key={article.url || index} className={containerClasses}>
                    <NewsCard article={article} isFeatured={isFeatured} />
                  </div>
                );
              })}
            </div>

            {uniqueSources.length > 0 && (
              <div className="mt-12 pt-6 border-t border-slate-200">
                <h2 className="text-lg font-semibold text-slate-700 mb-4">参照元</h2>
                <ul className="space-y-2">
                  {uniqueSources.map((source, index) => (
                     source.web && (
                        <li key={index} className="text-sm">
                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors break-all">
                            {source.web.title || source.web.uri}
                        </a>
                        </li>
                     )
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;