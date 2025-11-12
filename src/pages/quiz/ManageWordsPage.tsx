import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuizSets } from "../../hooks/useQuizSets";
import { useQuizWords } from "../../hooks/useQuizWords";
import styles from "./ManageWordsPage.module.css";

type RowState = {
  question: string;
  answer: string;
  dirty: boolean;
  saving: boolean;
};

type ParsedBulkItem = {
  question: string;
  answers: string[];
};

const splitByHyphen = /[-–—]/;

const ManageWordsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setId = searchParams.get("setId") ?? undefined;

  const { sets } = useQuizSets();
  const {
    words,
    loading,
    refresh,
    createWord,
    updateWord,
    deleteWord,
  } = useQuizWords(setId);

  const [bulkText, setBulkText] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [addingBulk, setAddingBulk] = useState(false);
  const [rowEdits, setRowEdits] = useState<Record<string, RowState>>({});
  const [savingAll, setSavingAll] = useState(false);

  const activeSet = useMemo(
    () => sets.find((set) => set.id === setId),
    [sets, setId],
  );

  useEffect(() => {
    const next: Record<string, RowState> = {};
    words.forEach((word) => {
      next[word.id] = {
        question: word.question,
        answer: word.answer,
        dirty: false,
        saving: false,
      };
    });
    setRowEdits(next);
  }, [words]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const parseLine = (line: string): ParsedBulkItem | null => {
    const raw = line.trim();
    if (!raw) return null;
    const parts = raw.split(splitByHyphen);
    if (parts.length < 2) return null;
    const question = parts[0]?.trim();
    const rest = parts.slice(1).join("-").trim();
    if (!question || !rest) return null;
    const answers = rest
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!answers.length) return null;
    return { question, answers };
  };

  const parseBulk = (input: string): ParsedBulkItem[] => {
    const lines = input.split(/\r?\n/);
    const items: ParsedBulkItem[] = [];
    lines.forEach((line) => {
      const parsed = parseLine(line);
      if (parsed) {
        items.push(parsed);
      }
    });
    return items;
  };

  const handleBulkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!setId) {
      setBulkError("Спочатку оберіть набір зі списку нижче.");
      return;
    }
    const items = parseBulk(bulkText);
    if (!items.length) {
      setBulkError("Не знайдено жодного рядка з форматом «word - переклад1, переклад2».");
      return;
    }

    const existingQuestions = new Set(
      words.map((word) => word.question.trim().toLowerCase()),
    );
    const lowerInput = new Set<string>();
    const duplicates: string[] = [];

    items.forEach((item) => {
      const normalized = item.question.toLowerCase();
      if (existingQuestions.has(normalized) || lowerInput.has(normalized)) {
        duplicates.push(item.question);
      }
      lowerInput.add(normalized);
    });

    if (duplicates.length) {
      setBulkError(
        `Слова з такою назвою вже існують: ${duplicates.join(", ")}`,
      );
      return;
    }

    setBulkError(null);
    setAddingBulk(true);
    try {
      await Promise.all(
        items.map((item) =>
          createWord({
        setId,
            question: item.question.trim(),
            answer: item.answers.join(", "),
          }),
        ),
      );
      setBulkText("");
      await refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не вдалося додати слова. Спробуйте ще раз.";
      setBulkError(message);
    } finally {
      setAddingBulk(false);
    }
  };

  const handleRowChange = (id: string, field: "question" | "answer", value: string) => {
    setRowEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        dirty: true,
      },
    }));
  };

  const handleSaveAll = async () => {
    const dirtyEntries = Object.entries(rowEdits).filter(
      ([, state]) => state.dirty,
    );
    if (!dirtyEntries.length) return;
    setSavingAll(true);
    try {
      await Promise.all(
        dirtyEntries.map(([id, state]) =>
          updateWord(id, {
            question: state.question.trim(),
            answer: state.answer.trim(),
          }),
        ),
      );
      await refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти зміни. Спробуйте ще раз.",
      );
    } finally {
      setSavingAll(false);
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!window.confirm(`Видалити слово «${question}»?`)) return;
    try {
      await deleteWord(id);
      await refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Не вдалося видалити слово.");
    }
  };

  const hasDirtyEdits = Object.values(rowEdits).some((state) => state.dirty);

  if (!setId) {
  return (
      <div className={styles.page}>
        <div className={styles.placeholderCard}>
          <h1 className={styles.placeholderTitle}>Виберіть набір</h1>
          <p className={styles.placeholderText}>
            Для редагування слів потрібно вибрати набір.
          </p>
          <Link className="btn btn-primary" to="/quiz/manage">
            До наборів
          </Link>
          <div className={styles.placeholderSets}>
            {sets.map((set) => (
              <Link
                key={set.id}
                className="btn btn-ghost"
                to={`/quiz/manage/words?setId=${set.id}`}
              >
                {set.name}
              </Link>
            ))}
            {!sets.length && (
              <span className={styles.placeholderHint}>
                Набори відсутні. Створіть їх у розділі «Набори».
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            {activeSet?.name ?? "Слова набору"}
          </h1>
          {activeSet?.description ? (
            <p className={styles.subtitle}>{activeSet.description}</p>
          ) : null}
        </div>
        <div className={styles.headerActions}>
          <Link className="btn btn-ghost" to="/quiz/manage">
            ← До наборів
          </Link>
          <button
            className="btn btn-primary"
            type="button"
            disabled={!hasDirtyEdits || savingAll}
            onClick={handleSaveAll}
          >
            {savingAll ? "Збереження…" : "Зберегти зміни"}
          </button>
              </div>
              </div>

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Додати кілька слів</h2>
        <p className={styles.sectionDescription}>
          Формат: <code>слово - переклад, альтернативний переклад</code>. Кожне слово з нового рядка.
        </p>
        <form className={styles.bulkForm} onSubmit={handleBulkSubmit}>
          {bulkError && <p className={styles.errorText}>{bulkError}</p>}
          <textarea
            className={styles.bulkTextarea}
            value={bulkText}
            placeholder={"cat - кіт, котик\nto run - бігти"}
            onChange={(event) => setBulkText(event.target.value)}
                />
          <div className={styles.bulkActions}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={addingBulk || !bulkText.trim()}
            >
              {addingBulk ? "Додаємо…" : "Додати всі"}
                </button>
              </div>
            </form>
          </section>

      <section className={styles.sectionCard}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>Слова набору</h2>
          <span className={styles.listCount}>
            Всього: {loading ? "…" : words.length}
          </span>
        </div>

        {loading ? (
          <p className={styles.muted}>Завантаження…</p>
        ) : !words.length ? (
          <p className={styles.muted}>Поки немає слів. Додайте перші!</p>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <span className={styles.headerCell}>Слово</span>
              <span className={styles.headerCell}>Відповіді</span>
              <span className={styles.headerCell} />
            </div>
            <div className={styles.rows}>
              {words.map((word) => {
                const edit =
                  rowEdits[word.id] ?? {
                    question: word.question,
                    answer: word.answer,
                    hint: word.hint ?? "",
                    dirty: false,
                    saving: false,
                  };

                return (
                  <div
                  key={word.id}
                    className={`${styles.row} ${edit.dirty ? styles.rowDirty : ""}`}
                  >
                    <div className={styles.cell}>
                      <span className={styles.mobileLabel}>Слово</span>
                      <input
                        className={styles.textInput}
                        value={edit.question}
                        onChange={(event) =>
                          handleRowChange(word.id, "question", event.target.value)
                        }
                      />
                    </div>

                    <div className={styles.cell}>
                      <span className={styles.mobileLabel}>Відповіді (через кому)</span>
                      <input
                        className={styles.textInput}
                        value={edit.answer}
                        onChange={(event) =>
                          handleRowChange(word.id, "answer", event.target.value)
                        }
                      />
                    </div>

                    <div className={styles.actionsCell}>
                      {edit.dirty ? (
                        <span className={styles.dirtyBadge}>Змінено</span>
                    ) : null}
                    <button
                      className="btn btn-ghost text-sm"
                      type="button"
                        onClick={() => handleDelete(word.id, edit.question)}
                        disabled={savingAll}
                    >
                      Видалити
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
        </>
      )}
      </section>
    </div>
  );
};

export default ManageWordsPage;

