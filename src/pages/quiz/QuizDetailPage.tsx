import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const QuizDetailPage: React.FC = () => {
  // Отримання параметрів з URL
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Отримання query параметрів (якщо є)
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");

  const handleGoBack = () => {
    navigate(-1); // Навігація назад по історії
  };

  const handleGoToQuiz = () => {
    navigate("/quiz"); // Програмний редірект
  };

  return (
    <div className="container py-8">
      <h1>Квіз #{quizId}</h1>
      {mode && <p>Режим: {mode}</p>}
      <div className="flex gap-4 mt-4">
        <button onClick={handleGoBack} className="btn btn-ghost">
          Назад
        </button>
        <button onClick={handleGoToQuiz} className="btn btn-primary">
          До списку квізів
        </button>
      </div>
    </div>
  );
};

export default QuizDetailPage;

