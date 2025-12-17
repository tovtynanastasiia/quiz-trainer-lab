import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("рендериться з правильним значенням", () => {
    const { container } = render(<ProgressBar value={50} />);
    const fill = container.querySelector('[style*="width: 50%"]');
    expect(fill).toBeInTheDocument();
  });

  it("відображає label та значення, коли передано label", () => {
    render(<ProgressBar value={75} label="Прогрес" />);
    expect(screen.getByText("Прогрес")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("не відображає label, коли він не передано", () => {
    render(<ProgressBar value={50} />);
    expect(screen.queryByText("Прогрес")).not.toBeInTheDocument();
  });

  it("правильно встановлює ширину fill на основі value", () => {
    const { container } = render(<ProgressBar value={60} />);
    const fill = container.querySelector('[style*="width: 60%"]') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill?.style.width).toBe("60%");
  });

  it("працює з мінімальним значенням 0", () => {
    const { container } = render(<ProgressBar value={0} label="Початок" />);
    const fill = container.querySelector('[style*="width: 0%"]') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill?.style.width).toBe("0%");
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("працює з максимальним значенням 100", () => {
    const { container } = render(<ProgressBar value={100} label="Завершено" />);
    const fill = container.querySelector('[style*="width: 100%"]') as HTMLElement;
    expect(fill).toBeInTheDocument();
    expect(fill?.style.width).toBe("100%");
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});




