import React, { useState } from "react";
import { Link } from "react-router-dom";

const MODES = {
  education: { name: "Навчання", emoji: "📖" },
  accuracy: { name: "Точність", emoji: "🎯" },
  speed: { name: "Швидкість", emoji: "⚡" },
  flashcards: { name: "Флеш-картки", emoji: "🃏" },
};

const QuizPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<keyof typeof MODES>("education");

  return (
    <div className="container-nice py-8">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Quiz Trainer</h1>
          <Link className="btn btn-ghost text-sm" to="/account">
            📊 Мій профіль
          </Link>
        </div>
      </header>

      <main className="mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Основний контент квізу */}
          <div className="flex-1">
            <div className="card p-4 md:p-6">
              <div className="text-center text-gray-700 py-12">
                <div className="text-6xl mb-4">{MODES[selectedMode].emoji}</div>
                <h2 className="text-2xl font-semibold mb-2">Режим "{MODES[selectedMode].name}"</h2>
                <p className="text-gray-600 mb-6">
                  Виберіть набір слів на бічній панелі для початку тренування
                </p>
                <Link to="/quiz" className="btn btn-primary">
                  Обрати набір слів
                </Link>
              </div>
            </div>
          </div>

          {/* Бічна панель з наборами */}
          <div className="lg:w-80">
            <div className="card p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Режим тренування
              </label>
              <select
                className="select"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value as keyof typeof MODES)}
              >
                {Object.entries(MODES).map(([key, mode]) => (
                  <option key={key} value={key}>
                    {mode.emoji} {mode.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-4">Набори слів</h3>
              {(selectedMode === "accuracy" ||
                selectedMode === "speed" ||
                selectedMode === "flashcards") && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Для режимів{" "}
                    <strong>
                      {selectedMode === "accuracy"
                        ? "Точність"
                        : selectedMode === "speed"
                          ? "Швидкість"
                          : "Флеш-картки"}
                    </strong>{" "}
                    можна вибрати тільки один набір або "Всі слова"
                  </p>
                </div>
              )}
              <div className="text-center text-gray-600 py-8">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-sm mb-4">Наборів слів ще немає</p>
                <Link className="btn btn-primary text-sm" to="/quiz">
                  Створити перший набір
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
