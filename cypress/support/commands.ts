/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Кастомні команди для E2E тестів

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Перевіряє, чи користувач авторизований
       */
      checkAuth(): Chainable<boolean>;
      
      /**
       * Очікує завантаження сторінки
       */
      waitForPageLoad(): Chainable<void>;
    }
  }
}

// Перевірка авторизації
Cypress.Commands.add("checkAuth", () => {
  return cy.window().then((win) => {
    // Перевірка через localStorage або інші методи
    const auth = win.localStorage.getItem("supabase.auth.token");
    return !!auth;
  });
});

// Очікування завантаження сторінки
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.window().its("document.readyState").should("eq", "complete");
});

export {};
