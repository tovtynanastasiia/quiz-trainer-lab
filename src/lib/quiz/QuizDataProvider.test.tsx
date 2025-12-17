import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QuizDataProvider, useQuizDataContext } from "./QuizDataProvider";
import { quizApi } from "../api/quizApi";

// Mock quizApi
vi.mock("../api/quizApi", () => ({
  quizApi: {
    fetchSnapshot: vi.fn(),
    createSet: vi.fn(),
    updateSet: vi.fn(),
    deleteSet: vi.fn(),
    createWord: vi.fn(),
    updateWord: vi.fn(),
    updateWordProficiency: vi.fn(),
    deleteWord: vi.fn(),
    recordSession: vi.fn(),
  },
}));

describe("QuizDataProvider", () => {
  const mockFetchSnapshot = quizApi.fetchSnapshot as ReturnType<typeof vi.fn>;
  const mockCreateSet = quizApi.createSet as ReturnType<typeof vi.fn>;
  const mockUpdateSet = quizApi.updateSet as ReturnType<typeof vi.fn>;
  const mockDeleteSet = quizApi.deleteSet as ReturnType<typeof vi.fn>;
  const mockCreateWord = quizApi.createWord as ReturnType<typeof vi.fn>;
  const mockUpdateWord = quizApi.updateWord as ReturnType<typeof vi.fn>;
  const mockRecordSession = quizApi.recordSession as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSnapshot.mockResolvedValue({
      sets: [],
      words: [],
      sessions: [],
    });
  });

  it("завантажує дані при ініціалізації", async () => {
    const { result } = renderHook(() => useQuizDataContext(), {
      wrapper: QuizDataProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchSnapshot).toHaveBeenCalled();
  });

  it("створює новий набір", async () => {
    const newSet = {
      id: "new-set",
      name: "New Set",
      description: "Description",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      wordCount: 0,
    };

    mockCreateSet.mockResolvedValue(newSet);

    const { result } = renderHook(() => useQuizDataContext(), {
      wrapper: QuizDataProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.createSet({
      name: "New Set",
      description: "Description",
    });

    expect(mockCreateSet).toHaveBeenCalledWith({
      name: "New Set",
      description: "Description",
    });
  });

  it("видаляє набір", async () => {
    mockFetchSnapshot.mockResolvedValue({
      sets: [{ id: "set1", name: "Set 1", wordCount: 0 }],
      words: [],
      sessions: [],
    });

    mockDeleteSet.mockResolvedValue(undefined);

    const { result } = renderHook(() => useQuizDataContext(), {
      wrapper: QuizDataProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.deleteSet("set1");

    expect(mockDeleteSet).toHaveBeenCalledWith("set1");
  });

  it("створює нове слово", async () => {
    const newWord = {
      id: "new-word",
      setId: "set1",
      question: "Question",
      answer: "Answer",
      proficiency: 0,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    mockFetchSnapshot.mockResolvedValue({
      sets: [{ id: "set1", name: "Set 1", wordCount: 0 }],
      words: [],
      sessions: [],
    });

    mockCreateWord.mockResolvedValue(newWord);

    const { result } = renderHook(() => useQuizDataContext(), {
      wrapper: QuizDataProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.createWord({
      setId: "set1",
      question: "Question",
      answer: "Answer",
    });

    expect(mockCreateWord).toHaveBeenCalledWith({
      setId: "set1",
      question: "Question",
      answer: "Answer",
    });
  });

  it("записує сесію", async () => {
    const newSession = {
      id: "session1",
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: "2024-01-01",
    };

    mockRecordSession.mockResolvedValue(newSession);

    const { result } = renderHook(() => useQuizDataContext(), {
      wrapper: QuizDataProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.recordSession({
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
    });

    expect(mockRecordSession).toHaveBeenCalledWith({
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
    });
  });

  it("оновлює дані через refresh", async () => {
    const { result } = renderHook(() => useQuizDataContext(), {
      wrapper: QuizDataProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockFetchSnapshot.mockResolvedValue({
      sets: [{ id: "set1", name: "Set 1", wordCount: 0 }],
      words: [],
      sessions: [],
    });

    await result.current.refresh();

    expect(mockFetchSnapshot).toHaveBeenCalledTimes(2);
  });
});




