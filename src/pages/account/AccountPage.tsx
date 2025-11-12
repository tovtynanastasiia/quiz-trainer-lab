import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AccountPage.module.css";
import { useAuth } from "../../lib/auth/AuthContext";

const AccountPage: React.FC = () => {
  // Заглушка для статистики (мінімальні дані для демонстрації дизайну)
  const mockStats = {
    totalWords: 0,
    averageAccuracy: 0,
    totalTime: 0,
  };
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("[AccountPage] Failed to sign out", error);
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="container-nice py-8">
      <div className={styles.content}>
        {/* Заголовок та основна інформація */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div>
              <h1 className={styles.profileTitle}>Профіль користувача</h1>
                <p className={styles.profileEmail}>{user?.email ?? "user@example.com"}</p>
            </div>
            <div className={styles.profileActions}>
              <Link className="btn btn-primary" to="/quiz">
                Перейти до квізів
              </Link>
              <Link className="btn btn-ghost" to="/quiz/manage">
                Керувати наборами
              </Link>
              <Link className="btn btn-ghost" to="/account/settings">
                Налаштування
              </Link>
              <button className="btn btn-ghost" type="button" onClick={handleLogout}>
                Вийти
              </button>
            </div>
          </div>
        </div>

        {/* Загальна статистика */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.blueStatCard}`}>
            <div className={styles.statContent}>
              <div>
                <h3 className={styles.statTitle}>Загальна статистика</h3>
                <div className={styles.statValue}>{mockStats.totalWords}</div>
                <p className={styles.statLabel}>Слів правильно в іграх</p>
              </div>
              <div className={styles.statEmoji}>📚</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.greenStatCard}`}>
            <div className={styles.statContent}>
              <div>
                <h3 className={styles.statTitle}>Середня точність</h3>
                <div className={styles.statValue}>{mockStats.averageAccuracy.toFixed(2)}%</div>
                <p className={styles.statLabel}>По всім режимам</p>
              </div>
              <div className={styles.statEmoji}>🎯</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.purpleStatCard}`}>
            <div className={styles.statContent}>
              <div>
                <h3 className={styles.statTitle}>Загальний час</h3>
                <div className={styles.statValue}>0хв</div>
                <p className={styles.statLabel}>В режимах точності та швидкості</p>
              </div>
              <div className={styles.statEmoji}>⏱️</div>
            </div>
          </div>
        </div>

        {/* Початковий стан - немає даних */}
        <div className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <div className={styles.emptyEmoji}>📊</div>
            <p>Почніть грати, щоб побачити реальну статистику!</p>
            <div className={styles.emptyButton}>
              <Link className="btn btn-primary" to="/quiz">
                Перейти до квізів
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
