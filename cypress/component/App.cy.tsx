import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App";
import { AuthContext } from "../../src/lib/auth/AuthContext";

describe("App Component", () => {
  const mockAuthValue = {
    isAuthenticated: false,
    loading: false,
    user: null,
    signIn: cy.stub(),
    signOut: cy.stub(),
    signUp: cy.stub(),
    sendPasswordReset: cy.stub(),
  };

  beforeEach(() => {
    cy.window().then((win) => {
      // Mock window methods if needed
    });
  });

  it("рендериться без помилок", () => {
    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
  });

  it("відображає назву додатку", () => {
    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    cy.contains("QuizTrainer").should("exist");
  });

  it("відображає навігаційні посилання", () => {
    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    cy.contains("Квізи").should("exist");
    cy.contains("Набори").should("exist");
  });

  it("відображає кнопки входу для неавторизованого користувача", () => {
    cy.mount(
      <AuthContext.Provider value={mockAuthValue}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    cy.contains("Вхід").should("exist");
    cy.contains("Реєстрація").should("exist");
  });

  it("відображає профіль для авторизованого користувача", () => {
    const authenticatedAuthValue = {
      ...mockAuthValue,
      isAuthenticated: true,
      user: { email: "test@example.com" },
    };

    cy.mount(
      <AuthContext.Provider value={authenticatedAuthValue}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    cy.contains("Профіль").should("exist");
    cy.contains("Вийти").should("exist");
  });
});
