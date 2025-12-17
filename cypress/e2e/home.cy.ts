describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the home page", () => {
    // Перевіряємо заголовок на головній сторінці
    cy.contains("QuizTrainer", { matchCase: false }).should("be.visible");
    cy.get("h1").should("contain.text", "QuizTrainer");
  });

  it("should display main features", () => {
    cy.contains("Персоналізовані набори").should("be.visible");
    cy.contains("Чотири режими тренування").should("be.visible");
    cy.contains("Детальна статистика").should("be.visible");
  });

  it("should display training modes", () => {
    cy.contains("Режим «Навчання»").should("be.visible");
    cy.contains("Режим «Точність»").should("be.visible");
    cy.contains("Режим «Швидкість»").should("be.visible");
    cy.contains("Режим «Флеш-картки»").should("be.visible");
  });

  it("should have call-to-action buttons", () => {
    cy.contains("Увійти").should("be.visible");
    cy.contains("Реєстрація").should("be.visible");
  });

  it("should navigate to sign up from CTA", () => {
    cy.contains("Почати зараз").click();
    cy.url().should("include", "/auth/sign-up");
  });

  it("should have working navigation", () => {
    cy.get("a").should("exist");
    cy.contains("Квізи").should("be.visible");
    cy.contains("Набори").should("be.visible");
  });
});
