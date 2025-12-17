import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QuizDetailPage from "./QuizDetailPage";
import { useQuizSessions } from "../../hooks/useQuizSessions";
import { useQuizSets } from "../../hooks/useQuizSets";

// Mock hooks
vi.mock("../../hooks/useQuizSessions");
vi.mock("../../hooks/useQuizSets");

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("QuizDetailPage", () => {
  const mockUseQuizSessions = useQuizSessions as ReturnType<typeof vi.fn>;
  const mockUseQuizSets = useQuizSets as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuizSets.mockReturnValue({
      sets: [
        { id: "set1", name: "Set 1", words: [] },
        { id: "set2", name: "Set 2", words: [] },
      ],
    });
  });

  it("відображає повідомлення, коли сесію не знайдено", () => {
    mockUseQuizSessions.mockReturnValue({
      sessions: [],
    });

    render(
      <MemoryRouter initialEntries={["/quiz/unknown-id"]}>
        <QuizDetailPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Сесію не знайдено")).toBeInTheDocument();
    expect(
      screen.getByText(/Перевірте посилання або відкрийте будь-яку сесію на сторінці профілю/i),
    ).toBeInTheDocument();
  });

  it("відображає інформацію про сесію", () => {
    const mockSession = {
      id: "session1",
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUseQuizSessions.mockReturnValue({
      sessions: [mockSession],
    });

    render(
      <MemoryRouter initialEntries={["/quiz/session1"]}>
        <QuizDetailPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Звіт про сесію")).toBeInTheDocument();
    expect(screen.getByText("8/10")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("відображає назву набору", () => {
    const mockSession = {
      id: "session1",
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUseQuizSessions.mockReturnValue({
      sessions: [mockSession],
    });

    render(
      <MemoryRouter initialEntries={["/quiz/session1"]}>
        <QuizDetailPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Set 1")).toBeInTheDocument();
  });

  it("відображає 'Усі набори' коли setIds містить 'all'", () => {
    const mockSession = {
      id: "session1",
      setIds: ["all"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUseQuizSessions.mockReturnValue({
      sessions: [mockSession],
    });

    render(
      <MemoryRouter initialEntries={["/quiz/session1"]}>
        <QuizDetailPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Усі набори")).toBeInTheDocument();
  });

  it("відображає кнопки навігації", () => {
    const mockSession = {
      id: "session1",
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUseQuizSessions.mockReturnValue({
      sessions: [mockSession],
    });

    render(
      <MemoryRouter initialEntries={["/quiz/session1"]}>
        <QuizDetailPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Назад" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "До тренувань" })).toBeInTheDocument();
  });

  it("навігує назад при кліку на кнопку Назад", () => {
    const mockSession = {
      id: "session1",
      setIds: ["set1"],
      mode: "education",
      totalQuestions: 10,
      correctAnswers: 8,
      accuracy: 80,
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUseQuizSessions.mockReturnValue({
      sessions: [mockSession],
    });

    render(
      <MemoryRouter initialEntries={["/quiz/session1"]}>
        <QuizDetailPage />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: "Назад" });
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});




