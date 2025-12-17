import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuizSets } from "./useQuizSets";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

// Mock QuizDataProvider
vi.mock("../lib/quiz/QuizDataProvider", () => ({
  useQuizDataContext: vi.fn(),
}));

describe("useQuizSets", () => {
  const mockUseQuizDataContext = useQuizDataContext as ReturnType<typeof vi.fn>;

  it("повертає набори з доданими словами", () => {
    const mockSets = [
      { id: "set1", name: "Set 1", wordCount: 0 },
      { id: "set2", name: "Set 2", wordCount: 0 },
    ];
    const mockWords = [
      { id: "word1", setId: "set1", question: "Q1", answer: "A1" },
      { id: "word2", setId: "set1", question: "Q2", answer: "A2" },
      { id: "word3", setId: "set2", question: "Q3", answer: "A3" },
    ];

    mockUseQuizDataContext.mockReturnValue({
      sets: mockSets,
      words: mockWords,
      loading: false,
      refresh: vi.fn(),
      createSet: vi.fn(),
      updateSet: vi.fn(),
      deleteSet: vi.fn(),
    });

    const { result } = renderHook(() => useQuizSets());

    expect(result.current.sets).toHaveLength(2);
    expect(result.current.sets[0].words).toHaveLength(2);
    expect(result.current.sets[1].words).toHaveLength(1);
  });

  it("повертає loading стан", () => {
    mockUseQuizDataContext.mockReturnValue({
      sets: [],
      words: [],
      loading: true,
      refresh: vi.fn(),
      createSet: vi.fn(),
      updateSet: vi.fn(),
      deleteSet: vi.fn(),
    });

    const { result } = renderHook(() => useQuizSets());

    expect(result.current.loading).toBe(true);
  });

  it("повертає функції для роботи з наборами", () => {
    const mockRefresh = vi.fn();
    const mockCreateSet = vi.fn();
    const mockUpdateSet = vi.fn();
    const mockDeleteSet = vi.fn();

    mockUseQuizDataContext.mockReturnValue({
      sets: [],
      words: [],
      loading: false,
      refresh: mockRefresh,
      createSet: mockCreateSet,
      updateSet: mockUpdateSet,
      deleteSet: mockDeleteSet,
    });

    const { result } = renderHook(() => useQuizSets());

    expect(result.current.refresh).toBe(mockRefresh);
    expect(result.current.createSet).toBe(mockCreateSet);
    expect(result.current.updateSet).toBe(mockUpdateSet);
    expect(result.current.deleteSet).toBe(mockDeleteSet);
  });
});




