import React, { useState } from "react";
import { Link } from "react-router-dom";
import ModePicker from "../../components/quiz/ModePicker";
import styles from "./QuizPage.module.css";

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
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Quiz Trainer</h1>
          <Link className="btn btn-ghost text-sm" to="/account">
            📊 Мій профіль
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Основний контент квізу */}
          <div className={styles.mainContent}>
            <div className={styles.mainCard}>
              <div className={styles.emptyState}>
                <div className={styles.emptyEmoji}>{MODES[selectedMode].emoji}</div>
                <h2 className={styles.emptyTitle}>Режим "{MODES[selectedMode].name}"</h2>
                <p className={styles.emptyText}>
                  Виберіть набір слів на бічній панелі для початку тренування
                </p>
                <Link to="/quiz" className="btn btn-primary">
                  Обрати набір слів
                </Link>
              </div>
            </div>
          </div>

          {/* Бічна панель з наборами */}
          <div className={styles.sidebar}>
            <div className={styles.modeCard}>
              <ModePicker
                modes={MODES}
                value={selectedMode}
                onChange={(mode) => setSelectedMode(mode as keyof typeof MODES)}
              />
            </div>

            <div className={styles.setsCard}>
              <h3 className={styles.setsTitle}>Набори слів</h3>
              {(selectedMode === "accuracy" ||
                selectedMode === "speed" ||
                selectedMode === "flashcards") && (
                <div className={styles.infoBox}>
                  <p className={styles.infoText}>
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
              <div className={styles.setsEmptyState}>
                <div className={styles.setsEmptyEmoji}>📚</div>
                <p className={styles.setsEmptyText}>Наборів слів ще немає</p>
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
