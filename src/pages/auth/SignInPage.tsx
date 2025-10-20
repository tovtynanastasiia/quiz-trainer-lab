import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Implement Supabase authentication
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    // if (error) setError(error.message);
    // else navigate('/quiz');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-4">Увійти</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Зачекайте..." : "Увійти"}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-3">
          Немає акаунту?{" "}
          <Link to="/auth/sign-up" className="underline">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
