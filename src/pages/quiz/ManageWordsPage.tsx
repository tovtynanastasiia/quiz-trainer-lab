import React from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const ManageWordsPage: React.FC = () => {
  // Отримання query параметрів з URL
  const [searchParams] = useSearchParams();
  const setId = searchParams.get("setId");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Навігація назад по історії
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Редагування слів {setId && `(Набір #${setId})`}
        </h1>
        <div className="flex gap-2">
          <button onClick={handleGoBack} className="btn btn-ghost">
            Назад
          </button>
          <Link to="/quiz/manage" className="btn btn-primary">
            До наборів
          </Link>
        </div>
      </div>
      <div className="card p-6">
        <p className="text-gray-600">
          Тут буде інтерфейс для редагування слів в наборі. Query параметр setId: {setId || "не вказано"}
        </p>
      </div>
    </div>
  );
};

export default ManageWordsPage;

