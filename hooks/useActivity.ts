import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  answered: number;
  correct: number;
  wrong: number;
  xp: number;
  minutesStudied: number;
}

export interface ActivityData {
  days: DayActivity[];
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  totalXP: number;
  longestStreak: number;
}

const KEY = 'fahrprofi_activity';

const today = () => new Date().toISOString().split('T')[0];
const getDay = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const EMPTY: ActivityData = {
  days: [], totalAnswered: 0, totalCorrect: 0, totalWrong: 0, totalXP: 0, longestStreak: 0,
};

export function useActivity() {
  const [data, setData] = useState<ActivityData>(EMPTY);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setData(JSON.parse(raw));
    });
  }, []);

  const recordSession = useCallback(async (correct: number, wrong: number, xp: number, minutes = 1) => {
    setData((prev) => {
      const todayStr = today();
      const days = [...prev.days];
      const existing = days.find((d) => d.date === todayStr);
      if (existing) {
        existing.answered += correct + wrong;
        existing.correct += correct;
        existing.wrong += wrong;
        existing.xp += xp;
        existing.minutesStudied += minutes;
      } else {
        days.push({ date: todayStr, answered: correct + wrong, correct, wrong, xp, minutesStudied: minutes });
      }
      // Keep last 60 days
      days.sort((a, b) => b.date.localeCompare(a.date));
      const trimmed = days.slice(0, 60);
      const updated: ActivityData = {
        days: trimmed,
        totalAnswered: prev.totalAnswered + correct + wrong,
        totalCorrect: prev.totalCorrect + correct,
        totalWrong: prev.totalWrong + wrong,
        totalXP: prev.totalXP + xp,
        longestStreak: prev.longestStreak,
      };
      AsyncStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getLast7Days = useCallback((): DayActivity[] => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = getDay(6 - i);
      const found = data.days.find((d) => d.date === date);
      return found || { date, answered: 0, correct: 0, wrong: 0, xp: 0, minutesStudied: 0 };
    });
  }, [data]);

  const getTodayActivity = useCallback((): DayActivity => {
    const todayStr = today();
    return data.days.find((d) => d.date === todayStr) ||
      { date: todayStr, answered: 0, correct: 0, wrong: 0, xp: 0, minutesStudied: 0 };
  }, [data]);

  const getSuccessRate = useCallback((): number => {
    if (data.totalAnswered === 0) return 0;
    return Math.round((data.totalCorrect / data.totalAnswered) * 100);
  }, [data]);

  return { data, recordSession, getLast7Days, getTodayActivity, getSuccessRate };
}
