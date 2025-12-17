import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { useAuth } from "../lib/auth/AuthContext";

// Mock AuthContext
vi.mock("../lib/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("HomePage", () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендериться з заголовком та описом", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText("QuizTrainer 🎯")).toBeInTheDocument();
    expect(
      screen.getByText(/Інтерактивний тренажер для вивчення іноземних слів/)
    ).toBeInTheDocument();
  });

  it("показує кнопки входу та реєстрації для неавторизованих користувачів", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole("link", { name: "Увійти" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Реєстрація" })).toBeInTheDocument();
  });

  it("показує кнопки для авторизованих користувачів", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole("link", { name: "Перейти до квізів" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Мій профіль" })).toBeInTheDocument();
  });

  it("не показує кнопки під час завантаження", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.queryByRole("link", { name: "Увійти" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Перейти до квізів" })).not.toBeInTheDocument();
  });

  it("відображає опис функцій", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText("Про QuizTrainer")).toBeInTheDocument();
  });
});




