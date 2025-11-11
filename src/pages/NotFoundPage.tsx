import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Навігація назад по історії
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Сторінку не знайдено</h2>
        <p className={styles.description}>
          Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">
            На головну
          </Link>
          <button onClick={handleGoBack} className="btn btn-ghost">
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

