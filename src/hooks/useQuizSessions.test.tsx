import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuizSessions } from "./useQuizSessions";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

// Mock QuizDataProvider
vi.mock("../lib/quiz/QuizDataProvider", () => ({
  useQuizDataContext: vi.fn(),
}));

describe("useQuizSessions", () => {
  const mockUseQuizDataContext = useQuizDataContext as ReturnType<typeof vi.fn>;

  it("повертає порожні статистики, коли немає сесій", () => {
    mockUseQuizDataContext.mockReturnValue({
      sessions: [],
      sets: [],
    });

    const { result } = renderHook(() => useQuizSessions());

    expect(result.current.totalSessions).toBe(0);
    expect(result.current.averageAccuracy).toBe(0);
    expect(result.current.recentSessions).toHaveLength(0);
    expect(result.current.favouriteSetName).toBeNull();
  });

  it("обчислює середню точність", () => {
    const mockSessions = [
      { id: "1", setIds: ["set1"], mode: "education", totalQuestions: 10, correctAnswers: 8, accuracy: 80, createdAt: "2024-01-01" },
      { id: "2", setIds: ["set1"], mode: "education", totalQuestions: 10, correctAnswers: 9, accuracy: 90, createdAt: "2024-01-02" },
    ];

    mockUseQuizDataContext.mockReturnValue({
      sessions: mockSessions,
      sets: [],
    });

    const { result } = renderHook(() => useQuizSessions());

    expect(result.current.averageAccuracy).toBe(85);
    expect(result.current.totalSessions).toBe(2);
  });

  it("знаходить найпопулярніший набір", () => {
    const mockSessions = [
      { id: "1", setIds: ["set1"], mode: "education", totalQuestions: 10, correctAnswers: 8, accuracy: 80, createdAt: "2024-01-01" },
      { id: "2", setIds: ["set1"], mode: "education", totalQuestions: 10, correctAnswers: 9, accuracy: 90, createdAt: "2024-01-02" },
      { id: "3", setIds: ["set2"], mode: "education", totalQuestions: 10, correctAnswers: 7, accuracy: 70, createdAt: "2024-01-03" },
    ];

    const mockSets = [
      { id: "set1", name: "Set 1", wordCount: 0 },
      { id: "set2", name: "Set 2", wordCount: 0 },
    ];

    mockUseQuizDataContext.mockReturnValue({
      sessions: mockSessions,
      sets: mockSets,
    });

    const { result } = renderHook(() => useQuizSessions());

    expect(result.current.favouriteSetName).toBe("Set 1");
  });

  it("повертає останні 10 сесій", () => {
    const mockSessions = Array.from({ length: 15 }, (_, i) => ({
      id: `session${i}`,
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: `2024-01-${String(i + 1).padStart(2, "0")}`,
    }));

    mockUseQuizDataContext.mockReturnValue({
      sessions: mockSessions,
      sets: [],
    });

    const { result } = renderHook(() => useQuizSessions());

    expect(result.current.recentSessions).toHaveLength(10);
  });
});




