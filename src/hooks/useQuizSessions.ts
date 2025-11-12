import { useMemo } from "react";
import { useQuizDataContext } from "../lib/quiz/QuizDataProvider";

const formatMinutes = (minutes: number) => `${Math.round(minutes)} хв`;

export const useQuizSessions = () => {
  const { sessions, sets } = useQuizDataContext();

  const stats = useMemo(() => {
    if (!sessions.length) {
      return {
        sessions,
        totalSessions: 0,
        averageAccuracy: 0,
        recentSessions: [] as typeof sessions,
        favouriteSetName: null as string | null,
        averageSessionLength: formatMinutes(5),
      };
    }

    const accuracy =
      sessions.reduce((total, session) => total + session.accuracy, 0) / sessions.length;

    const setUsage = new Map<string, number>();
    sessions.forEach((session) => {
      session.setIds.forEach((id) => {
        setUsage.set(id, (setUsage.get(id) ?? 0) + 1);
      });
    });

    const favourite = [...setUsage.entries()].sort((a, b) => b[1] - a[1])[0];
    const favouriteSetName = favourite
      ? sets.find((set) => set.id === favourite[0])?.name ?? null
      : null;

    return {
      sessions,
      totalSessions: sessions.length,
      averageAccuracy: Number(accuracy.toFixed(1)),
      recentSessions: sessions.slice(0, 10),
      favouriteSetName,
      averageSessionLength: formatMinutes(5), // заглушка, бо тривалість не вимірюємо
    };
  }, [sessions, sets]);

  return stats;
};


