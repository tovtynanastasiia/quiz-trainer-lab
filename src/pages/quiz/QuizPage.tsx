import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import ModePicker from "../../components/quiz/ModePicker";
import styles from "./QuizPage.module.css";
import { useQuizSets } from "../../hooks/useQuizSets";
import { useQuizPlay } from "../../hooks/useQuizPlay";

const MODES = {
  education: { name: "Навчання", emoji: "📖" },
  accuracy: { name: "Точність", emoji: "🎯" },
  speed: { name: "Швидкість", emoji: "⚡" },
  flashcards: { name: "Флеш-картки", emoji: "🃏" },
};

const SINGLE_SET_MODES: Array<keyof typeof MODES> = ["accuracy", "speed", "flashcards"];
const SPEED_SESSION_DURATION = 240; // seconds

const INFINITE_MODES = new Set<keyof typeof MODES>(["education", "flashcards"]);

const MODE_DESCRIPTIONS: Record<keyof typeof MODES, string> = {
  education:
    "Безкінечний режим із миттєвою перевіркою. Вчись у власному темпі, неправильні відповіді додаються в список повторення.",
  accuracy:
    "20 слів за 4 хвилини. Важливі точність і уважність — кожна помилка коштує результату.",
  speed:
    "Тимчасовий челендж на 4 хвилини. Встигни дати якомога більше правильних відповідей, лічильник і таймер завжди перед очима.",
  flashcards:
    "Безкінечні флешкарти. Спочатку бачиш слово, потім відкриваєш переклад і відзначаєш, чи знав його.",
};

type AnswerSummary = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
};

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "");

