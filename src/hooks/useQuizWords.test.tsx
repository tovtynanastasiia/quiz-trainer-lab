import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuizWords } from "./useQuizWords";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

// Mock QuizDataProvider
vi.mock("../lib/quiz/QuizDataProvider", () => ({
  useQuizDataContext: vi.fn(),
}));

describe("useQuizWords", () => {
  const mockUseQuizDataContext = useQuizDataContext as ReturnType<typeof vi.fn>;

  const mockWords = [
    { id: "word1", setId: "set1", question: "Q1", answer: "A1" },
    { id: "word2", setId: "set1", question: "Q2", answer: "A2" },
    { id: "word3", setId: "set2", question: "Q3", answer: "A3" },
  ];

  it("повертає всі слова, коли setId не передано", () => {
    mockUseQuizDataContext.mockReturnValue({
      words: mockWords,
      loading: false,
      refresh: vi.fn(),
      createWord: vi.fn(),
      updateWord: vi.fn(),
      updateWordProficiency: vi.fn(),
      deleteWord: vi.fn(),
    });

    const { result } = renderHook(() => useQuizWords());

    expect(result.current.words).toHaveLength(3);
  });

  it("повертає всі слова, коли setId = 'all'", () => {
    mockUseQuizDataContext.mockReturnValue({
      words: mockWords,
      loading: false,
      refresh: vi.fn(),
      createWord: vi.fn(),
      updateWord: vi.fn(),
      updateWordProficiency: vi.fn(),
      deleteWord: vi.fn(),
    });

    const { result } = renderHook(() => useQuizWords("all"));

    expect(result.current.words).toHaveLength(3);
  });

  it("фільтрує слова за setId", () => {
    mockUseQuizDataContext.mockReturnValue({
      words: mockWords,
      loading: false,
      refresh: vi.fn(),
      createWord: vi.fn(),
      updateWord: vi.fn(),
      updateWordProficiency: vi.fn(),
      deleteWord: vi.fn(),
    });

    const { result } = renderHook(() => useQuizWords("set1"));

    expect(result.current.words).toHaveLength(2);
    expect(result.current.words.every((w) => w.setId === "set1")).toBe(true);
  });

  it("повертає loading стан", () => {
    mockUseQuizDataContext.mockReturnValue({
      words: [],
      loading: true,
      refresh: vi.fn(),
      createWord: vi.fn(),
      updateWord: vi.fn(),
      updateWordProficiency: vi.fn(),
      deleteWord: vi.fn(),
    });

    const { result } = renderHook(() => useQuizWords());

    expect(result.current.loading).toBe(true);
  });

  it("повертає функції для роботи зі словами", () => {
    const mockCreateWord = vi.fn();
    const mockUpdateWord = vi.fn();
    const mockUpdateWordProficiency = vi.fn();
    const mockDeleteWord = vi.fn();

    mockUseQuizDataContext.mockReturnValue({
      words: [],
      loading: false,
      refresh: vi.fn(),
      createWord: mockCreateWord,
      updateWord: mockUpdateWord,
      updateWordProficiency: mockUpdateWordProficiency,
      deleteWord: mockDeleteWord,
    });

    const { result } = renderHook(() => useQuizWords());

    expect(result.current.createWord).toBe(mockCreateWord);
    expect(result.current.updateWord).toBe(mockUpdateWord);
    expect(result.current.updateWordProficiency).toBe(mockUpdateWordProficiency);
    expect(result.current.deleteWord).toBe(mockDeleteWord);
  });
});




