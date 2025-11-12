export type TrainingMode = "education" | "accuracy" | "speed" | "flashcards";

export interface WordSet {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Word {
  id: string;
  setId: string;
  term: string;
  translation: string;
  example?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingResult {
  id: string;
  setId: string | "all";
  mode: TrainingMode;
  totalQuestions: number;
  correctAnswers: number;
  durationSeconds: number;
  startedAt: string;
  finishedAt: string;
}

export interface CreateWordSetInput {
  name: string;
  description?: string;
}

export interface UpdateWordSetInput {
  name?: string;
  description?: string;
}

export interface CreateWordInput {
  setId: string;
  term: string;
  translation: string;
  example?: string;
}

export interface UpdateWordInput {
  term?: string;
  translation?: string;
  example?: string;
}


