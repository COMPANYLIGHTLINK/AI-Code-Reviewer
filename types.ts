
export type FeedbackCategory = 'Bug' | 'Style' | 'Performance' | 'Best Practice' | 'Security';

export interface FeedbackItem {
  category: FeedbackCategory;
  line?: number;
  comment: string;
}

export interface CodeReviewResponse {
  summary: string;
  feedback: FeedbackItem[];
}
