import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import SignInPage from "./SignInPage";
import { useAuth } from "../../lib/auth/AuthContext";

// Mock AuthContext
const mockSignIn = vi.fn();
vi.mock("../../lib/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SignInPage", () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      signIn: mockSignIn,
    });
  });

  it("рендериться з формою входу", () => {
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Увійти" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
  });

  it("відображає посилання на реєстрацію та скидання пароля", () => {
    render(
      <BrowserRouter>
        <SignInPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Немає акаунту/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Зареєструватися" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Забули пароль?" })).toBeInTheDocument();
  });

  it("відправляє форму з правильними даними", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const submitButton = screen.getByRole("button", { name: "Увійти" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("перенаправляє після успішного входу", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: "Увійти" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it("відображає помилку при невдалому вході", async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValue(new Error("Невірні облікові дані"));

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Пароль"), "wrong");
    await user.click(screen.getByRole("button", { name: "Увійти" }));

    await waitFor(() => {
      expect(screen.getByText("Невірні облікові дані")).toBeInTheDocument();
    });
  });

  it("показує індикатор завантаження під час відправки", async () => {
    const user = userEvent.setup();
    mockSignIn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Пароль"), "password123");
    await user.click(screen.getByRole("button", { name: "Увійти" }));

    expect(screen.getByText("Зачекайте...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

