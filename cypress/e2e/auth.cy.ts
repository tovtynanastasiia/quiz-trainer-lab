describe("Authentication Pages", () => {
  describe("Sign In Page", () => {
    beforeEach(() => {
      cy.visit("/auth/sign-in");
    });

    it("should display sign in form", () => {
      cy.contains("Увійти").should("be.visible");
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="password"]').should("exist");
      cy.get('button[type="submit"]').should("contain.text", "Увійти");
    });

    it("should have links to sign up and reset password", () => {
      cy.contains("Зареєструватися").should("be.visible");
      cy.contains("Забули пароль?").should("be.visible");
    });

    it("should navigate to sign up page", () => {
      cy.contains("Зареєструватися").click();
      cy.url().should("include", "/auth/sign-up");
    });

    it("should navigate to reset password page", () => {
      cy.contains("Забули пароль?").click();
      cy.url().should("include", "/auth/reset");
    });

    it("should show validation for empty form", () => {
      cy.get('button[type="submit"]').click();
      // HTML5 validation should prevent submission
      cy.get('input[type="email"]:invalid').should("exist");
    });
  });

  describe("Sign Up Page", () => {
    beforeEach(() => {
      cy.visit("/auth/sign-up");
    });

    it("should display sign up form", () => {
      cy.contains(/реєстрац/i).should("be.visible");
      cy.get('input[type="email"]').should("exist");
      cy.get('input[type="password"]').should("exist");
      cy.get('button[type="submit"]').should("exist");
    });

    it("should have link to sign in", () => {
      cy.contains(/вхід|увійти/i).should("be.visible");
    });

    it("should navigate to sign in page", () => {
      cy.contains(/вхід|увійти/i).click();
      cy.url().should("include", "/auth/sign-in");
    });
  });

  describe("Reset Password Page", () => {
    beforeEach(() => {
      cy.visit("/auth/reset");
    });

    it("should display reset password form", () => {
      cy.contains(/відновлення|парол/i).should("be.visible");
      cy.get('input[type="email"]').should("exist");
      cy.get('button[type="submit"]').should("contain.text", "Надіслати");
    });

    it("should have link back to sign in", () => {
      cy.contains(/повернутися|вхід/i).should("be.visible");
    });

    it("should navigate back to sign in", () => {
      cy.contains(/повернутися|вхід/i).click();
      cy.url().should("include", "/auth/sign-in");
    });
  });
});

