import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import { useAuth } from "../../lib/auth/AuthContext";

// Mock AuthContext
const mockSignUp = vi.fn();
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

describe("SignUpPage", () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      signUp: mockSignUp,
    });
  });

  it("рендериться з формою реєстрації", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Реєстрація")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль (мін. 6 символів)")).toBeInTheDocument();
  });

  it("відображає посилання на вхід", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Вже маєте акаунт/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Увійти" })).toBeInTheDocument();
  });

  it("відправляє форму з правильними даними", async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ session: null });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "newuser@example.com");
    await user.type(screen.getByPlaceholderText("Пароль (мін. 6 символів)"), "password123");
    await user.click(screen.getByRole("button", { name: "Створити акаунт" }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
      });
    });
  });

  it("перенаправляє після успішної реєстрації з сесією", async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ session: { user: {} } });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "newuser@example.com");
    await user.type(screen.getByPlaceholderText("Пароль (мін. 6 символів)"), "password123");
    await user.click(screen.getByRole("button", { name: "Створити акаунт" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/quiz", { replace: true });
    });
  });

  it("показує повідомлення про підтвердження email", async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({ session: null });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "newuser@example.com");
    await user.type(screen.getByPlaceholderText("Пароль (мін. 6 символів)"), "password123");
    await user.click(screen.getByRole("button", { name: "Створити акаунт" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Ми надіслали лист для підтвердження/)
      ).toBeInTheDocument();
    });
  });

  it("відображає помилку при невдалій реєстрації", async () => {
    const user = userEvent.setup();
    mockSignUp.mockRejectedValue(new Error("Email вже використовується"));

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "existing@example.com");
    await user.type(screen.getByPlaceholderText("Пароль (мін. 6 символів)"), "password123");
    await user.click(screen.getByRole("button", { name: "Створити акаунт" }));

    await waitFor(() => {
      expect(screen.getByText("Email вже використовується")).toBeInTheDocument();
    });
  });
});




