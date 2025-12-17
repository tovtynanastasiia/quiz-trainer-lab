import React from "react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { AuthContext } from "../../src/lib/auth/AuthContext";

describe("ProtectedRoute Component", () => {
  it("відображає дочірній компонент для авторизованого користувача", () => {
    const mockAuthValue = {
      isAuthenticated: true,
      loading: false,
      user: { email: "test@example.com" },
      signIn: cy.stub(),
      signOut: cy.stub(),
      signUp: cy.stub(),
      sendPasswordReset: cy.stub(),
    };

    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    cy.contains("Protected Content").should("exist");
  });

  it("не відображає контент під час завантаження", () => {
    const mockAuthValue = {
      isAuthenticated: false,
      loading: true,
      user: null,
      signIn: cy.stub(),
      signOut: cy.stub(),
      signUp: cy.stub(),
      sendPasswordReset: cy.stub(),
    };

    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    cy.contains("Protected Content").should("not.exist");
  });

  it("редіректить неавторизованого користувача", () => {
    const mockAuthValue = {
      isAuthenticated: false,
      loading: false,
      user: null,
      signIn: cy.stub(),
      signOut: cy.stub(),
      signUp: cy.stub(),
      sendPasswordReset: cy.stub(),
    };

    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter initialEntries={["/protected"]}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    cy.contains("Protected Content").should("not.exist");
  });
});

