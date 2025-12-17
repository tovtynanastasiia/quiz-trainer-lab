import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuizPlay } from "./useQuizPlay";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

// Mock QuizDataProvider
vi.mock("../lib/quiz/QuizDataProvider", () => ({
  useQuizDataContext: vi.fn(),
}));

describe("useQuizPlay", () => {
  const mockUseQuizDataContext = useQuizDataContext as ReturnType<typeof vi.fn>;
  const mockRecordSession = vi.fn();

  const mockWords = [
    { id: "word1", setId: "set1", question: "Hello", answer: "Привіт", proficiency: 0 },
    { id: "word2", setId: "set1", question: "World", answer: "Світ", proficiency: 0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuizDataContext.mockReturnValue({
      words: mockWords,
      recordSession: mockRecordSession,
      updateWordProficiency: vi.fn(),
    });
  });

  it("повертає початковий стан", () => {
    const { result } = renderHook(() => useQuizPlay());

    expect(result.current.state.isActive).toBe(false);
    expect(result.current.state.isFinished).toBe(false);
    expect(result.current.currentCard).toBeNull();
  });

  it("починає квіз з правильними параметрами", async () => {
    const { result } = renderHook(() => useQuizPlay());

    await act(async () => {
      result.current.startSession({
        mode: "education",
        setIds: ["set1"],
      });
    });

    expect(result.current.state.isActive).toBe(true);
    expect(result.current.currentCard).toBeTruthy();
    expect(result.current.state.mode).toBe("education");
  });

  it("обробляє правильну відповідь", async () => {
    const { result } = renderHook(() => useQuizPlay());

    await act(async () => {
      result.current.startSession({
        mode: "education",
        setIds: ["set1"],
      });
    });

    const currentCard = result.current.currentCard;
    expect(currentCard).toBeTruthy();

    await act(async () => {
      await result.current.submitAnswer(currentCard!.answer);
    });

    expect(result.current.state.correctAnswers).toBe(1);
  });

  it("обробляє неправильну відповідь", async () => {
    const { result } = renderHook(() => useQuizPlay());

    await act(async () => {
      result.current.startSession({
        mode: "education",
        setIds: ["set1"],
      });
    });

    const currentCard = result.current.currentCard;
    expect(currentCard).toBeTruthy();

    await act(async () => {
      await result.current.submitAnswer("Неправильна відповідь");
    });

    expect(result.current.state.correctAnswers).toBe(0);
  });

  it("скидає стан квізу", async () => {
    const { result } = renderHook(() => useQuizPlay());

    await act(async () => {
      result.current.startSession({
        mode: "education",
        setIds: ["set1"],
      });
    });

    expect(result.current.state.isActive).toBe(true);

    act(() => {
      result.current.resetSession();
    });

    expect(result.current.state.isActive).toBe(false);
    expect(result.current.state.isFinished).toBe(false);
  });
});

