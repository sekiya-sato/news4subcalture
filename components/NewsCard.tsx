import React from 'react';
import type { Article } from '../types';

interface NewsCardProps {
  article: Article;
  isFeatured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, isFeatured = false }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out hover:shadow-xl border border-slate-100 h-full flex flex-col">
            <div className="p-6 flex flex-col flex-grow">
                <h3 className={`font-semibold text-slate-800 mb-2 ${isFeatured ? 'text-2xl' : 'text-lg'}`}>{article.title}</h3>
                <p className={`text-slate-600 leading-relaxed mb-4 flex-grow ${isFeatured ? 'text-base' : 'text-sm'}`}>{article.summary}</p>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex self-start items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mt-auto"
                >
                    続きを読む
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    );
};