const QuizPage: React.FC = () => {
  const { sets, loading: setsLoading } = useQuizSets();
  const {
    state: session,
    currentCard,
    answers,
    startSession,
    submitAnswer,
    skipCard,
    resetSession,
  } = useQuizPlay();

  const [selectedMode, setSelectedMode] = useState<keyof typeof MODES>("education");
  const [selectedSetIds, setSelectedSetIds] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [educationReview, setEducationReview] = useState<AnswerSummary[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<
    { type: "correct" | "incorrect"; question: string; correctAnswer?: string } | null
  >(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const [lastSummary, setLastSummary] = useState<{
    mode: string;
    setLabel: string;
    answers: AnswerSummary[];
    total: number;
    correct: number;
    timeExpired?: boolean;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const submittingRef = useRef(false);
  const previousAnswersRef = useRef(0);
  const [showFlashAnswer, setShowFlashAnswer] = useState(false);

  const totalWords = useMemo(
    () => sets.reduce((total, set) => total + set.words.length, 0),
    [sets],
  );

  useEffect(() => {
    if (!setsLoading && sets.length && selectedSetIds.length === 0) {
      setSelectedSetIds([sets[0].id]);
    }
  }, [sets, setsLoading, selectedSetIds.length]);

  useEffect(() => {
    if (SINGLE_SET_MODES.includes(selectedMode) && selectedSetIds.length > 1) {
      setSelectedSetIds((prev) => {
        if (prev.includes("all")) {
          return ["all"];
        }
        return prev.length ? [prev[0]] : [];
      });
    }
  }, [selectedMode, selectedSetIds]);

  const availableSets = useMemo(() => {
    const items = sets.map((set) => ({
      id: set.id,
      name: set.name,
      wordCount: set.words.length,
    }));
    if (totalWords > 0) {
      return [
        { id: "all", name: "Всі слова", wordCount: totalWords },
        ...items,
      ];
    }
    return items;
  }, [sets, totalWords]);

  const isSingleSelect = SINGLE_SET_MODES.includes(selectedMode);
  const selectionLocked = session.isActive;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    clearTimer();
    setTimeLeft(null);
    resetSession();
    setAnswer("");
    setEducationReview([]);
    setAnswerFeedback(null);
    setShowFlashAnswer(false);
    previousAnswersRef.current = 0;
    submittingRef.current = false;
  }, [clearTimer, resetSession]);

  const activeSetLabel = useMemo(() => {
    if (selectedSetIds.includes("all")) {
      return "Всі слова";
    }
    const names = sets
      .filter((set) => selectedSetIds.includes(set.id))
      .map((set) => set.name);
    return names.join(", ");
  }, [selectedSetIds, sets]);

  const buildSummary = useCallback(
    (options?: { timeExpired?: boolean }) => {
      if (!answers.length && session.queue.length === 0) {
        return null;
      }
      const correctCount = answers.reduce(
        (acc, item) => (item.isCorrect ? acc + 1 : acc),
        0,
      );
      return {
        mode: session.mode,
        setLabel: activeSetLabel || "Всі слова",
        answers: answers.map(({ question, correctAnswer, userAnswer, isCorrect }) => ({
          question,
          correctAnswer,
          userAnswer,
          isCorrect,
        })),
        total: answers.length,
        correct: correctCount,
        timeExpired: options?.timeExpired ?? false,
      };
    },
    [answers, session.mode, activeSetLabel],
  );

  const handleStop = useCallback(
    (options?: { timeExpired?: boolean }) => {
      const summary = buildSummary(options);
      if (summary) {
        setLastSummary(summary);
      }
      resetState();
    },
    [buildSummary, resetState],
  );

  const toggleSet = (id: string) => {
    if (selectionLocked) return;
    if (isSingleSelect) {
      setSelectedSetIds((prev) => (prev[0] === id ? [] : [id]));
      return;
    }

    if (id === "all") {
      setSelectedSetIds((prev) => (prev.includes("all") ? [] : ["all"]));
      return;
    }

    setSelectedSetIds((prev) => {
      const withoutAll = prev.filter((value) => value !== "all");
      if (withoutAll.includes(id)) {
        return withoutAll.filter((value) => value !== id);
      }
      return [...withoutAll, id];
    });
  };

  useEffect(() => {
    if (selectedMode !== "speed") {
      clearTimer();
      setTimeLeft(null);
      return;
    }

    if (!session.isActive) {
      clearTimer();
      return;
    }

    if (timeLeft === null) {
      return;
    }

    if (timeLeft <= 0) {
      handleStop({ timeExpired: true });
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearTimer();
          handleStop({ timeExpired: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [selectedMode, session.isActive, timeLeft, clearTimer, handleStop]);

  const acceptableNormalizedAnswers = useMemo(() => {
    if (!currentCard) return [] as string[];
    return currentCard.answer
      .split(",")
      .map((value) => normalize(value))
      .filter(Boolean);
  }, [currentCard]);

  const submitCurrentAnswer = useCallback(
    async (value: string) => {
      if (!currentCard || submittingRef.current) return;
      submittingRef.current = true;
      await submitAnswer(value.trim());
      setAnswer("");
      submittingRef.current = false;
    },
    [currentCard, submitAnswer],
  );

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode as keyof typeof MODES);
  };

  const handleStart = async () => {
    try {
      setError(null);
      setLastSummary(null);
      setEducationReview([]);
      setAnswerFeedback(null);
      setShowFlashAnswer(false);
      previousAnswersRef.current = 0;
      clearTimer();
      if (selectedMode === "speed") {
        setTimeLeft(SPEED_SESSION_DURATION);
      } else {
        setTimeLeft(null);
      }
      const target = selectedSetIds.length ? selectedSetIds : ["all"];
      await startSession({ setIds: target, mode: selectedMode });
    setAnswer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося розпочати сесію.");
    }
  };

  const handleInputChange = (value: string) => {
    setAnswer(value);
    if (!currentCard || selectedMode === "flashcards") return;
    const normalizedInput = normalize(value);
    if (!normalizedInput) return;
    if (
      acceptableNormalizedAnswers.some((candidate) => candidate.startsWith(normalizedInput))
    ) {
      void submitCurrentAnswer(value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim()) return;
    await submitCurrentAnswer(answer);
  };

  const handleSkip = async () => {
    await skipCard();
    setAnswer("");
    submittingRef.current = false;
  };

  const handleStopClick = () => {
    handleStop();
  };

  const handleFlashcardReveal = () => {
    setShowFlashAnswer((prev) => !prev);
  };

  const handleFlashcardCorrect = async () => {
    if (!currentCard) return;
    setShowFlashAnswer(false);
    await submitCurrentAnswer(currentCard.answer);
  };

  const handleFlashcardIncorrect = async () => {
    if (!currentCard) return;
    setShowFlashAnswer(false);
    await skipCard();
    submittingRef.current = false;
  };

  useEffect(() => {
    submittingRef.current = false;
    setAnswer("");
    setShowFlashAnswer(false);
  }, [currentCard?.id]);

  useEffect(() => {
    if (answers.length <= previousAnswersRef.current) return;
    const latest = answers[answers.length - 1];
    if (selectedMode === "education") {
      if (latest.isCorrect) {
        setAnswerFeedback({ type: "correct", question: latest.question });
        setEducationReview((prev) =>
          prev.filter((item) => item.question !== latest.question),
        );
      } else {
        setAnswerFeedback({
          type: "incorrect",
          question: latest.question,
          correctAnswer: latest.correctAnswer,
        });
        setEducationReview((prev) => {
          if (prev.some((item) => item.question === latest.question)) {
            return prev;
          }
          return [
            ...prev,
            {
              question: latest.question,
              correctAnswer: latest.correctAnswer,
              userAnswer: latest.userAnswer,
              isCorrect: false,
            },
          ];
        });
      }
    }
    previousAnswersRef.current = answers.length;
  }, [answers, selectedMode]);

  useEffect(() => {
    if (!answerFeedback) return;
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = window.setTimeout(() => {
      setAnswerFeedback(null);
    }, 2500) as unknown as number;
    return () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }
    };
  }, [answerFeedback]);

  useEffect(() => {
    if (!session.isFinished) {
      return;
    }
    const summary = buildSummary();
    if (!summary) {
      return;
    }
    setLastSummary((prev) => {
      if (
        prev &&
        prev.mode === summary.mode &&
        prev.setLabel === summary.setLabel &&
        prev.total === summary.total &&
        prev.correct === summary.correct &&
        prev.timeExpired === summary.timeExpired &&
        prev.answers.length === summary.answers.length
      ) {
        return prev;
      }
      return summary;
    });
  }, [session.isFinished, buildSummary]);

  useEffect(() => {
    if (!lastSummary || !summaryRef.current) {
      return;
    }
    summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [lastSummary]);

  const sessionModeInfinite = INFINITE_MODES.has(session.mode as keyof typeof MODES);
  const answeredCount = answers.length;
  const sessionProgress = sessionModeInfinite
    ? `Відповідей: ${answeredCount}`
    : session.queue.length
      ? `${Math.min(session.currentIndex + (currentCard ? 1 : 0), session.queue.length)} / ${session.queue.length}`
      : "";

  const canStart =
    !setsLoading &&
    (selectedSetIds.length > 0 || (availableSets.length === 1 && availableSets[0].id === "all"));

  const canStop =
    session.isActive || session.currentIndex > 0 || answers.length > 0;

  const summaryToShow = lastSummary;

  return (
    <div className="container-nice py-8 space-y-6">
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Quiz Trainer</h1>
          <Link className="btn btn-ghost text-sm" to="/account">
            📊 Мій профіль
          </Link>
        </div>
      </header>

      {summaryToShow ? (
        <section ref={summaryRef} className={styles.summaryCard}>
          <header className={styles.summaryHeader}>
            <div>
              <h2 className={styles.summaryTitle}>Результати</h2>
              <p className={styles.summaryMeta}>
                Режим:{" "}
                {MODES[summaryToShow.mode as keyof typeof MODES]?.name ?? summaryToShow.mode} ·{" "}
                {summaryToShow.setLabel}
              </p>
              <p className={styles.summaryMeta}>
                Всього відповідей: {summaryToShow.total}
              </p>
              <p className={styles.summaryMeta}>
                Правильних відповідей: {summaryToShow.correct} із {summaryToShow.total}
              </p>
            </div>
            <div className={styles.summaryBadges}>
              {INFINITE_MODES.has(summaryToShow.mode as keyof typeof MODES) ? (
                <span className={styles.summaryBadge}>Безкінечний режим</span>
              ) : null}
              {summaryToShow.timeExpired ? (
                <span className={styles.summaryBadge}>Час вийшов</span>
              ) : null}
            </div>
          </header>
          {summaryToShow.answers.length ? (
            <div className={styles.summaryTable}>
              <div className={styles.summaryTableHeader}>
                <span>Слово</span>
                <span>Ваша відповідь</span>
                <span>Правильно</span>
                <span />
              </div>
              <ul className={styles.summaryRows}>
                {summaryToShow.answers.map((item, index) => (
                  <li key={`${item.question}-${index}`} className={styles.summaryRow}>
                    <span className={styles.summaryQuestion}>{item.question}</span>
                    <span className={styles.summaryAnswer}>{item.userAnswer || "—"}</span>
                    <span className={styles.summaryCorrect}>{item.correctAnswer}</span>
                    <span
                      className={
                        item.isCorrect ? styles.summaryStatusOk : styles.summaryStatusFail
                      }
                    >
                      {item.isCorrect ? "✓" : "✕"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.muted}>Немає відповідей для відображення.</p>
          )}
          </section>
      ) : null}

      <main className={styles.main}>
        <div className={styles.layout}>
          <section className={styles.playArea}>
            <div className={styles.mainCard}>
              {error ? <p className={styles.errorText}>{error}</p> : null}

              {session.isActive && selectedMode === "speed" && timeLeft !== null ? (
                <div
                  className={`${styles.sessionTimer} ${
                    timeLeft <= 30 ? styles.sessionTimerWarning : ""
                  }`}
                >
                  ⏱ {Math.max(timeLeft, 0) ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                    .toString()
                    .padStart(2, "0")}` : "Час вийшов"}
                </div>
              ) : null}

              {answerFeedback && selectedMode === "education" ? (
                <div
                  className={`${styles.feedbackBanner} ${
                    answerFeedback.type === "correct"
                      ? styles.feedbackSuccess
                      : styles.feedbackError
                  }`}
                >
                  {answerFeedback.type === "correct"
                    ? "Правильно! Продовжуймо."
                    : `Неправильно. Правильна відповідь: ${answerFeedback.correctAnswer}`}
                </div>
              ) : null}

              {session.isFinished ? (
                <div className={styles.resultState}>
                  <div className={styles.resultEmoji}>🎉</div>
                  <h2 className={styles.resultTitle}>Сесію завершено!</h2>
                  <p className={styles.resultStat}>
                    Правильних відповідей: {session.correctAnswers} із {session.queue.length}
                  </p>
                  <div className={styles.resultActions}>
                    <button className="btn btn-primary" type="button" onClick={handleStart}>
                      Почати ще раз
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={handleStopClick}>
                      Завершити
                    </button>
                  </div>
                </div>
              ) : session.isActive && currentCard ? (
                selectedMode === "flashcards" ? (
                  <div className={styles.flashcardCard}>
                    <header className={styles.sessionHeader}>
                    <div>
                        <p className={styles.sessionMeta}>
                          {MODES[session.mode as keyof typeof MODES]?.name ?? session.mode} ·{" "}
                          {activeSetLabel || "Всі слова"}
                        </p>
                        <span className={styles.sessionProgress}>{sessionProgress}</span>
                      </div>
                    </header>

                    <div className={styles.flashcardContainer}>
                      <div
                        className={`${styles.flashcard} ${
                          showFlashAnswer ? styles.flashcardRevealed : ""
                        }`}
                      >
                        <div className={styles.flashcardFace}>
                          <span className={styles.flashcardLabel}>Слово</span>
                          <span className={styles.flashcardText}>{currentCard.question}</span>
                        </div>
                        <div className={styles.flashcardFace}>
                          <span className={styles.flashcardLabel}>Відповідь</span>
                          <span className={styles.flashcardText}>{currentCard.answer}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.flashActions}>
                      <button className="btn btn-ghost" type="button" onClick={handleFlashcardReveal}>
                        {showFlashAnswer ? "Сховати відповідь" : "Показати відповідь"}
                      </button>
                      <div className={styles.flashButtons}>
                        <button className="btn btn-ghost" type="button" onClick={handleFlashcardIncorrect}>
                          Не знаю
                        </button>
                        <button className="btn btn-primary" type="button" onClick={handleFlashcardCorrect}>
                          Знаю
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.sessionCard}>
                    <header className={styles.sessionHeader}>
                      <div>
                        <p className={styles.sessionMeta}>
                          {MODES[session.mode as keyof typeof MODES]?.name ?? session.mode} ·{" "}
                          {activeSetLabel || "Всі слова"}
                        </p>
                        <h2 className={styles.sessionQuestion}>{currentCard.question}</h2>
                      </div>
                      <span className={styles.sessionProgress}>{sessionProgress}</span>
                  </header>

                    <form className={styles.answerForm} onSubmit={handleSubmit}>
                      <label className={styles.answerLabel} htmlFor="answer">
                        Введіть відповідь
                  </label>
                  <input
                    id="answer"
                        className={styles.answerInput}
                        placeholder="Введіть відповідь"
                    value={answer}
                        onChange={(event) => handleInputChange(event.target.value)}
                    autoFocus
                  />
                      <div className={styles.answerActions}>
                    <button className="btn btn-ghost" type="button" onClick={handleSkip}>
                      Пропустити
                    </button>
                      </div>
                    </form>
                  </div>
                )
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyEmoji}>{MODES[selectedMode].emoji}</div>
                  <h2 className={styles.emptyTitle}>Режим «{MODES[selectedMode].name}»</h2>
                  <p className={styles.emptyText}>
                    {setsLoading
                      ? "Завантажуємо набори…"
                      : totalWords
                        ? "Виберіть набір слів на бічній панелі, щоб розпочати тренування."
                        : "Схоже, що у вас ще немає наборів. Створіть перший набір, щоб почати тренування."}
                  </p>
                  <Link className="btn btn-primary" to="/quiz/manage">
                    Керувати наборами
                  </Link>
                </div>
              )}
            </div>

            {selectedMode === "education" && educationReview.length > 0 && (
              <div className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span>Неправильні відповіді</span>
                  <span className={styles.reviewCount}>{educationReview.length}</span>
                </div>
                <ul className={styles.reviewList}>
                  {educationReview.map((item) => (
                    <li key={item.question}>
                      <span className={styles.reviewQuestion}>{item.question}</span>
                      <span className={styles.reviewArrow}>→</span>
                      <span className={styles.reviewAnswer}>{item.correctAnswer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.modeCard}>
              <ModePicker modes={MODES} value={selectedMode} onChange={handleModeChange} />
              <p className={styles.modeDescription}>{MODE_DESCRIPTIONS[selectedMode]}</p>
            </div>

            <div className={styles.setsCard}>
              <header className={styles.setsHeader}>
                <h3 className={styles.setsTitle}>Набори слів</h3>
                <Link className={styles.manageLink} to="/quiz/manage">
                  Керувати
                </Link>
              </header>

              {isSingleSelect && (
                <div className={styles.infoBox}>
                  <p className={styles.infoText}>
                    💡 Для цього режиму можна обрати лише один набір або «Всі слова».
                  </p>
                </div>
              )}

              {setsLoading ? (
                <p className={styles.muted}>Завантажуємо набори…</p>
              ) : !availableSets.length ? (
                <div className={styles.setsEmptyState}>
                  <div className={styles.setsEmptyEmoji}>📚</div>
                  <p className={styles.setsEmptyText}>Наборів ще немає</p>
                  <Link className="btn btn-primary text-sm" to="/quiz/manage">
                    Створити набір
                  </Link>
                </div>
              ) : (
                <ul className={styles.setsList}>
                  {availableSets.map((set) => (
                    <li key={set.id}>
                      <label
                        className={`${styles.setOption} ${
                          selectedSetIds.includes(set.id) ? styles.setOptionActive : ""
                        } ${selectionLocked ? styles.setOptionDisabled : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSetIds.includes(set.id)}
                          onChange={() => toggleSet(set.id)}
                          disabled={selectionLocked}
                        />
                        <div className={styles.setInfo}>
                          <p className={styles.setName}>{set.name}</p>
                          <p className={styles.setMeta}>Слів: {set.wordCount}</p>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.startActions}>
                <button
                  className="btn btn-primary w-full"
                  type="button"
                  onClick={handleStart}
                  disabled={!canStart}
                >
                  {session.isActive ? "Перезапустити" : "Почати тренування"}
                </button>
                <button
                  className="btn btn-ghost w-full"
                  type="button"
                  onClick={handleStopClick}
                  disabled={!canStop}
                >
                  Зупинити тест
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
};

export default QuizPage;
