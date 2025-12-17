import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NotFoundPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендериться з правильним текстом", () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Сторінку не знайдено")).toBeInTheDocument();
    expect(
      screen.getByText(/Вибачте, але сторінка, яку ви шукаєте, не існує/)
    ).toBeInTheDocument();
  });

  it("має посилання на головну сторінку", () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole("link", { name: "На головну" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("викликає navigate(-1) при натисканні кнопки Назад", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    const backButton = screen.getByRole("button", { name: "Назад" });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});




