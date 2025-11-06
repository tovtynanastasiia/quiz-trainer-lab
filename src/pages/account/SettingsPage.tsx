import React from "react";
import { Link } from "react-router-dom";
import styles from "./SettingsPage.module.css";

const SettingsPage: React.FC = () => {
  return (
    <div className="container-nice py-8">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-6">Налаштування акаунту</h1>

        {/* Профіль */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Профіль</h2>
          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>Email</div>
              <div className={styles.settingValue}>user@example.com</div>
            </div>
            <button className="btn btn-ghost text-sm">Змінити</button>
          </div>
        </div>

        {/* Пароль */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Безпека</h2>
          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>Пароль</div>
              <div className={styles.settingValue}>••••••••</div>
            </div>
            <button className="btn btn-ghost text-sm">Змінити пароль</button>
          </div>
        </div>

        {/* Прогрес */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Дані</h2>
          <div className={styles.settingItem}>
            <div>
              <div className={styles.settingLabel}>Скинути прогрес</div>
              <div className={styles.settingDescription}>Видалить весь прогрес вивчення слів</div>
            </div>
            <button className={`btn btn-ghost text-sm ${styles.warningButton}`}>Скинути</button>
          </div>
        </div>

        {/* Кнопки */}
        <div className={styles.actions}>
          <Link to="/account" className="btn btn-ghost">
            Назад до профілю
          </Link>
          <button className={`btn ${styles.dangerButton}`}>Видалити акаунт</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
