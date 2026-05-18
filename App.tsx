import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

import HomeScreen     from './app/tabs/HomeScreen';
import LearnScreen    from './app/tabs/LearnScreen';
import ExamScreen     from './app/tabs/ExamScreen';
import StatsScreen    from './app/tabs/StatsScreen';
import SettingsScreen from './app/tabs/SettingsScreen';
import MultipleChoiceScreen from './app/modals/MultipleChoiceScreen';
import FlashcardScreen      from './app/modals/FlashcardScreen';
import SwipeScreen          from './app/modals/SwipeScreen';
import SpeedRoundScreen     from './app/modals/SpeedRoundScreen';
import MemoryMatchScreen    from './app/modals/MemoryMatchScreen';
import ExamSessionScreen    from './app/modals/ExamSessionScreen';
import TopicScreen          from './app/modals/TopicScreen';
import PruefungsampelScreen from './app/modals/PruefungsampelScreen';
import FragenlisteScreen    from './app/modals/FragenlisteScreen';
import { SAMPLE_QUESTIONS } from './data/questions';


type TabId = 'home' | 'learn' | 'exam' | 'stats' | 'settings';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home',     icon: '⌂', label: 'Start'      },
  { id: 'learn',    icon: '◎', label: 'Lernen'     },
  { id: 'exam',     icon: '✏', label: 'Prüfung'    },
  { id: 'stats',    icon: '▦', label: 'Statistik'  },
  { id: 'settings', icon: '⚙', label: 'Einstellung'},
];

const MODAL_TITLES: Record<string, string> = {
  MultipleChoice: 'Multiple Choice',
  Flashcard:      'Karteikarten',
  Swipe:          'Swipe & Learn',
  SpeedRound:     'Speed Round ⚡',
  MemoryMatch:    'Memory Match 🃏',
  ExamSession:    'Prüfungssimulation',
  Topic:          'Thema',
  Pruefungsampel: 'Prüfungsampel 🚦',
  Fragenliste:    'Fragenliste 📋',
};

function TopBar({ tab, setTab, modalTitle, onBack }: {
  tab: TabId;
  setTab: (t: TabId) => void;
  modalTitle?: string;
  onBack?: () => void;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      backgroundColor: colors.surface,
      paddingTop: insets.top,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#1E3A5F',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 100,
    }}>
      {/* Tab row — always visible */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingTop: 6, paddingBottom: 2 }}>
        <TouchableOpacity onPress={() => setTab('home')} style={{ paddingHorizontal: 10, paddingVertical: 6 }} activeOpacity={0.7}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary, letterSpacing: -0.3 }}>FahrProfi</Text>
        </TouchableOpacity>
        <View style={{ width: 1, height: 18, backgroundColor: colors.border, marginHorizontal: 4 }} />
        {TABS.map((t) => {
          const active = tab === t.id && !modalTitle;
          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => { setTab(t.id); }}
              style={{
                flex: 1, alignItems: 'center', paddingVertical: 7, paddingHorizontal: 2,
                borderRadius: 10,
                backgroundColor: active ? colors.primaryLight : 'transparent',
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, opacity: active ? 1 : 0.35 }}>{t.icon}</Text>
              <Text style={{ fontSize: 9, fontWeight: '700', color: active ? colors.primary : colors.textMuted, marginTop: 1 }}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Breadcrumb — only when modal open */}
      {modalTitle && onBack && (
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 14, paddingVertical: 8,
          borderTopWidth: 1, borderTopColor: colors.border,
          backgroundColor: colors.elevated,
        }}>
          <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, color: colors.primary, lineHeight: 20 }}>←</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>Zurück</Text>
          </TouchableOpacity>
          <View style={{ width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: 10 }} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{modalTitle}</Text>
        </View>
      )}
    </View>
  );
}

function AppContent() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<TabId>('home');

  const [stack, setStack] = useState<{ id: string; params?: any }[]>([]);

  const current = stack[stack.length - 1];

  const push = (id: string, params?: any) => setStack(s => [...s, { id, params }]);
  const pop  = () => setStack(s => s.slice(0, -1));
  const goHome = () => { setStack([]); setTab('home'); };

  const nav = { navigate: push, goBack: pop };

  const handleSetTab = (t: TabId) => { setStack([]); setTab(t); };

  const renderModal = (m: { id: string; params?: any }) => {
    const n = { navigate: push, goBack: pop };
    const r = { params: m.params || {} };
    switch (m.id) {
      case 'MultipleChoice': return <MultipleChoiceScreen navigation={n} route={r} />;
      case 'Flashcard':      return <FlashcardScreen navigation={n} route={{ params: { questions: m.params?.questions || SAMPLE_QUESTIONS } }} />;
      case 'Swipe':          return <SwipeScreen navigation={n} route={{ params: { questions: m.params?.questions || SAMPLE_QUESTIONS } }} />;
      case 'SpeedRound':     return <SpeedRoundScreen navigation={n} />;
      case 'MemoryMatch':    return <MemoryMatchScreen navigation={n} />;
      case 'ExamSession':    return <ExamSessionScreen navigation={n} />;
      case 'Topic':          return <TopicScreen navigation={n} route={r} />;
      case 'Pruefungsampel': return <PruefungsampelScreen navigation={n} />;
      case 'Fragenliste':    return <FragenlisteScreen navigation={n} />;
      default: return null;
    }
  };

  const renderTab = () => {
    const p: any = { navigation: nav, route: {} };
    switch (tab) {
      case 'home':     return <HomeScreen {...p} />;
      case 'learn':    return <LearnScreen {...p} />;
      case 'exam':     return <ExamScreen {...p} />;
      case 'stats':    return <StatsScreen {...p} />;
      case 'settings': return <SettingsScreen {...p} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* TOP BAR — ALWAYS VISIBLE */}
      <TopBar
        tab={tab}
        setTab={handleSetTab}
        modalTitle={current ? MODAL_TITLES[current.id] : undefined}
        onBack={current ? pop : undefined}
      />

      {/* Content */}
      <View style={{ flex: 1 }}>
        {current ? renderModal(current) : renderTab()}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
