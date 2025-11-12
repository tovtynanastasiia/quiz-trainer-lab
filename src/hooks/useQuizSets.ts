import { useMemo } from "react";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

export const useQuizSets = () => {
  const {
    sets,
    words,
    loading,
    refresh,
    createSet,
    updateSet,
    deleteSet,
  } = useQuizDataContext();

  const setsWithWords = useMemo(
    () =>
      sets.map((set) => ({
        ...set,
        words: words.filter((word) => word.setId === set.id),
      })),
    [sets, words],
  );

  return {
    sets: setsWithWords,
    loading,
    refresh,
    createSet,
    updateSet,
    deleteSet,
  };
};


