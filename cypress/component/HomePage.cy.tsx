import React from "react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../src/pages/HomePage";

describe("HomePage Component", () => {
  it("рендериться без помилок", () => {
    cy.mount(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
  });

  it("відображає посилання на квізи", () => {
    cy.mount(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    cy.contains(/квіз/i).should("exist");
  });
});

