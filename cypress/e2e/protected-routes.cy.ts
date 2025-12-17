describe("Protected Routes", () => {
  describe("Account Page", () => {
    it("should redirect to sign in when not authenticated", () => {
      cy.visit("/account");
      // Має редіректити на сторінку входу
      cy.url().should("include", "/auth/sign-in");
    });

    it("should redirect to sign in when accessing settings", () => {
      cy.visit("/account/settings");
      cy.url().should("include", "/auth/sign-in");
    });
  });

  describe("Navigation to protected routes", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("should not show profile link when not authenticated", () => {
      cy.contains("Профіль").should("not.exist");
    });

    it("should show sign in and sign up when not authenticated", () => {
      cy.contains("Вхід").should("be.visible");
      cy.contains("Реєстрація").should("be.visible");
    });
  });
});

