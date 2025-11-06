import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import QuizPage from "./pages/quiz/QuizPage";
import ManageSetsPage from "./pages/quiz/ManageSetsPage";
import AccountPage from "./pages/account/AccountPage";
import SettingsPage from "./pages/account/SettingsPage";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <div className={styles.navContent}>
              <Link to="/" className={styles.logo}>
                QuizTrainer 🎯
              </Link>
              <div className={styles.navLinks}>
                <Link to="/quiz" className={styles.navLink}>
                  Квізи
                </Link>
                <Link to="/account" className={styles.navLink}>
                  Профіль
                </Link>
                <Link to="/auth/sign-in" className="btn btn-ghost text-sm">
                  Вхід
                </Link>
                <Link to="/auth/sign-up" className="btn btn-primary text-sm">
                  Реєстрація
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/sign-in" element={<SignInPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            <Route path="/auth/reset" element={<ResetPasswordPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/manage" element={<ManageSetsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
