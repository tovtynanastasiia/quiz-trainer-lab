import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { useAuth } from "../../lib/auth/AuthContext";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ??
    "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : "Не вдалося увійти. Спробуйте ще раз.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Увійти</h1>
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
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          <button className="btn btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Зачекайте..." : "Увійти"}
          </button>
        </form>
        <div className={styles.footer}>
          Немає акаунту?{" "}
          <Link to="/auth/sign-up" className={styles.link}>
            Зареєструватися
          </Link>
        </div>
        <div className={styles.footer}>
          <Link to="/auth/reset" className={styles.link}>
            Забули пароль?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
