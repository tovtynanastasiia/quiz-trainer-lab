import React from "react";
import ProgressBar from "../../src/components/quiz/ProgressBar";

describe("ProgressBar Component", () => {
  it("рендериться з правильним значенням", () => {
    cy.mount(<ProgressBar value={50} />);
    cy.get("[style*='width: 50%']").should("exist");
  });

  it("відображає мітку та значення, коли передано label", () => {
    cy.mount(<ProgressBar value={75} label="Прогрес" />);
    cy.contains("Прогрес").should("exist");
    cy.contains("75%").should("exist");
  });

  it("не відображає мітку, коли label не передано", () => {
    cy.mount(<ProgressBar value={25} />);
    cy.contains("Прогрес").should("not.exist");
  });

  it("коректно відображає 0%", () => {
    cy.mount(<ProgressBar value={0} label="Початок" />);
    cy.get("[style*='width: 0%']").should("exist");
    cy.contains("0%").should("exist");
  });

  it("коректно відображає 100%", () => {
    cy.mount(<ProgressBar value={100} label="Завершено" />);
    cy.get("[style*='width: 100%']").should("exist");
    cy.contains("100%").should("exist");
  });
});

