import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="container-nice py-8 space-y-8">
      {/* Заголовок */}
      <div className="card p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">QuizTrainer 🎯</h1>
        <p className="text-xl text-gray-600 mb-6">
          Інтерактивний тренажер для вивчення іноземних слів
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link className="btn btn-primary" to="/auth/sign-in">
            Увійти
          </Link>
          <Link className="btn btn-ghost" to="/auth/sign-up">
            Реєстрація
          </Link>
        </div>
      </div>

      {/* Опис сайту */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Про QuizTrainer</h2>
        <p className="text-gray-600 mb-4">
          QuizTrainer - це сучасний веб-додаток для ефективного вивчення іноземних слів.
          Використовуючи інтерактивні квізи та адаптивну систему повторень, ви можете швидко та
          результативно розширити свій словниковий запас.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold mb-2">Персоналізовані набори</h3>
            <p className="text-sm text-gray-600">
              Створюйте власні набори слів або використовуйте готові
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-2">Чотири режими тренування</h3>
            <p className="text-sm text-gray-600">
              Навчання, точність, швидкість та флеш-картки для різних цілей
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl mb-2">🌍</div>
            <h3 className="font-semibold mb-2">Всі слова разом</h3>
            <p className="text-sm text-gray-600">
              Тренуйтесь з усіма словами з усіх наборів одночасно
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-2">Детальна статистика</h3>
            <p className="text-sm text-gray-600">Відстежуйте свій прогрес та досягнення</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="font-semibold mb-2">Генератор речень</h3>
            <p className="text-sm text-gray-600">Створюйте речення для тренування слів</p>
          </div>
        </div>
      </div>

      {/* Опис режимів */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Режими тренування</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Режим навчання */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">📖</div>
              <h3 className="text-xl font-semibold">Режим «Навчання»</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Ідеальний для початківців та систематичного вивчення слів. Система адаптивних
              повторень допомагає закріпити слова в пам'яті.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Без обмежень за часом</li>
              <li>• Адаптивні повторення</li>
              <li>• Множинний вибір наборів</li>
              <li>• Відстеження прогресу</li>
            </ul>
          </div>

          {/* Режим точності */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🎯</div>
              <h3 className="text-xl font-semibold">Режим «Точність»</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Тренуйте уважність та правильність введення. За 4 хвилини потрібно правильно ввести
              всі 20 слів з набору.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 20 слів за 4 хвилини</li>
              <li>• Один набір або "Всі слова"</li>
              <li>• Рахується точність</li>
              <li>• Можна пропускати слова</li>
            </ul>
          </div>

          {/* Режим швидкості */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">⚡</div>
              <h3 className="text-xl font-semibold">Режим «Швидкість»</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Розвивайте швидкість набору та реакцію. За 4 хвилини введіть якнайбільшу кількість
              слів правильно.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 4 хвилини на гру</li>
              <li>• Один набір або "Всі слова"</li>
              <li>• Рахується кількість</li>
              <li>• Без повторень</li>
            </ul>
          </div>

          {/* Режим флеш-карток */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🃏</div>
              <h3 className="text-xl font-semibold">Режим «Флеш-картки»</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Класичний метод вивчення з флеш-картками. Переглядайте слово, оцінюйте свої знання та
              переходите далі.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Без обмежень за часом</li>
              <li>• Один набір або "Всі слова"</li>
              <li>• Оцінка знань</li>
              <li>• Збереження прогресу</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Як почати */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Як почати?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="text-3xl mb-3">1️⃣</div>
            <h3 className="font-semibold mb-2">Зареєструйтесь</h3>
            <p className="text-sm text-gray-600">Створіть акаунт для збереження прогресу</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-3">2️⃣</div>
            <h3 className="font-semibold mb-2">Створіть набори</h3>
            <p className="text-sm text-gray-600">Додайте слова, які хочете вивчити</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-3">3️⃣</div>
            <h3 className="font-semibold mb-2">Тренуйтесь</h3>
            <p className="text-sm text-gray-600">Виберіть режим та почніть тренування</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link className="btn btn-primary btn-lg" to="/auth/sign-up">
            Почати зараз
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
