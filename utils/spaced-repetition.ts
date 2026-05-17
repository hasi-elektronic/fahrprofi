import type { UserProgress } from '../data/questions';

// SM-2 Spaced Repetition Algorithm
export function calculateNextReview(
  progress: UserProgress,
  quality: 0 | 1 | 2 | 3 | 4 | 5 // 0-2 fail, 3-5 pass
): UserProgress {
  let { easeFactor, interval } = progress;

  if (quality < 3) {
    // Failed: reset interval
    interval = 1;
  } else {
    if (interval === 0) interval = 1;
    else if (interval === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  }

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...progress,
    easeFactor,
    interval,
    nextReview,
    lastSeen: Date.now(),
    correct: quality >= 3 ? progress.correct + 1 : progress.correct,
    wrong: quality < 3 ? progress.wrong + 1 : progress.wrong,
  };
}

export function createInitialProgress(questionId: string): UserProgress {
  return {
    questionId,
    correct: 0,
    wrong: 0,
    lastSeen: 0,
    nextReview: Date.now(),
    easeFactor: 2.5,
    interval: 0,
  };
}

export function isDueForReview(progress: UserProgress): boolean {
  return Date.now() >= progress.nextReview;
}

export function getSuccessRate(progress: UserProgress): number {
  const total = progress.correct + progress.wrong;
  if (total === 0) return 0;
  return Math.round((progress.correct / total) * 100);
}

// Exam simulation: random 30 questions from pool
export function selectExamQuestions<T extends { id: string; points: number }>(
  questions: T[],
  count = 30
): T[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function calculateExamScore(
  answers: { questionId: string; correct: boolean; points: number }[]
): { score: number; maxScore: number; passed: boolean; percentage: number } {
  const maxScore = answers.reduce((sum, a) => sum + a.points, 0);
  const score = answers
    .filter((a) => a.correct)
    .reduce((sum, a) => sum + a.points, 0);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  // Bestanden wenn maximal 10 Fehlerpunkte
  const wrongPoints = answers
    .filter((a) => !a.correct)
    .reduce((sum, a) => sum + a.points, 0);
  const passed = wrongPoints <= 10;

  return { score, maxScore, passed, percentage };
}
