import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  quizApi,
  QuizSetWithMeta,
  QuizSessionRecord,
  QuizWordRecord,
} from "../api/quizApi";

interface QuizDataContextValue {
  sets: QuizSetWithMeta[];
  words: QuizWordRecord[];
  sessions: QuizSessionRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
  createSet: (payload: { name: string; description?: string }) => Promise<void>;
  updateSet: (id: string, payload: { name?: string; description?: string }) => Promise<void>;
  deleteSet: (id: string) => Promise<void>;
  createWord: (payload: { setId: string; question: string; answer: string; hint?: string }) => Promise<void>;
  updateWord: (id: string, payload: { question?: string; answer?: string; hint?: string }) => Promise<void>;
  updateWordProficiency: (id: string, delta: number) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  recordSession: (payload: {
    setIds: string[];
    mode: string;
    totalQuestions: number;
    correctAnswers: number;
  }) => Promise<void>;
}

const QuizDataContext = createContext<QuizDataContextValue | undefined>(undefined);

export const QuizDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [sets, setSets] = useState<QuizSetWithMeta[]>([]);
  const [words, setWords] = useState<QuizWordRecord[]>([]);
  const [sessions, setSessions] = useState<QuizSessionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await quizApi.fetchSnapshot();
      setSets(snapshot.sets);
      setWords(snapshot.words);
      setSessions(snapshot.sessions);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSet = useCallback(
    async (payload: { name: string; description?: string }) => {
      const trimmed = { ...payload, name: payload.name.trim(), description: payload.description?.trim() };
      if (!trimmed.name) {
        throw new Error("Назва набору не може бути порожньою.");
      }
      const duplicate = sets.some(
        (set) => set.name.toLowerCase() === trimmed.name.toLowerCase(),
      );
      if (duplicate) {
        throw new Error("Набір з такою назвою вже існує.");
      }
      const newSet = await quizApi.createSet(trimmed);
      setSets((prev) => [...prev, newSet]);
    },
    [sets],
  );

  const updateSet = useCallback(
    async (id: string, payload: { name?: string; description?: string }) => {
      if (payload.name) {
        const normalizedName = payload.name.trim().toLowerCase();
        const duplicate = sets.some(
          (set) => set.id !== id && set.name.toLowerCase() === normalizedName,
        );
        if (duplicate) {
          throw new Error("Інший набір вже має таку назву.");
        }
      }
      const updated = await quizApi.updateSet(id, payload);
      setSets((prev) => prev.map((set) => (set.id === id ? updated : set)));
    },
    [sets],
  );

  const deleteSet = useCallback(async (id: string) => {
    await quizApi.deleteSet(id);
    setSets((prev) => prev.filter((set) => set.id !== id));
    setWords((prev) => prev.filter((word) => word.setId !== id));
    setSessions((prev) => prev.filter((session) => !session.setIds.includes(id)));
  }, []);

  const createWord = useCallback(
    async (payload: { setId: string; question: string; answer: string; hint?: string }) => {
      const trimmed = {
        ...payload,
        question: payload.question.trim(),
        answer: payload.answer.trim(),
        hint: payload.hint?.trim(),
      };
      if (!trimmed.question || !trimmed.answer) {
        throw new Error("Запитання та відповідь не можуть бути порожніми.");
      }
      const newWord = await quizApi.createWord(trimmed);
      setWords((prev) => [...prev, newWord]);
      setSets((prev) =>
        prev.map((set) =>
          set.id === trimmed.setId ? { ...set, wordCount: set.wordCount + 1 } : set,
        ),
      );
    },
    [],
  );

  const updateWord = useCallback(
    async (id: string, payload: { question?: string; answer?: string; hint?: string }) => {
      const updated = await quizApi.updateWord(id, payload);
      setWords((prev) => prev.map((word) => (word.id === id ? updated : word)));
    },
    [],
  );

  const updateWordProficiency = useCallback(async (id: string, delta: number) => {
    const updated = await quizApi.updateWordProficiency(id, delta);
    setWords((prev) => prev.map((word) => (word.id === id ? updated : word)));
  }, []);

  const deleteWord = useCallback(async (id: string) => {
    const target = words.find((word) => word.id === id);
    if (!target) return;
    await quizApi.deleteWord(id);
    setWords((prev) => prev.filter((word) => word.id !== id));
    setSets((prev) =>
      prev.map((set) =>
        set.id === target.setId ? { ...set, wordCount: Math.max(0, set.wordCount - 1) } : set,
      ),
    );
  }, [words]);

  const recordSession = useCallback(
    async (payload: {
      setIds: string[];
      mode: string;
      totalQuestions: number;
      correctAnswers: number;
    }) => {
      const session = await quizApi.recordSession(payload);
      setSessions((prev) => [session, ...prev]);
    },
    [],
  );

  useEffect(() => {
    refresh().catch((error) => {
      console.error("[QuizDataProvider] Failed to load data", error);
    });
  }, [refresh]);

  const value = useMemo<QuizDataContextValue>(
    () => ({
      sets,
      words,
      sessions,
      loading,
      refresh,
      createSet,
      updateSet,
      deleteSet,
      createWord,
      updateWord,
      updateWordProficiency,
      deleteWord,
      recordSession,
    }),
    [
      sets,
      words,
      sessions,
      loading,
      refresh,
      createSet,
      updateSet,
      deleteSet,
      createWord,
      updateWord,
      updateWordProficiency,
      deleteWord,
      recordSession,
    ],
  );

  return <QuizDataContext.Provider value={value}>{children}</QuizDataContext.Provider>;
};

export const useQuizDataContext = (): QuizDataContextValue => {
  const context = useContext(QuizDataContext);
  if (!context) {
    throw new Error("useQuizDataContext має викликатися всередині QuizDataProvider");
  }
  return context;
};


