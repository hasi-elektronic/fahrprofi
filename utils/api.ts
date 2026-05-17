import type { Language } from '../data/questions';

const API_BASE = 'https://fahrprofi-api.hguencavdi.workers.dev';

export interface ApiQuestion {
  id: string;
  topic: string;
  points: number;
  classes: string;
  question_de: string;
  question_en: string;
  question_tr: string;
  question_ar: string;
  question_ru: string;
  answers: string; // JSON string
  explanation_de: string;
  has_image: number;
  image_url: string; // Google Cloud image URL
}

export interface ParsedQuestion {
  id: string;
  topic: string;
  points: number;
  classes: string[];
  question: { [key in Language]?: string };
  answers: { text: { [key in Language]?: string }; correct: boolean }[];
  explanation?: { [key in Language]?: string };
  hasImage: boolean;
  imageUrl?: string; // real image URL from Google Cloud
}

function parseApiQuestion(q: ApiQuestion): ParsedQuestion {
  let rawAnswers: { de: string; en: string; correct: boolean }[] = [];
  try {
    const parsed = typeof q.answers === 'string' ? JSON.parse(q.answers || '[]') : q.answers;
    rawAnswers = Array.isArray(parsed) ? parsed : [];
  } catch { rawAnswers = []; }
  return {
    id: q.id,
    topic: q.topic,
    points: q.points,
    classes: q.classes.split(','),
    question: {
      de: q.question_de,
      en: q.question_en || q.question_de,
      tr: q.question_tr || '',
      ar: q.question_ar || '',
      ru: q.question_ru || '',
    },
    answers: rawAnswers.map((a) => ({
      text: {
        de: a.de,
        en: a.en || a.de,
        tr: '',
        ar: '',
        ru: '',
      },
      correct: a.correct,
    })),
    explanation: q.explanation_de ? { de: q.explanation_de } : undefined,
    hasImage: q.has_image === 1,
    imageUrl: q.image_url && q.image_url.length > 0 ? q.image_url : undefined,
  };
}

export async function fetchQuestions(params: {
  topic?: string;
  class?: string;
  limit?: number;
  offset?: number;
  random?: boolean;
}): Promise<{ questions: ParsedQuestion[]; total: number }> {
  const p = new URLSearchParams();
  if (params.topic) p.set('topic', params.topic);
  if (params.class) p.set('class', params.class);
  if (params.limit) p.set('limit', params.limit.toString());
  if (params.offset) p.set('offset', params.offset.toString());
  if (params.random) p.set('random', '1');

  const res = await fetch(`${API_BASE}/api/questions?${p.toString()}`);
  const data = await res.json() as any;
  return {
    questions: (data.questions || []).map(parseApiQuestion),
    total: data.total || 0,
  };
}

export async function fetchExamQuestions(cls = 'B'): Promise<ParsedQuestion[]> {
  const res = await fetch(`${API_BASE}/api/exam?class=${cls}`);
  const data = await res.json() as any;
  return (data.questions || []).map(parseApiQuestion);
}

export async function fetchTopicStats(): Promise<{ topic: string; count: number }[]> {
  const res = await fetch(`${API_BASE}/api/topics`);
  const data = await res.json() as any;
  return data.topics || [];
}

export async function syncProgress(userId: string, progress: {
  question_id: string;
  correct: number;
  wrong: number;
  next_review: number;
  ease_factor: number;
  interval_days: number;
}): Promise<void> {
  await fetch(`${API_BASE}/api/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, ...progress }),
  });
}
