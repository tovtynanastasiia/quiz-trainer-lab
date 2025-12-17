import { describe, it, expect, vi, beforeEach } from "vitest";
import { quizApi } from "./quizApi";
import { supabase } from "../supabase-client";

// Mock Supabase
vi.mock("../supabase-client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("quizApi", () => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockSingle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    });

    mockSelect.mockReturnValue({
      order: mockOrder,
      eq: mockEq,
    });

    mockOrder.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      select: mockSelect,
      order: mockOrder,
      single: mockSingle,
    });

    mockInsert.mockReturnValue({
      select: mockSelect,
    });

    mockUpdate.mockReturnValue({
      eq: mockEq,
    });

    mockDelete.mockReturnValue({
      eq: vi.fn(),
    });

    mockSelect.mockReturnValue({
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
    });
  });

  describe("fetchSets", () => {
    it("отримує набори з правильними даними", async () => {
      const mockSets = [
        {
          id: "set1",
          name: "Set 1",
          description: "Description 1",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockSets,
        error: null,
      });

      const result = await quizApi.fetchSets();

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith("quiz_sets");
    });
  });

  describe("createSet", () => {
    it("створює новий набір", async () => {
      const mockNewSet = {
        id: "new-set",
        name: "New Set",
        description: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      mockSingle.mockResolvedValue({
        data: mockNewSet,
        error: null,
      });

      const result = await quizApi.createSet({
        name: "New Set",
        description: undefined,
      });

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith("quiz_sets");
    });
  });

  describe("updateSet", () => {
    it("оновлює набір", async () => {
      const mockUpdatedSet = {
        id: "set1",
        name: "Updated Set",
        description: "Updated Description",
        created_at: "2024-01-01",
        updated_at: "2024-01-02",
      };

      const mockSelectForCount = vi.fn().mockResolvedValue({
        count: 5,
      });

      mockEq.mockReturnValue({
        select: mockSelectForCount,
        single: mockSingle,
      });

      mockSingle.mockResolvedValue({
        data: mockUpdatedSet,
        error: null,
      });

      const result = await quizApi.updateSet("set1", {
        name: "Updated Set",
      });

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith("quiz_sets");
    });
  });

  describe("deleteSet", () => {
    it("видаляє набір", async () => {
      const mockDeleteEq = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      mockDelete.mockReturnValue({
        eq: mockDeleteEq,
      });

      await quizApi.deleteSet("set1");

      expect(supabase.from).toHaveBeenCalledWith("quiz_sets");
    });
  });

  describe("fetchWords", () => {
    it("отримує всі слова", async () => {
      const mockWords = [
        {
          id: "word1",
          set_id: "set1",
          question: "Q1",
          answer: "A1",
          hint: null,
          proficiency: 0,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];

      mockOrder.mockResolvedValue({
        data: mockWords,
        error: null,
      });

      const result = await quizApi.fetchWords();

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith("quiz_words");
    });
  });

  describe("createWord", () => {
    it("створює нове слово", async () => {
      const mockNewWord = {
        id: "new-word",
        set_id: "set1",
        question: "New Question",
        answer: "New Answer",
        hint: null,
        proficiency: 0,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      mockSingle.mockResolvedValue({
        data: mockNewWord,
        error: null,
      });

      const result = await quizApi.createWord({
        setId: "set1",
        question: "New Question",
        answer: "New Answer",
      });

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith("quiz_words");
    });
  });

  describe("recordSession", () => {
    it("записує сесію", async () => {
      const mockSession = {
        id: "session1",
        set_ids: ["set1"],
        mode: "education",
        total_questions: 10,
        correct_answers: 8,
        accuracy: 80,
        created_at: "2024-01-01",
      };

      mockSingle.mockResolvedValue({
        data: mockSession,
        error: null,
      });

      const result = await quizApi.recordSession({
        setIds: ["set1"],
        mode: "education",
        totalQuestions: 10,
        correctAnswers: 8,
      });

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith("quiz_sessions");
    });
  });
});

