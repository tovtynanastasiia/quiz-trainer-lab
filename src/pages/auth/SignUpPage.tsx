import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import { useAuth } from "../../lib/auth/AuthContext";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const data = await signUp({ email: email.trim(), password });
      if (data.session) {
        navigate("/quiz", { replace: true });
      } else {
        setInfo("Ми надіслали лист для підтвердження. Перевірте вашу пошту.");
      }
    } catch (authError) {
      const message =
        authError instanceof Error
          ? authError.message
          : "Не вдалося створити акаунт. Спробуйте ще раз.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
          {info && <div className={styles.success}>{info}</div>}
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
