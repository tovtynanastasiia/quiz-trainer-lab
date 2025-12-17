import React from "react";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "../../src/pages/NotFoundPage";

describe("NotFoundPage Component", () => {
  it("рендериться з повідомленням про 404", () => {
    cy.mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    cy.contains(/404|не знайдено|not found/i).should("exist");
  });

  it("відображає посилання на головну сторінку", () => {
    cy.mount(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    cy.contains(/головну|home/i).should("exist");
  });
});

