import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ManageSetsPage.module.css";

const ManageSetsPage: React.FC = () => {
  const [sets] = useState<Array<{ id: string; name: string }>>([
    { id: "1", name: "Англійська базова" },
    { id: "2", name: "Німецька для початківців" },
    { id: "3", name: "Французька розмовна" },
  ]);
  const [newSetName, setNewSetName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateSet = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSetName.trim();
    if (!name) return;
    setCreating(true);
    // TODO: Implement createSet API
    // await createSet(name);
    setNewSetName("");
    setCreating(false);
  };

  const handleRename = (id: string, oldName: string) => {
    const name = prompt("Нова назва?", oldName)?.trim();
    if (!name || name === oldName) return;
    // TODO: Implement renameSet API
    // await renameSet(id, name);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Видалити набір разом зі словами?")) return;
    // TODO: Implement deleteSet API
    // await deleteSet(id);
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
          {sets.map((s) => (
            <div key={s.id} className={styles.setItem}>
              <div className={styles.setName}>{s.name}</div>
              <div className={styles.setActions}>
                <Link className="btn btn-ghost text-sm" to={`/quiz/manage/words?setId=${s.id}`}>
                  Редагувати слова
                </Link>
                <button
                  className="btn btn-ghost text-sm"
                  onClick={() => handleRename(s.id, s.name)}
                >
                  Перейменувати
                </button>
                <button className="btn btn-ghost text-sm" onClick={() => handleDelete(s.id)}>
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
