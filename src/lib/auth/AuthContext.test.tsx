import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { supabase } from "../supabase-client";

// Mock Supabase
vi.mock("../supabase-client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

describe("AuthContext", () => {
  const mockGetSession = supabase.auth.getSession as ReturnType<typeof vi.fn>;
  const mockOnAuthStateChange = supabase.auth.onAuthStateChange as ReturnType<typeof vi.fn>;
  const mockSignIn = supabase.auth.signInWithPassword as ReturnType<typeof vi.fn>;
  const mockSignUp = supabase.auth.signUp as ReturnType<typeof vi.fn>;
  const mockSignOut = supabase.auth.signOut as ReturnType<typeof vi.fn>;
  const mockResetPassword = supabase.auth.resetPasswordForEmail as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
  });

  it("надає початковий стан завантаження", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // Початковий стан - loading має бути true
    expect(result.current.loading).toBe(true);
    
    // Чекаємо поки завантаження завершиться
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("обробляє успішний вхід", async () => {
    const mockSession = {
      user: { id: "user1", email: "test@example.com" },
    };

    mockGetSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("виконує signIn", async () => {
    mockSignIn.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.signIn({
      email: "test@example.com",
      password: "password123",
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("виконує signUp", async () => {
    const mockData = { session: null, user: null };
    mockSignUp.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const data = await result.current.signUp({
      email: "new@example.com",
      password: "password123",
    });

    expect(mockSignUp).toHaveBeenCalled();
    expect(data).toBeDefined();
  });

  it("виконує signOut", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.signOut();

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("виконує sendPasswordReset", async () => {
    mockResetPassword.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.sendPasswordReset("test@example.com");

    expect(mockResetPassword).toHaveBeenCalledWith("test@example.com", expect.any(Object));
  });

  it("обробляє помилки при вході", async () => {
    const error = new Error("Invalid credentials");
    mockSignIn.mockResolvedValue({ error });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.signIn({
        email: "test@example.com",
        password: "wrong",
      })
    ).rejects.toThrow();
  });
});

