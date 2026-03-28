import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Implement Supabase authentication
    // const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    // if (error) setError(error.message);
    // else navigate('/quiz');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Реєстрація</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Пароль (мін. 6 символів)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <div className={styles.error}>{error}</div>}
          <button className="btn btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Зачекайте..." : "Створити акаунт"}
          </button>
        </form>
        <div className={styles.footer}>
          Вже маєте акаунт?{" "}
          <Link to="/auth/sign-in" className={styles.link}>
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
