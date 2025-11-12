import { useCallback, useMemo, useReducer } from "react";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";
import { QuizWordRecord } from "../lib/api/quizApi";

interface QuizPlayState {
  isActive: boolean;
  isFinished: boolean;
  mode: string;
  setIds: string[];
  queue: QuizWordRecord[];
  currentIndex: number;
  correctAnswers: number;
  answers: Array<{
    wordId: string;
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
  }>;
}

type Action =
  | { type: "START"; payload: { mode: string; setIds: string[]; queue: QuizWordRecord[] } }
  | {
      type: "ANSWER";
      payload: {
        question: string;
        correctAnswer: string;
        userAnswer: string;
        isCorrect: boolean;
      };
    }
  | {
      type: "SKIP";
      payload: {
        question: string;
        correctAnswer: string;
      };
    }
  | { type: "RESET" };

const initialState: QuizPlayState = {
  isActive: false,
  isFinished: false,
  mode: "learning",
  setIds: [],
  queue: [],
  currentIndex: 0,
  correctAnswers: 0,
  answers: [],
};

const INFINITE_MODES = new Set(["education", "flashcards"]);

const reducer = (state: QuizPlayState, action: Action): QuizPlayState => {
  switch (action.type) {
    case "START": {
      return {
        isActive: true,
        isFinished: false,
        mode: action.payload.mode,
        setIds: action.payload.setIds,
        queue: action.payload.queue,
        currentIndex: 0,
        correctAnswers: 0,
        answers: [],
      };
    }
    case "ANSWER": {
      const currentWord = state.queue[state.currentIndex];
      const nextIndex = state.currentIndex + 1;
      const finished = nextIndex >= state.queue.length;
      const isInfinite = INFINITE_MODES.has(state.mode);
      const nextQueue = finished && isInfinite ? shuffle(state.queue) : state.queue;
      const nextIndexValue = finished && isInfinite ? 0 : nextIndex;
      return {
        ...state,
        queue: nextQueue,
        currentIndex: nextIndexValue,
        isFinished: finished && !isInfinite,
        isActive: isInfinite || !finished,
        correctAnswers: state.correctAnswers + (action.payload.isCorrect ? 1 : 0),
        answers: [
          ...state.answers,
          {
            wordId: currentWord.id,
            question: action.payload.question,
            correctAnswer: action.payload.correctAnswer,
            userAnswer: action.payload.userAnswer,
            isCorrect: action.payload.isCorrect,
          },
        ],
      };
    }
    case "SKIP": {
      const currentWord = state.queue[state.currentIndex];
      const nextIndex = state.currentIndex + 1;
      const finished = nextIndex >= state.queue.length;
      const isInfinite = INFINITE_MODES.has(state.mode);
      const nextQueue = finished && isInfinite ? shuffle(state.queue) : state.queue;
      const nextIndexValue = finished && isInfinite ? 0 : nextIndex;
      return {
        ...state,
        queue: nextQueue,
        currentIndex: nextIndexValue,
        isFinished: finished && !isInfinite,
        isActive: isInfinite || !finished,
        answers: [
          ...state.answers,
          {
            wordId: currentWord.id,
            question: action.payload.question,
            correctAnswer: action.payload.correctAnswer,
            userAnswer: "",
            isCorrect: false,
          },
        ],
      };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const normalizeTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const useQuizPlay = () => {
  const {
    words,
    recordSession,
    updateWordProficiency,
  } = useQuizDataContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const startSession = useCallback(
    (options: { setIds: string[]; mode: string; limit?: number }) => {
      const uniqueSetIds = options.setIds.length ? Array.from(new Set(options.setIds)) : ["all"];
      const availableWords = uniqueSetIds.includes("all")
        ? words
        : words.filter((word) => uniqueSetIds.includes(word.setId));

      if (!availableWords.length) {
        throw new Error("У вибраних наборах немає слів для тренування.");
      }

      const queue = shuffle(availableWords).slice(0, options.limit ?? availableWords.length);
      dispatch({ type: "START", payload: { mode: options.mode, setIds: uniqueSetIds, queue } });
    },
    [words],
  );

  const currentCard = useMemo(() => {
    if (!state.queue.length || state.currentIndex >= state.queue.length) return null;
    return state.queue[state.currentIndex];
  }, [state.queue, state.currentIndex]);

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!currentCard) {
        return;
      }
      const normalizedUserAnswer = normalizeTitle(answer);
      const possibleAnswers = currentCard.answer
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      const normalizedCorrectAnswers = possibleAnswers.map(normalizeTitle);
      let isCorrect = false;

      if (normalizedUserAnswer.length > 0) {
        isCorrect = normalizedCorrectAnswers.some((candidate) => {
          if (!candidate) return false;
          if (candidate.startsWith(normalizedUserAnswer)) {
            return true;
          }
          return normalizedUserAnswer.startsWith(candidate);
        });
      }
      dispatch({
        type: "ANSWER",
        payload: {
          question: currentCard.question,
          correctAnswer: currentCard.answer,
          userAnswer: answer,
          isCorrect,
        },
      });
      if (isCorrect) {
        await updateWordProficiency(currentCard.id, 10);
      } else {
        await updateWordProficiency(currentCard.id, -5);
      }
      if (
        !INFINITE_MODES.has(state.mode) &&
        state.currentIndex + 1 >= state.queue.length
      ) {
        await recordSession({
          setIds: state.setIds.includes("all")
            ? Array.from(new Set(state.queue.map((word) => word.setId)))
            : state.setIds,
          mode: state.mode,
          totalQuestions: state.queue.length,
          correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
        });
      }
    },
    [
      currentCard,
      state.currentIndex,
      state.queue,
      state.mode,
      state.correctAnswers,
      state.setIds,
      updateWordProficiency,
      recordSession,
    ],
  );

  const skipCard = useCallback(async () => {
    if (!currentCard) {
      return;
    }
    dispatch({
      type: "SKIP",
      payload: {
        question: currentCard.question,
        correctAnswer: currentCard.answer,
      },
    });
    await updateWordProficiency(currentCard.id, -3);
    if (
      !INFINITE_MODES.has(state.mode) &&
      state.currentIndex + 1 >= state.queue.length
    ) {
      await recordSession({
        setIds: state.setIds.includes("all")
          ? Array.from(new Set(state.queue.map((word) => word.setId)))
          : state.setIds,
        mode: state.mode,
        totalQuestions: state.queue.length,
        correctAnswers: state.correctAnswers,
      });
    }
  }, [
    currentCard,
    recordSession,
    state.correctAnswers,
    state.currentIndex,
    state.mode,
    state.queue,
    state.setIds,
    updateWordProficiency,
  ]);

  const resetSession = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    currentCard,
    answers: state.answers,
    startSession,
    submitAnswer,
    skipCard,
    resetSession,
  };
};


