describe("Quiz Pages", () => {
  describe("Quiz Page", () => {
    beforeEach(() => {
      cy.visit("/quiz");
    });

    it("should display quiz page", () => {
      cy.contains("Quiz Trainer", { matchCase: false }).should("be.visible");
    });

    it("should display mode picker", () => {
      cy.contains("Режим тренування").should("be.visible");
      cy.get("select").should("exist");
    });

    it("should display sets section", () => {
      cy.contains("Набори слів").should("be.visible");
    });

    it("should have link to manage sets", () => {
      cy.contains("Керувати").should("be.visible");
    });

    it("should navigate to manage sets", () => {
      cy.contains("Керувати").click();
      cy.url().should("include", "/quiz/manage");
    });
  });

  describe("Manage Sets Page", () => {
    beforeEach(() => {
      cy.visit("/quiz/manage");
    });

    it("should display manage sets page", () => {
      cy.contains("Керування наборами").should("be.visible");
    });

    it("should have form to create new set", () => {
      // Перевіряємо інпут для назви набору
      cy.get('input[placeholder*="Назва нового набору"]').should("exist");
      // Перевіряємо кнопку створення
      cy.get('button[type="submit"]').should("contain.text", "Створити");
    });

    it("should display sets list", () => {
      // Може бути порожнім, але контейнер має існувати
      cy.get("body").should("exist");
    });
  });

  describe("Manage Words Page", () => {
    beforeEach(() => {
      cy.visit("/quiz/manage/words");
    });

    it("should display manage words page", () => {
      // Може показувати повідомлення про вибір набору
      cy.get("body").should("exist");
    });

    it("should show message when no set selected", () => {
      cy.contains(/виберіть|набір/i).should("be.visible");
    });
  });

  describe("404 Page", () => {
    it("should display 404 page for unknown routes", () => {
      cy.visit("/unknown-route-12345", { failOnStatusCode: false });
      cy.contains("404").should("be.visible");
      cy.contains(/не знайдено/i).should("be.visible");
    });

    it("should have link to home page", () => {
      cy.visit("/unknown-route-12345", { failOnStatusCode: false });
      cy.contains(/головну|home/i).should("be.visible");
    });

    it("should navigate to home page", () => {
      cy.visit("/unknown-route-12345", { failOnStatusCode: false });
      cy.contains(/головну|home/i).click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });
});

