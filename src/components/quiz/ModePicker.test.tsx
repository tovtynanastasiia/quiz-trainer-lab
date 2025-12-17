import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModePicker from "./ModePicker";

describe("ModePicker", () => {
  const mockModes = {
    education: { name: "Навчання", emoji: "📖" },
    accuracy: { name: "Точність", emoji: "🎯" },
    speed: { name: "Швидкість", emoji: "⚡" },
  };

  it("рендериться з правильними опціями", () => {
    render(<ModePicker modes={mockModes} value="education" onChange={vi.fn()} />);
    
    expect(screen.getByText("📖 Навчання")).toBeInTheDocument();
    expect(screen.getByText("🎯 Точність")).toBeInTheDocument();
    expect(screen.getByText("⚡ Швидкість")).toBeInTheDocument();
  });

  it("відображає правильне значення за замовчуванням", () => {
    render(<ModePicker modes={mockModes} value="accuracy" onChange={vi.fn()} />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("accuracy");
  });

  it("викликає onChange при зміні значення", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<ModePicker modes={mockModes} value="education" onChange={handleChange} />);
    
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await user.selectOptions(select, "speed");
    
    // Перевіряємо, що onChange був викликаний з правильним значенням
    expect(handleChange).toHaveBeenCalled();
    // Можливо буде викликано кілька разів через React синтез подій
    const calls = handleChange.mock.calls;
    expect(calls.some(call => call[0] === "speed")).toBe(true);
  });

  it("відображає label", () => {
    render(<ModePicker modes={mockModes} value="education" onChange={vi.fn()} />);
    expect(screen.getByText("Режим тренування")).toBeInTheDocument();
  });
});




