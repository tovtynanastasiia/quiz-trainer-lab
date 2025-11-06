import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // TODO: Implement Supabase password reset
    // const { error } = await supabase.auth.resetPasswordForEmail(email);
    setSent(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Відновлення паролю</h1>
        {sent ? (
          <div>
            <p className="text-gray-600 mb-4">Перевірте вашу пошту для подальших інструкцій.</p>
            <Link to="/auth/sign-in" className="btn btn-primary w-full">
              Повернутися до входу
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <div className={styles.error}>{error}</div>}
            <button className="btn btn-primary w-full" type="submit">
              Надіслати лист
            </button>
          </form>
        )}
        <div className={styles.footer}>
          <Link to="/auth/sign-in" className={styles.link}>
            Повернутися до входу
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
