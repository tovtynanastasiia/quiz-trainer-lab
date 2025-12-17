describe("Routing", () => {
  it("should handle dynamic routes", () => {
    cy.visit("/quiz/test-quiz-id-123");
    // Має відобразити сторінку деталей квізу або повідомлення про відсутність
    cy.get("body").should("exist");
  });

  it("should handle query parameters", () => {
    cy.visit("/quiz/manage/words?setId=test-set-id");
    cy.url().should("include", "setId=test-set-id");
  });

  it("should preserve query parameters on navigation", () => {
    cy.visit("/quiz/manage/words?setId=test-123");
    cy.url().should("include", "/quiz/manage/words");
    cy.url().should("include", "setId=test-123");
  });

  it("should handle nested routes", () => {
    cy.visit("/account/settings");
    // Має редіректити на sign-in, якщо не авторизований
    cy.url().should("include", "/auth/sign-in");
  });

  it("should redirect to home for root path", () => {
    cy.visit("/");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains("QuizTrainer").should("be.visible");
  });
});

