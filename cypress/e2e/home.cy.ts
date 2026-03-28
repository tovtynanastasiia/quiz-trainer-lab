describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the home page", () => {
    cy.contains("Quiz Trainer").should("be.visible");
  });

  it("should have a working navigation", () => {
    cy.get("a").should("exist");
  });
});
