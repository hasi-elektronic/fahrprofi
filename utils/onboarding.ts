import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingData {
  completed: boolean;
  klasse: 'B' | 'B+A' | 'A';
  language: 'de' | 'tr' | 'en' | 'ar' | 'ru';
  dailyGoal: number; // questions per day
  startDate: string;
  examDate?: string; // planned exam date
}

const KEY = 'fahrprofi_onboarding';

export const DEFAULT_ONBOARDING: OnboardingData = {
  completed: false,
  klasse: 'B',
  language: 'de',
  dailyGoal: 20,
  startDate: new Date().toISOString(),
};

export async function loadOnboarding(): Promise<OnboardingData> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_ONBOARDING, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_ONBOARDING;
}

export async function saveOnboarding(data: Partial<OnboardingData>): Promise<void> {
  const current = await loadOnboarding();
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...current, ...data }));
}

export async function completeOnboarding(data: Omit<OnboardingData, 'completed' | 'startDate'>): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify({
    ...data,
    completed: true,
    startDate: new Date().toISOString(),
  }));
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
