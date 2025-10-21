import React from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className="container-nice py-8 space-y-8">
      {/* Заголовок */}
      <div className="card p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">QuizTrainer 🎯</h1>
        <p className="text-xl text-gray-600 mb-6">
          Інтерактивний тренажер для вивчення іноземних слів
        </p>
        <div className={styles.headerButtons}>
          <Link className={`btn btn-primary ${styles.headerButton}`} to="/auth/sign-in">
            Увійти
          </Link>
          <Link className={`btn btn-ghost ${styles.headerButton}`} to="/auth/sign-up">
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
        <div className={styles.featuresGrid}>
          <div className={styles.blueCard}>
            <div className={styles.emoji}>📚</div>
            <h3 className={styles.cardTitle}>Персоналізовані набори</h3>
            <p className={styles.cardText}>
              Створюйте власні набори слів або використовуйте готові
            </p>
          </div>
          <div className={styles.greenCard}>
            <div className={styles.emoji}>🎯</div>
            <h3 className={styles.cardTitle}>Чотири режими тренування</h3>
            <p className={styles.cardText}>
              Навчання, точність, швидкість та флеш-картки для різних цілей
            </p>
          </div>
          <div className={styles.yellowCard}>
            <div className={styles.emoji}>🌍</div>
            <h3 className={styles.cardTitle}>Всі слова разом</h3>
            <p className={styles.cardText}>Тренуйтесь з усіма словами з усіх наборів одночасно</p>
          </div>
          <div className={styles.purpleCard}>
            <div className={styles.emoji}>📊</div>
            <h3 className={styles.cardTitle}>Детальна статистика</h3>
            <p className={styles.cardText}>Відстежуйте свій прогрес та досягнення</p>
          </div>
          <div className={styles.orangeCard}>
            <div className={styles.emoji}>🎲</div>
            <h3 className={styles.cardTitle}>Генератор речень</h3>
            <p className={styles.cardText}>Створюйте речення для тренування слів</p>
          </div>
        </div>
      </div>

      {/* Опис режимів */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Режими тренування</h2>
        <div className={styles.modesGrid}>
          {/* Режим навчання */}
          <div className={styles.modeCard}>
            <div className={styles.modeHeader}>
              <div className={styles.modeEmoji}>📖</div>
              <h3 className={styles.modeTitle}>Режим «Навчання»</h3>
            </div>
            <p className={styles.modeDescription}>
              Ідеальний для початківців та систематичного вивчення слів. Система адаптивних
              повторень допомагає закріпити слова в пам'яті.
            </p>
            <ul className={styles.modeFeatures}>
              <li>• Без обмежень за часом</li>
              <li>• Адаптивні повторення</li>
              <li>• Множинний вибір наборів</li>
              <li>• Відстеження прогресу</li>
            </ul>
          </div>

          {/* Режим точності */}
          <div className={styles.modeCard}>
            <div className={styles.modeHeader}>
              <div className={styles.modeEmoji}>🎯</div>
              <h3 className={styles.modeTitle}>Режим «Точність»</h3>
            </div>
            <p className={styles.modeDescription}>
              Тренуйте уважність та правильність введення. За 4 хвилини потрібно правильно ввести
              всі 20 слів з набору.
            </p>
            <ul className={styles.modeFeatures}>
              <li>• 20 слів за 4 хвилини</li>
              <li>• Один набір або "Всі слова"</li>
              <li>• Рахується точність</li>
              <li>• Можна пропускати слова</li>
            </ul>
          </div>

          {/* Режим швидкості */}
          <div className={styles.modeCard}>
            <div className={styles.modeHeader}>
              <div className={styles.modeEmoji}>⚡</div>
              <h3 className={styles.modeTitle}>Режим «Швидкість»</h3>
            </div>
            <p className={styles.modeDescription}>
              Розвивайте швидкість набору та реакцію. За 4 хвилини введіть якнайбільшу кількість
              слів правильно.
            </p>
            <ul className={styles.modeFeatures}>
              <li>• 4 хвилини на гру</li>
              <li>• Один набір або "Всі слова"</li>
              <li>• Рахується кількість</li>
              <li>• Без повторень</li>
            </ul>
          </div>

          {/* Режим флеш-карток */}
          <div className={styles.modeCard}>
            <div className={styles.modeHeader}>
              <div className={styles.modeEmoji}>🃏</div>
              <h3 className={styles.modeTitle}>Режим «Флеш-картки»</h3>
            </div>
            <p className={styles.modeDescription}>
              Класичний метод вивчення з флеш-картками. Переглядайте слово, оцінюйте свої знання та
              переходите далі.
            </p>
            <ul className={styles.modeFeatures}>
              <li>• Без обмежень за часом</li>
              <li>• Один набір або "Всі слова"</li>
              <li>• Оцінка знань</li>
              <li>• Збереження прогресу</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Вибір наборів */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Вибір наборів слів</h2>
        <div className={styles.stepsGrid}>
          <div>
            <h3 className="text-lg font-semibold mb-3">🌍 Всі слова разом</h3>
            <ul className={styles.modeFeatures}>
              <li>• Спеціальна опція для тренування з усіма словами</li>
              <li>• Ексклюзивний вибір - не можна комбінувати з іншими</li>
              <li>• Загальна статистика по всіх словах</li>
              <li>• Ідеально для повторення всього матеріалу</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">📚 Індивідуальні набори</h3>
            <ul className={styles.modeFeatures}>
              <li>• Множинний вибір в режимі навчання</li>
              <li>• Один набір в режимах точності, швидкості та флеш-карток</li>
              <li>• Детальна статистика для кожного набору</li>
              <li>• Прогрес-бари для відстеження вивчення</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">🏆 Система досягнень</h3>
            <ul className={styles.modeFeatures}>
              <li>• Словник: За вивчення 100+ слів</li>
              <li>• Снайпер: За точність 90%+ в режимі точності</li>
              <li>• Швидкість: За 30+ слів/хв в режимі швидкості</li>
              <li>• Гравець: За 10+ зіграних ігор</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Як почати */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Як почати?</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepEmoji}>1️⃣</div>
            <h3 className={styles.stepTitle}>Зареєструйтесь</h3>
            <p className={styles.stepText}>Створіть акаунт для збереження прогресу</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepEmoji}>2️⃣</div>
            <h3 className={styles.stepTitle}>Створіть набори</h3>
            <p className={styles.stepText}>Додайте слова, які хочете вивчити</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepEmoji}>3️⃣</div>
            <h3 className={styles.stepTitle}>Тренуйтесь</h3>
            <p className={styles.stepText}>Виберіть режим та почніть тренування</p>
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
