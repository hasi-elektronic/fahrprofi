import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface XPData {
  total: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  streak: number;
  lastStudyDate: string;
  todayXP: number;
  dailyGoal: number;
  achievements: string[];
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5800, 8000];

function calcLevel(totalXP: number): { level: number; xpInLevel: number; xpForNextLevel: number } {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) level = i;
    else break;
  }
  const xpInLevel = totalXP - LEVEL_THRESHOLDS[level];
  const nextThreshold = LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)];
  const xpForNextLevel = nextThreshold - LEVEL_THRESHOLDS[level];
  return { level, xpInLevel, xpForNextLevel };
}

export const LEVEL_NAMES: { [key: number]: { de: string; tr: string; icon: string } } = {
  0: { de: 'Anfänger', tr: 'Başlangıç', icon: '🌱' },
  1: { de: 'Lernender', tr: 'Öğrenci', icon: '📖' },
  2: { de: 'Fortgeschrittener', tr: 'İleri Düzey', icon: '🎯' },
  3: { de: 'Geübter', tr: 'Deneyimli', icon: '⭐' },
  4: { de: 'Experte', tr: 'Uzman', icon: '🏆' },
  5: { de: 'Meister', tr: 'Usta', icon: '👑' },
  6: { de: 'Profi', tr: 'Profesyonel', icon: '🚀' },
  7: { de: 'Champion', tr: 'Şampiyon', icon: '💎' },
  8: { de: 'Legende', tr: 'Efsane', icon: '🌟' },
  9: { de: 'Fahrprofi', tr: 'FahrProfi', icon: '🎖️' },
};

export const XP_REWARDS = {
  correct_easy: 10,
  correct_medium: 15,
  correct_hard: 25,
  streak_5: 20,
  streak_10: 50,
  exam_passed: 100,
  daily_goal: 30,
  speed_round: 5,
  memory_match: 20,
};

const DEFAULT_XP: XPData = {
  total: 0, level: 0, xpInLevel: 0, xpForNextLevel: 100,
  streak: 0, lastStudyDate: '', todayXP: 0, dailyGoal: 50,
  achievements: [],
};

export function useXP() {
  const [xp, setXP] = useState<XPData>(DEFAULT_XP);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('fahrprofi_xp').then((data) => {
      if (data) {
        const saved = JSON.parse(data) as XPData;
        // Check streak
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let streak = saved.streak;
        let todayXP = saved.todayXP;
        if (saved.lastStudyDate !== today) {
          if (saved.lastStudyDate !== yesterday) streak = 0;
          todayXP = 0;
        }
        setXP({ ...saved, streak, todayXP });
      }
    });
  }, []);

  const addXP = useCallback(async (amount: number, reason?: string): Promise<{ leveledUp: boolean; newLevel: number }> => {
    return new Promise((resolve) => {
      setXP((prev) => {
        const today = new Date().toDateString();
        const newTotal = prev.total + amount;
        const { level, xpInLevel, xpForNextLevel } = calcLevel(newTotal);
        const leveledUp = level > prev.level;

        const newStreak = prev.lastStudyDate === today
          ? prev.streak
          : prev.lastStudyDate === new Date(Date.now() - 86400000).toDateString()
            ? prev.streak + 1
            : 1;

        const newXP: XPData = {
          ...prev,
          total: newTotal,
          level,
          xpInLevel,
          xpForNextLevel,
          streak: newStreak,
          lastStudyDate: today,
          todayXP: prev.lastStudyDate === today ? prev.todayXP + amount : amount,
        };

        AsyncStorage.setItem('fahrprofi_xp', JSON.stringify(newXP));
        if (leveledUp) setLevelUp(true);
        resolve({ leveledUp, newLevel: level });
        return newXP;
      });
    });
  }, []);

  const dismissLevelUp = useCallback(() => setLevelUp(false), []);
  const resetXP = useCallback(async () => {
    await AsyncStorage.removeItem('fahrprofi_xp');
    setXP(DEFAULT_XP);
  }, []);

  return { xp, addXP, levelUp, dismissLevelUp, resetXP };
}
