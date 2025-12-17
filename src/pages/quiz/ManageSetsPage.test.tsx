import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import ManageSetsPage from "./ManageSetsPage";
import { useQuizSets } from "../../hooks/useQuizSets";
import { useQuizWords } from "../../hooks/useQuizWords";

// Mock hooks
vi.mock("../../hooks/useQuizSets");
vi.mock("../../hooks/useQuizWords");

describe("ManageSetsPage", () => {
  const mockCreateSet = vi.fn();
  const mockUpdateSet = vi.fn();
  const mockDeleteSet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuizSets as ReturnType<typeof vi.fn>).mockReturnValue({
      sets: [
        { id: "set1", name: "Set 1", words: [] },
        { id: "set2", name: "Set 2", words: [] },
      ],
      createSet: mockCreateSet,
      updateSet: mockUpdateSet,
      deleteSet: mockDeleteSet,
    });

    (useQuizWords as ReturnType<typeof vi.fn>).mockReturnValue({
      words: [
        { id: "word1", setId: "set1", question: "Q1", answer: "A1" },
        { id: "word2", setId: "set1", question: "Q2", answer: "A2" },
        { id: "word3", setId: "set2", question: "Q3", answer: "A3" },
      ],
    });
  });

  it("рендериться з заголовком", () => {
    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Керування наборами")).toBeInTheDocument();
  });

  it("відображає список наборів", () => {
    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Set 1")).toBeInTheDocument();
    expect(screen.getByText("Set 2")).toBeInTheDocument();
  });

  it("відображає кількість слів у кожному наборі", () => {
    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Слів у наборі: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Слів у наборі: 1/i)).toBeInTheDocument();
  });

  it("відображає форму створення нового набору", () => {
    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("Назва нового набору")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Створити" })).toBeInTheDocument();
  });

  it("створює новий набір при відправці форми", async () => {
    const user = userEvent.setup();
    mockCreateSet.mockResolvedValue(undefined);

    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("Назва нового набору");
    const submitButton = screen.getByRole("button", { name: "Створити" });

    await user.type(input, "New Set");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateSet).toHaveBeenCalledWith({ name: "New Set" });
    });
  });

  it("не створює набір з порожньою назвою", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole("button", { name: "Створити" });
    await user.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith("Введіть назву набору");
    expect(mockCreateSet).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("відображає посилання на редагування слів", () => {
    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    const editLinks = screen.getAllByRole("link", { name: "Редагувати слова" });
    expect(editLinks.length).toBeGreaterThan(0);
    expect(editLinks[0]).toHaveAttribute("href", "/quiz/manage/words?setId=set1");
  });

  it("відображає повідомлення про відсутність наборів", () => {
    (useQuizSets as ReturnType<typeof vi.fn>).mockReturnValue({
      sets: [],
      createSet: mockCreateSet,
      updateSet: mockUpdateSet,
      deleteSet: mockDeleteSet,
    });

    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Немає наборів. Створіть перший.")).toBeInTheDocument();
  });

  it("показує індикатор завантаження під час створення", async () => {
    const user = userEvent.setup();
    mockCreateSet.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(
      <BrowserRouter>
        <ManageSetsPage />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText("Назва нового набору"), "New Set");
    await user.click(screen.getByRole("button", { name: "Створити" }));

    expect(screen.getByText("Створення…")).toBeInTheDocument();
  });
});

