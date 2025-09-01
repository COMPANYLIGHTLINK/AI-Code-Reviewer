
import React, { useState, useCallback } from 'react';
import CodeInput from './components/CodeInput';
import FeedbackDisplay from './components/FeedbackDisplay';
import { reviewCode } from './services/geminiService';
import type { CodeReviewResponse } from './types';
import { LANGUAGES } from './constants';
import { GithubIcon } from './components/icons';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [review, setReview] = useState<CodeReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReview(null);

    try {
      const result = await reviewCode(code, language);
      setReview(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center pb-6 border-b border-slate-700">
          <div className='flex items-center gap-3'>
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 17.25 1.007 1.007a.75.75 0 0 0 1.06 0L12 17.25m0 0 2.47-2.47m-2.47 2.47L9.53 14.78" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI Code Reviewer</h1>
          </div>
           <a href="https://github.com/google/generative-ai-docs/tree/main/app-integration/web-apps/react-code-reviewer" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <GithubIcon className="w-6 h-6" />
           </a>
        </header>

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-200">Enter Your Code</h2>
            <CodeInput
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-200">Analysis & Feedback</h2>
            <FeedbackDisplay
              review={review}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
