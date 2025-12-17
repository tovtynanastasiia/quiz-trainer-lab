import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import ResetPasswordPage from "./ResetPasswordPage";
import { useAuth } from "../../lib/auth/AuthContext";

// Mock AuthContext
const mockSendPasswordReset = vi.fn();
vi.mock("../../lib/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ResetPasswordPage", () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      sendPasswordReset: mockSendPasswordReset,
    });
  });

  it("рендериться з формою відновлення пароля", () => {
    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Відновлення паролю" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Надіслати лист" })).toBeInTheDocument();
  });

  it("відображає посилання на сторінку входу", () => {
    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );

    const links = screen.getAllByRole("link", { name: /Повернутися до входу/i });
    expect(links.length).toBeGreaterThan(0);
  });

  it("відправляє форму з email", async () => {
    const user = userEvent.setup();
    mockSendPasswordReset.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: "Надіслати лист" });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSendPasswordReset).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("відображає повідомлення про успішне відправлення", async () => {
    const user = userEvent.setup();
    mockSendPasswordReset.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: "Надіслати лист" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Перевірте вашу пошту для подальших інструкцій/i),
      ).toBeInTheDocument();
    });
  });

  it("відображає помилку при невдалій відправці", async () => {
    const user = userEvent.setup();
    mockSendPasswordReset.mockRejectedValue(new Error("Користувача не знайдено"));

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "wrong@example.com");
    await user.click(screen.getByRole("button", { name: "Надіслати лист" }));

    await waitFor(() => {
      expect(screen.getByText("Користувача не знайдено")).toBeInTheDocument();
    });
  });

  it("показує індикатор завантаження під час відправки", async () => {
    const user = userEvent.setup();
    mockSendPasswordReset.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: "Надіслати лист" }));

    expect(screen.getByText("Відправляємо…")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("trim'ить email перед відправкою", async () => {
    const user = userEvent.setup();
    mockSendPasswordReset.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Email"), "  test@example.com  ");
    await user.click(screen.getByRole("button", { name: "Надіслати лист" }));

    await waitFor(() => {
      expect(mockSendPasswordReset).toHaveBeenCalledWith("test@example.com");
    });
  });
});

