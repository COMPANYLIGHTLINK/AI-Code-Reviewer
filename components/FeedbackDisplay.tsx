
import React from 'react';
import type { CodeReviewResponse, FeedbackItem, FeedbackCategory } from '../types';
import { BugIcon, PerformanceIcon, StyleIcon, BestPracticeIcon, SecurityIcon, LightbulbIcon } from './icons';

const categoryConfig: Record<FeedbackCategory, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; }> = {
  'Bug': { icon: BugIcon, color: 'border-red-500/50' },
  'Security': { icon: SecurityIcon, color: 'border-yellow-500/50' },
  'Performance': { icon: PerformanceIcon, color: 'border-blue-500/50' },
  'Style': { icon: StyleIcon, color: 'border-purple-500/50' },
  'Best Practice': { icon: BestPracticeIcon, color: 'border-green-500/50' },
};

const FeedbackCard: React.FC<{ item: FeedbackItem }> = ({ item }) => {
  const config = categoryConfig[item.category] || { icon: LightbulbIcon, color: 'border-slate-500/50' };
  const Icon = config.icon;

  return (
    <div className={`bg-slate-800/50 p-4 rounded-lg border-l-4 ${config.color} shadow-md`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-1">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-slate-200">{item.category}</h4>
            {item.line && (
              <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                Line {item.line}
              </span>
            )}
          </div>
          <p className="mt-1 text-slate-300 text-sm">{item.comment}</p>
        </div>
      </div>
    </div>
  );
};

interface FeedbackDisplayProps {
  review: CodeReviewResponse | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="h-6 w-3/4 bg-slate-700 rounded-md animate-pulse-fast"></div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
          <div className="w-6 h-6 bg-slate-700 rounded-full animate-pulse-fast"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 bg-slate-700 rounded-md animate-pulse-fast"></div>
            <div className="h-4 w-full bg-slate-700 rounded-md animate-pulse-fast"></div>
            <div className="h-4 w-5/6 bg-slate-700 rounded-md animate-pulse-fast"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ review, isLoading, error }) => {
  const hasFeedback = review && review.feedback.length > 0;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-4 sm:p-6 min-h-[426px] flex flex-col">
      {isLoading && <LoadingSkeleton />}
      
      {error && (
        <div className="m-auto text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-red-400">Analysis Failed</h3>
          <p className="mt-1 text-sm text-slate-400">{error}</p>
        </div>
      )}

      {!isLoading && !error && !review && (
        <div className="m-auto text-center text-slate-500">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-slate-400">Ready for Analysis</h3>
          <p className="mt-1 text-sm">Your code review feedback will appear here.</p>
        </div>
      )}

      {!isLoading && !error && review && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-200">Summary</h3>
            <p className="text-slate-300 mt-1 italic">"{review.summary}"</p>
          </div>
          
          {hasFeedback && (
            <div className="space-y-3">
              {review.feedback.map((item, index) => (
                <FeedbackCard key={index} item={item} />
              ))}
            </div>
          )}
          
          {!hasFeedback && (
            <div className="text-center p-8 border-2 border-dashed border-slate-700 rounded-lg">
                <h3 className="text-lg font-medium text-green-400">Great job!</h3>
                <p className="mt-1 text-sm text-slate-400">No specific issues were found in your code.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
