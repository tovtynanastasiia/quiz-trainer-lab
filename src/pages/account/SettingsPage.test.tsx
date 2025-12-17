import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SettingsPage from "./SettingsPage";

describe("SettingsPage", () => {
  it("рендериться з заголовком", () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Налаштування акаунту" })).toBeInTheDocument();
  });

  it("відображає секцію профілю", () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Профіль")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Змінити" })).toBeInTheDocument();
  });

  it("відображає секцію безпеки", () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Безпека")).toBeInTheDocument();
    expect(screen.getByText("Пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Змінити пароль" })).toBeInTheDocument();
  });

  it("відображає секцію даних", () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Дані")).toBeInTheDocument();
    expect(screen.getByText("Скинути прогрес")).toBeInTheDocument();
    expect(
      screen.getByText("Видалить весь прогрес вивчення слів"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Скинути" })).toBeInTheDocument();
  });

  it("відображає кнопки дій", () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole("link", { name: "Назад до профілю" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Видалити акаунт" })).toBeInTheDocument();
  });

  it("має правильні посилання", () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    const backLink = screen.getByRole("link", { name: "Назад до профілю" });
    expect(backLink).toHaveAttribute("href", "/account");
  });
});




