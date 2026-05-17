import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProgress } from '../data/questions';
import { createInitialProgress, calculateNextReview } from '../utils/spaced-repetition';

const PROGRESS_KEY = 'fahrprofi_progress';

export function useProgress() {
  const [progress, setProgress] = useState<{ [questionId: string]: UserProgress }>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY).then((data) => {
      if (data) setProgress(JSON.parse(data));
      setLoaded(true);
    });
  }, []);

  const saveProgress = useCallback(async (updated: { [questionId: string]: UserProgress }) => {
    setProgress(updated);
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  }, []);

  const recordAnswer = useCallback(
    async (questionId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
      const current = progress[questionId] || createInitialProgress(questionId);
      const updated = calculateNextReview(current, quality);
      const newProgress = { ...progress, [questionId]: updated };
      await saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  const getQuestionProgress = useCallback(
    (questionId: string): UserProgress => {
      return progress[questionId] || createInitialProgress(questionId);
    },
    [progress]
  );

  const getStats = useCallback(() => {
    const entries = Object.values(progress);
    const total = entries.length;
    const correct = entries.reduce((s, e) => s + e.correct, 0);
    const wrong = entries.reduce((s, e) => s + e.wrong, 0);
    const learned = entries.filter((e) => e.correct >= 2 && e.correct > e.wrong).length;
    return { total, correct, wrong, learned };
  }, [progress]);

  const resetProgress = useCallback(async () => {
    await AsyncStorage.removeItem(PROGRESS_KEY);
    setProgress({});
  }, []);

  return { progress, loaded, recordAnswer, getQuestionProgress, getStats, resetProgress };
}
