import { supabase } from "../supabase-client";

export interface QuizSetRecord {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizWordRecord {
  id: string;
  setId: string;
  question: string;
  answer: string;
  hint?: string;
  proficiency: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSessionRecord {
  id: string;
  setIds: string[];
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  createdAt: string;
}

export interface QuizSetWithMeta extends QuizSetRecord {
  wordCount: number;
}

export interface QuizSnapshot {
  sets: QuizSetWithMeta[];
  words: QuizWordRecord[];
  sessions: QuizSessionRecord[];
}

type CreateSetPayload = Pick<QuizSetRecord, "name" | "description">;
type UpdateSetPayload = Partial<Pick<QuizSetRecord, "name" | "description">>;

type CreateWordPayload = Pick<QuizWordRecord, "question" | "answer" | "hint"> & { setId: string };
type UpdateWordPayload = Partial<Pick<QuizWordRecord, "question" | "answer" | "hint" | "proficiency">>;

type RecordSessionPayload = {
  setIds: string[];
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
};

type QuizSetRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

type QuizWordRow = {
  id: string;
  set_id: string;
  question: string;
  answer: string;
  hint: string | null;
  proficiency: number | null;
  created_at: string;
  updated_at: string;
};

type QuizSessionRow = {
  id: string;
  set_ids: string[];
  mode: string;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  created_at: string;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const mapSet = (row: QuizSetRow): QuizSetRecord => ({
  id: row.id,
  name: row.name,
  description: row.description ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapWord = (row: QuizWordRow): QuizWordRecord => ({
  id: row.id,
  setId: row.set_id,
  question: row.question,
  answer: row.answer,
  hint: row.hint ?? undefined,
  proficiency: row.proficiency ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapSession = (row: QuizSessionRow): QuizSessionRecord => ({
  id: row.id,
  setIds: row.set_ids,
  mode: row.mode,
  totalQuestions: row.total_questions,
  correctAnswers: row.correct_answers,
  accuracy: Number(row.accuracy),
  createdAt: row.created_at,
});

const ensureNoError = <T>(result: { data: T; error: { message: string } | null }) => {
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (!result.data) {
    throw new Error("Supabase response missing data.");
  }
  return result.data;
};

const fetchSetsRaw = async (): Promise<QuizSetRecord[]> => {
  const response = await supabase.from<QuizSetRow>("quiz_sets").select("*").order("created_at", { ascending: true });
  return ensureNoError(response).map(mapSet);
};

const fetchWordsRaw = async (setId?: string): Promise<QuizWordRecord[]> => {
  let query = supabase.from<QuizWordRow>("quiz_words").select("*").order("created_at", { ascending: true });
  if (setId && setId !== "all") {
    query = query.eq("set_id", setId);
  }
  const response = await query;
  return ensureNoError(response).map(mapWord);
};

const fetchSessionsRaw = async (): Promise<QuizSessionRecord[]> => {
  const response = await supabase
    .from<QuizSessionRow>("quiz_sessions")
    .select("*")
    .order("created_at", { ascending: false });
  return ensureNoError(response).map(mapSession);
};

const withWordCounts = (sets: QuizSetRecord[], words: QuizWordRecord[]): QuizSetWithMeta[] => {
  const counts = words.reduce<Map<string, number>>((acc, word) => {
    acc.set(word.setId, (acc.get(word.setId) ?? 0) + 1);
    return acc;
  }, new Map());
  return sets.map((set) => ({
    ...set,
    wordCount: counts.get(set.id) ?? 0,
  }));
};

export const quizApi = {
  async fetchSnapshot(): Promise<QuizSnapshot> {
    const [sets, words, sessions] = await Promise.all([
      fetchSetsRaw(),
      fetchWordsRaw(),
      fetchSessionsRaw(),
    ]);
    return {
      sets: withWordCounts(sets, words),
      words,
      sessions,
    };
  },

  async fetchSets(): Promise<QuizSetWithMeta[]> {
    const [sets, words] = await Promise.all([fetchSetsRaw(), fetchWordsRaw()]);
    return withWordCounts(sets, words);
  },

  async createSet(payload: CreateSetPayload): Promise<QuizSetWithMeta> {
    const now = new Date().toISOString();
    const insertPayload = {
      name: payload.name.trim(),
      description: payload.description?.trim() ?? null,
      created_at: now,
      updated_at: now,
    };

    const response = await supabase
      .from<QuizSetRow>("quiz_sets")
      .insert(insertPayload)
      .select()
      .single();

    const row = ensureNoError(response);
    return { ...mapSet(row), wordCount: 0 };
  },

  async updateSet(id: string, payload: UpdateSetPayload): Promise<QuizSetWithMeta> {
    const updatePayload: Partial<QuizSetRow> = {
      name: payload.name?.trim(),
      description: payload.description?.trim() ?? null,
      updated_at: new Date().toISOString(),
    };

    if (updatePayload.name === undefined) {
      delete updatePayload.name;
    }
    if (payload.description === undefined) {
      delete updatePayload.description;
    }

    const response = await supabase
      .from<QuizSetRow>("quiz_sets")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    const row = ensureNoError(response);

    const { count } = await supabase
      .from<QuizWordRow>("quiz_words")
      .select("id", { count: "exact", head: true })
      .eq("set_id", id);

    return { ...mapSet(row), wordCount: count ?? 0 };
  },

  async deleteSet(id: string): Promise<void> {
    const response = await supabase.from("quiz_sets").delete().eq("id", id);
    ensureNoError(response);
  },

  async fetchWords(setId?: string): Promise<QuizWordRecord[]> {
    return fetchWordsRaw(setId);
  },

  async createWord(payload: CreateWordPayload): Promise<QuizWordRecord> {
    const now = new Date().toISOString();
    const response = await supabase
      .from<QuizWordRow>("quiz_words")
      .insert({
        set_id: payload.setId,
        question: payload.question.trim(),
        answer: payload.answer.trim(),
        hint: payload.hint?.trim() ?? null,
        proficiency: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    const row = ensureNoError(response);
    return mapWord(row);
  },

  async updateWord(id: string, payload: UpdateWordPayload): Promise<QuizWordRecord> {
    const updatePayload: Partial<QuizWordRow> = {
      question: payload.question?.trim(),
      answer: payload.answer?.trim(),
      hint: payload.hint !== undefined ? payload.hint?.trim() ?? null : undefined,
      proficiency: payload.proficiency,
      updated_at: new Date().toISOString(),
    };

    if (updatePayload.question === undefined) delete updatePayload.question;
    if (updatePayload.answer === undefined) delete updatePayload.answer;
    if (payload.hint === undefined) delete updatePayload.hint;
    if (updatePayload.proficiency === undefined) delete updatePayload.proficiency;

    const response = await supabase
      .from<QuizWordRow>("quiz_words")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();
    const row = ensureNoError(response);
    return mapWord(row);
  },

  async updateWordProficiency(id: string, delta: number): Promise<QuizWordRecord> {
    const current = await supabase.from<QuizWordRow>("quiz_words").select("*").eq("id", id).single();
    const row = ensureNoError(current);
    const nextProficiency = clamp((row.proficiency ?? 0) + delta, 0, 100);
    return this.updateWord(id, { proficiency: nextProficiency });
  },

  async deleteWord(id: string): Promise<void> {
    const response = await supabase.from("quiz_words").delete().eq("id", id);
    ensureNoError(response);
  },

  async recordSession(payload: RecordSessionPayload): Promise<QuizSessionRecord> {
    const total = Math.max(payload.totalQuestions, 1);
    const correct = clamp(payload.correctAnswers, 0, total);
    const accuracy = Number(((correct / total) * 100).toFixed(1));
    const response = await supabase
      .from<QuizSessionRow>("quiz_sessions")
      .insert({
        set_ids: payload.setIds,
        mode: payload.mode,
        total_questions: total,
        correct_answers: correct,
        accuracy,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    const row = ensureNoError(response);
    return mapSession(row);
  },

  async fetchSessions(): Promise<QuizSessionRecord[]> {
    return fetchSessionsRaw();
  },
};

