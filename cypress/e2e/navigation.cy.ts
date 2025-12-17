describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have navigation links", () => {
    cy.contains("Квізи").should("be.visible");
    cy.contains("Набори").should("be.visible");
  });

  it("should navigate to quiz page", () => {
    cy.contains("Квізи").click();
    cy.url().should("include", "/quiz");
  });

  it("should navigate to manage sets page", () => {
    cy.contains("Набори").click();
    cy.url().should("include", "/quiz/manage");
  });

  it("should navigate to home page via logo", () => {
    cy.contains("QuizTrainer").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should show sign in and sign up buttons when not authenticated", () => {
    cy.contains("Вхід").should("be.visible");
    cy.contains("Реєстрація").should("be.visible");
  });

  it("should navigate to sign in page", () => {
    cy.contains("Вхід").click();
    cy.url().should("include", "/auth/sign-in");
  });

  it("should navigate to sign up page", () => {
    cy.contains("Реєстрація").click();
    cy.url().should("include", "/auth/sign-up");
  });
});

