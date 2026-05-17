import { useState, useEffect, useCallback } from 'react';
import { fetchQuestions, fetchExamQuestions, type ParsedQuestion } from '../utils/api';
import { SAMPLE_QUESTIONS } from '../data/questions';

// Convert SAMPLE_QUESTIONS to ParsedQuestion format as fallback
function toApiFormat(q: any): ParsedQuestion {
  return {
    id: q.id,
    topic: q.topic,
    points: q.points,
    classes: q.class || ['B'],
    question: q.question,
    answers: q.answers.map((a: any) => ({ text: a.text, correct: a.correct })),
    explanation: q.explanation,
    hasImage: false,
  };
}

const FALLBACK = SAMPLE_QUESTIONS.map(toApiFormat);

export function useQuestions(params: {
  topic?: string;
  class?: string;
  limit?: number;
  random?: boolean;
  autoLoad?: boolean;
}) {
  const [questions, setQuestions] = useState<ParsedQuestion[]>(FALLBACK);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchQuestions({
        topic: params.topic,
        class: params.class,
        limit: params.limit || 50,
        random: params.random,
      });
      setQuestions(result.questions.length > 0 ? result.questions : FALLBACK);
      setTotal(result.total);
    } catch (e) {
      setError('Offline — lokale Fragen werden verwendet');
      setQuestions(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, [params.topic, params.class, params.limit, params.random]);

  useEffect(() => {
    if (params.autoLoad !== false) load();
  }, []);

  return { questions, total, loading, error, reload: load };
}

export function useExamQuestions(cls = 'B') {
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamQuestions(cls)
      .then((q) => setQuestions(q.length > 0 ? q : FALLBACK.slice(0, 5)))
      .catch(() => setQuestions(FALLBACK.slice(0, 5)))
      .finally(() => setLoading(false));
  }, [cls]);

  return { questions, loading };
}
