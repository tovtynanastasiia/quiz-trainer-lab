// TypeScript типи для Quiz Trainer

export interface Set {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Word {
  id: string;
  set_id: string;
  hint: string;
  answer: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  set_id: string;
  word_id: string;
  short_memory: number; // 0-5
  updated_at: string;
}

export interface AccuracyResult {
  id: string;
  user_id: string;
  set_id: string;
  correct_count: number;
  total_words: number;
  time_taken: number;
  created_at: string;
}

export interface SpeedResult {
  id: string;
  user_id: string;
  set_id: string;
  words_completed: number;
  time_limit: number;
  created_at: string;
}
