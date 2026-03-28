import React from "react";
import App from "../../src/App";

describe("App Component", () => {
  it("should render without crashing", () => {
    cy.mount(<App />);
  });

  it("should display the app title", () => {
    cy.mount(<App />);
    cy.contains("Quiz Trainer").should("exist");
  });
});
