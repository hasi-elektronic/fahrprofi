import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AmpelStatus = 0 | 1 | 2; // 0=rot, 1=gelb, 2=grün

interface AmpelData {
  [questionId: string]: {
    ampel: AmpelStatus;
    consecutive: number;
    bookmarked: boolean;
  };
}

const STORAGE_KEY = 'fahrprofi_ampel';

export function useAmpel() {
  const [data, setData] = useState<AmpelData>({});

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((d) => { if (d) setData(JSON.parse(d)); });
  }, []);

  const save = useCallback(async (newData: AmpelData) => {
    setData(newData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const recordAnswer = useCallback(async (questionId: string, correct: boolean) => {
    setData((prev) => {
      const cur = prev[questionId] || { ampel: 0, consecutive: 0, bookmarked: false };
      const consecutive = correct ? Math.min(cur.consecutive + 1, 2) : 0;
      const ampel: AmpelStatus = consecutive >= 2 ? 2 : consecutive === 1 ? 1 : 0;
      const updated = { ...prev, [questionId]: { ...cur, ampel, consecutive } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleBookmark = useCallback(async (questionId: string) => {
    setData((prev) => {
      const cur = prev[questionId] || { ampel: 0 as AmpelStatus, consecutive: 0, bookmarked: false };
      const updated = { ...prev, [questionId]: { ...cur, bookmarked: !cur.bookmarked } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getAmpel = useCallback((questionId: string): AmpelStatus => {
    return (data[questionId]?.ampel ?? 0) as AmpelStatus;
  }, [data]);

  const isBookmarked = useCallback((questionId: string): boolean => {
    return data[questionId]?.bookmarked ?? false;
  }, [data]);

  const getGlobalStats = useCallback(() => {
    const entries = Object.values(data);
    const rot = entries.filter((e) => e.ampel === 0).length;
    const gelb = entries.filter((e) => e.ampel === 1).length;
    const gruen = entries.filter((e) => e.ampel === 2).length;
    const bookmarks = entries.filter((e) => e.bookmarked).length;
    return { rot, gelb, gruen, bookmarks, studied: entries.length };
  }, [data]);

  const getTopicStats = useCallback((questionIds: string[]) => {
    const rot = questionIds.filter((id) => (data[id]?.ampel ?? 0) === 0).length;
    const gelb = questionIds.filter((id) => (data[id]?.ampel ?? 0) === 1).length;
    const gruen = questionIds.filter((id) => (data[id]?.ampel ?? 0) === 2).length;
    return { rot, gelb, gruen, total: questionIds.length };
  }, [data]);

  return { recordAnswer, toggleBookmark, getAmpel, isBookmarked, getGlobalStats, getTopicStats };
}
