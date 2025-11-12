import { useMemo } from "react";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

export const useQuizWords = (setId?: string) => {
  const {
    words,
    loading,
    refresh,
    createWord,
    updateWord,
    updateWordProficiency,
    deleteWord,
  } = useQuizDataContext();

  const filteredWords = useMemo(() => {
    if (!setId || setId === "all") {
      return words;
    }
    return words.filter((word) => word.setId === setId);
  }, [setId, words]);

  return {
    words: filteredWords,
    loading,
    refresh,
    createWord,
    updateWord,
    updateWordProficiency,
    deleteWord,
  };
};


