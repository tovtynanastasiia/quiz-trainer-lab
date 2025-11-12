import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuizSessions } from "../../hooks/useQuizSessions";
import { useQuizSets } from "../../hooks/useQuizSets";

const QuizDetailPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { sessions } = useQuizSessions();
  const { sets } = useQuizSets();

  const session = useMemo(
    () => sessions.find((item) => item.id === quizId),
    [sessions, quizId],
  );

  const setNames = useMemo(() => {
    if (!session) return "—";
    if (session.setIds.includes("all")) return "Усі набори";
    const names = sets
      .filter((set) => session.setIds.includes(set.id))
      .map((set) => set.name);
    return names.length ? names.join(", ") : "Набір не знайдено";
  }, [session, sets]);

  if (!session) {
    return (
      <div className="container py-8 space-y-4">
        <h1 className="text-2xl font-semibold">Сесію не знайдено</h1>
        <p className="text-gray-600">
          Перевірте посилання або відкрийте будь-яку сесію на сторінці профілю.
        </p>
        <div className="flex gap-2">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>
            Назад
          </button>
          <Link className="btn btn-primary" to="/quiz">
            До тренувань
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Звіт про сесію</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(session.createdAt).toLocaleString("uk-UA")} · режим: {session.mode}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>
          Назад
        </button>
          <Link className="btn btn-primary" to="/quiz">
            До тренувань
          </Link>
        </div>
      </header>

      <section className="card p-6 grid gap-4 md:grid-cols-3">
        <div className="border border-slate-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Вірних відповідей</p>
          <p className="text-3xl font-semibold mt-2">
            {session.correctAnswers}/{session.totalQuestions}
          </p>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Точність</p>
          <p className="text-3xl font-semibold mt-2">{session.accuracy}%</p>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Набори</p>
          <p className="text-sm text-gray-700 mt-2">{setNames}</p>
      </div>
      </section>
    </div>
  );
};

export default QuizDetailPage;

