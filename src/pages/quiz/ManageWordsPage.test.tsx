import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import ManageWordsPage from "./ManageWordsPage";
import { useQuizSets } from "../../hooks/useQuizSets";
import { useQuizWords } from "../../hooks/useQuizWords";

// Mock hooks
vi.mock("../../hooks/useQuizSets");
vi.mock("../../hooks/useQuizWords");

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ManageWordsPage", () => {
  const mockCreateWord = vi.fn();
  const mockUpdateWord = vi.fn();
  const mockDeleteWord = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuizSets as ReturnType<typeof vi.fn>).mockReturnValue({
      sets: [
        { id: "set1", name: "Set 1", words: [] },
        { id: "set2", name: "Set 2", words: [] },
      ],
    });

    (useQuizWords as ReturnType<typeof vi.fn>).mockReturnValue({
      words: [
        { id: "word1", setId: "set1", question: "Question 1", answer: "Answer 1" },
        { id: "word2", setId: "set1", question: "Question 2", answer: "Answer 2" },
      ],
      loading: false,
      refresh: mockRefresh,
      createWord: mockCreateWord,
      updateWord: mockUpdateWord,
      deleteWord: mockDeleteWord,
    });
  });

  it("відображає повідомлення про вибір набору, коли setId відсутній", () => {
    render(
      <BrowserRouter>
        <ManageWordsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Виберіть набір")).toBeInTheDocument();
    expect(
      screen.getByText(/Для редагування слів потрібно вибрати набір/i),
    ).toBeInTheDocument();
  });

  it("відображає назву активного набору", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Set 1")).toBeInTheDocument();
  });

  it("відображає список слів набору", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });

  it("відображає форму для додавання кількох слів", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Додати кілька слів")).toBeInTheDocument();
    expect(
      screen.getByText(/Формат: слово - переклад, альтернативний переклад/i),
    ).toBeInTheDocument();
  });

  it("додає слова через bulk форму", async () => {
    const user = userEvent.setup();
    mockCreateWord.mockResolvedValue(undefined);
    mockRefresh.mockResolvedValue(undefined);

    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText(/cat - кіт, котик/i);
    const submitButton = screen.getByRole("button", { name: "Додати всі" });

    await user.type(textarea, "cat - кіт, котик\ndog - пес, собака");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateWord).toHaveBeenCalled();
    });
  });

  it("відображає помилку при невалідному форматі bulk тексту", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    const textarea = screen.getByPlaceholderText(/cat - кіт, котик/i);
    const submitButton = screen.getByRole("button", { name: "Додати всі" });

    await user.type(textarea, "invalid format");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Не знайдено жодного рядка з форматом/i),
      ).toBeInTheDocument();
    });
  });

  it("відображає кнопку збереження змін", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Зберегти зміни" })).toBeInTheDocument();
  });

  it("відображає посилання назад до наборів", () => {
    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    const backLink = screen.getByRole("link", { name: /До наборів/i });
    expect(backLink).toHaveAttribute("href", "/quiz/manage");
  });

  it("відображає повідомлення про відсутність слів", () => {
    (useQuizWords as ReturnType<typeof vi.fn>).mockReturnValue({
      words: [],
      loading: false,
      refresh: mockRefresh,
      createWord: mockCreateWord,
      updateWord: mockUpdateWord,
      deleteWord: mockDeleteWord,
    });

    render(
      <MemoryRouter initialEntries={["/quiz/manage/words?setId=set1"]}>
        <ManageWordsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Поки немає слів. Додайте перші!")).toBeInTheDocument();
  });
});

