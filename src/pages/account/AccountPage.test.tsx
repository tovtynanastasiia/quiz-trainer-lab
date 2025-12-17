import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import AccountPage from "./AccountPage";
import { useAuth } from "../../lib/auth/AuthContext";

// Mock AuthContext
const mockSignOut = vi.fn();
const mockNavigate = vi.fn();
vi.mock("../../lib/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AccountPage", () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      signOut: mockSignOut,
      user: { email: "test@example.com" },
    });
  });

  it("рендериться з заголовком профілю", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Профіль користувача")).toBeInTheDocument();
  });

  it("відображає email користувача", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("відображає посилання на квізи", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    const quizLink = screen.getByRole("link", { name: "Перейти до квізів" });
    expect(quizLink).toHaveAttribute("href", "/quiz");
  });

  it("відображає посилання на керування наборами", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    const manageLink = screen.getByRole("link", { name: "Керувати наборами" });
    expect(manageLink).toHaveAttribute("href", "/quiz/manage");
  });

  it("відображає посилання на налаштування", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    const settingsLink = screen.getByRole("link", { name: "Налаштування" });
    expect(settingsLink).toHaveAttribute("href", "/account/settings");
  });

  it("відображає статистику", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Загальна статистика")).toBeInTheDocument();
    expect(screen.getByText("Середня точність")).toBeInTheDocument();
    expect(screen.getByText("Загальний час")).toBeInTheDocument();
  });

  it("відображає повідомлення про початковий стан", () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Почніть грати, щоб побачити реальну статистику!"),
    ).toBeInTheDocument();
  });

  it("викликає signOut при натисканні кнопки виходу", async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole("button", { name: "Вийти" });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it("перенаправляє після виходу", async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Вийти" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("відображає дефолтний email якщо user відсутній", () => {
    mockUseAuth.mockReturnValue({
      signOut: mockSignOut,
      user: null,
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });
});

