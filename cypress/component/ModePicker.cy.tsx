import React from "react";
import ModePicker from "../../src/components/quiz/ModePicker";

const MODES = {
  education: { name: "Навчання", emoji: "📖" },
  accuracy: { name: "Точність", emoji: "🎯" },
  speed: { name: "Швидкість", emoji: "⚡" },
  flashcards: { name: "Флеш-картки", emoji: "🃏" },
};

describe("ModePicker Component", () => {
  it("рендериться з міткою", () => {
    cy.mount(<ModePicker modes={MODES} value="education" onChange={cy.stub()} />);
    cy.contains("Режим тренування").should("exist");
  });

  it("відображає всі режими", () => {
    cy.mount(<ModePicker modes={MODES} value="education" onChange={cy.stub()} />);
    cy.get("select").should("exist");
    cy.contains("📖 Навчання").should("exist");
    cy.contains("🎯 Точність").should("exist");
    cy.contains("⚡ Швидкість").should("exist");
    cy.contains("🃏 Флеш-картки").should("exist");
  });

  it("відображає вибраний режим", () => {
    cy.mount(<ModePicker modes={MODES} value="accuracy" onChange={cy.stub()} />);
    cy.get("select").should("have.value", "accuracy");
  });

  it("викликає onChange при зміні режиму", () => {
    const onChange = cy.stub();
    cy.mount(<ModePicker modes={MODES} value="education" onChange={onChange} />);
    cy.get("select").select("speed");
    cy.then(() => {
      expect(onChange).to.have.been.calledWith("speed");
    });
  });
});

