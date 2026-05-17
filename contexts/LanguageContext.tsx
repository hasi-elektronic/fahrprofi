import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '../data/questions';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (translations: { [key in Language]?: string }) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'de',
  setLanguage: () => {},
  t: (translations) => translations.de || '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    AsyncStorage.getItem('language').then((saved) => {
      if (saved) setLanguageState(saved as Language);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = (translations: { [key in Language]?: string }): string => {
    return translations[language] || translations.de || Object.values(translations)[0] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export const LANGUAGE_NAMES: { [key in Language]: string } = {
  de: '🇩🇪 Deutsch',
  tr: '🇹🇷 Türkçe',
  en: '🇬🇧 English',
  ar: '🇸🇦 العربية',
  ru: '🇷🇺 Русский',
};
