import React from "react";
import { Link } from "react-router-dom";

const AccountPage: React.FC = () => {
  // Заглушка для статистики (мінімальні дані для демонстрації дизайну)
  const mockStats = {
    totalWords: 0,
    averageAccuracy: 0,
    totalTime: 0,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Заголовок та основна інформація */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Профіль користувача</h1>
            <p className="text-gray-600 mt-2">user@example.com</p>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-primary" to="/quiz">
              Перейти до квізів
            </Link>
            <button className="btn btn-ghost">Вийти</button>
          </div>
        </div>
      </div>

      {/* Загальна статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Загальна статистика</h3>
              <div className="text-3xl font-bold text-blue-600 mt-2">{mockStats.totalWords}</div>
              <p className="text-blue-700">Слів правильно в іграх</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Середня точність</h3>
              <div className="text-3xl font-bold text-green-600 mt-2">
                {mockStats.averageAccuracy.toFixed(2)}%
              </div>
              <p className="text-green-700">По всім режимам</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-800">Загальний час</h3>
              <div className="text-3xl font-bold text-purple-600 mt-2">0хв</div>
              <p className="text-purple-700">В режимах точності та швидкості</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Початковий стан - немає даних */}
      <div className="card p-6">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-4">📊</div>
          <p>Почніть грати, щоб побачити статистику!</p>
          <Link className="btn btn-primary mt-4" to="/quiz">
            Перейти до квізів
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
