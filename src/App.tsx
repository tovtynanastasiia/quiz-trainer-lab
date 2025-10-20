import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import QuizPage from "./pages/quiz/QuizPage";
import AccountPage from "./pages/account/AccountPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="container-nice py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                QuizTrainer 🎯
              </Link>
              <div className="flex items-center gap-4">
                <Link to="/quiz" className="text-gray-700 hover:text-gray-900">
                  Квізи
                </Link>
                <Link to="/account" className="text-gray-700 hover:text-gray-900">
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
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
