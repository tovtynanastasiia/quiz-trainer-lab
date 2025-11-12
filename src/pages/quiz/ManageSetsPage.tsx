import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ManageSetsPage.module.css";
import { useQuizSets } from "../../hooks/useQuizSets";
import { useQuizWords } from "../../hooks/useQuizWords";

const ManageSetsPage: React.FC = () => {
  const { sets, createSet, updateSet, deleteSet } = useQuizSets();
  const { words } = useQuizWords("all");
  const [newSetName, setNewSetName] = useState("");
  const [creating, setCreating] = useState(false);

  const wordsBySetId = useMemo(() => {
    const groups = new Map<string, number>();
    words.forEach((word) => {
      groups.set(word.setId, (groups.get(word.setId) ?? 0) + 1);
    });
    return groups;
  }, [words]);

  const handleCreateSet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newSetName.trim();
    if (!name) {
      alert("Введіть назву набору");
      return;
    }
    if (sets.some((set) => set.name.toLowerCase() === name.toLowerCase())) {
      alert("Набір із такою назвою вже існує");
      return;
    }
    try {
      setCreating(true);
      await createSet({ name });
      setNewSetName("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Не вдалося створити набір");
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async (id: string, oldName: string) => {
    const name = prompt("Нова назва?", oldName)?.trim();
    if (!name || name === oldName) return;
    if (sets.some((set) => set.id !== id && set.name.toLowerCase() === name.toLowerCase())) {
      alert("Такий набір уже існує");
      return;
    }
    try {
      await updateSet(id, { name });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Не вдалося перейменувати набір");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const count = wordsBySetId.get(id) ?? 0;
    const confirmation = count
      ? `Видалити набір «${name}» разом із ${count} словами?`
        : `Видалити набір «${name}»?`;
    if (!window.confirm(confirmation)) return;
    try {
      await deleteSet(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Не вдалося видалити набір");
    }
  };

  return (
    <div className="container-nice py-8">
      <div className={styles.header}>
        <h1 className="text-2xl font-semibold">Керування наборами</h1>
        <form onSubmit={handleCreateSet} className={styles.createForm}>
            <input
              className="input"
              placeholder="Назва нового набору"
              value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            />
          <button
            className="btn btn-primary"
            disabled={creating || !newSetName.trim()}
            type="submit"
          >
            {creating ? "Створення…" : "Створити"}
          </button>
        </form>
      </div>
      <div className="card p-4">
        <div className={styles.setsList}>
          {sets.map((set) => (
            <div key={set.id} className={styles.setItem}>
              <div>
                <div className={styles.setName}>{set.name}</div>
                <p className={styles.setMeta}>
                  Слів у наборі: <strong>{wordsBySetId.get(set.id) ?? 0}</strong>
                </p>
              </div>
              <div className={styles.setActions}>
                <Link className="btn btn-ghost text-sm" to={`/quiz/manage/words?setId=${set.id}`}>
                  Редагувати слова
                </Link>
                <button
                  className="btn btn-ghost text-sm"
                  type="button"
                  onClick={() => handleRename(set.id, set.name)}
                >
                  Перейменувати
                </button>
                <button
                  className="btn btn-ghost text-sm"
                  type="button"
                  onClick={() => handleDelete(set.id, set.name)}
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
          {!sets.length && (
            <div className={styles.emptyState}>
              <div className={styles.emptyEmoji}>📚</div>
              <p className="text-gray-600">Немає наборів. Створіть перший.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSetsPage;
