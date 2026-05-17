import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar,
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
type ModalId =
  | 'MultipleChoice' | 'Flashcard' | 'Swipe' | 'SpeedRound'
  | 'MemoryMatch' | 'ExamSession' | 'Topic' | 'Pruefungsampel' | 'Fragenliste';

interface ModalState { id: ModalId; params?: any; }

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home',     icon: '⌂', label: 'Start'      },
  { id: 'learn',    icon: '◎', label: 'Lernen'     },
  { id: 'exam',     icon: '✏', label: 'Prüfung'    },
  { id: 'stats',    icon: '▦', label: 'Statistik'  },
  { id: 'settings', icon: '⚙', label: 'Einstellung'},
];

const MODAL_TITLES: Partial<Record<ModalId, string>> = {
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

// ─── TOP NAV — always rendered ─────────────────────────────────────────────
function TopNav({
  tab, setTab, modal, onBack,
}: {
  tab: TabId;
  setTab: (t: TabId) => void;
  modal: ModalState | undefined;
  onBack: () => void;
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
      {/* Row 1 — logo + tabs (always visible) */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingTop: 6,
        paddingBottom: 2,
      }}>
        <TouchableOpacity
          onPress={() => { setTab('home'); }}
          style={{ paddingHorizontal: 10, paddingVertical: 6 }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, letterSpacing: -0.3 }}>
            FahrProfi
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: 4 }} />

        {TABS.map((t) => {
          const isActive = tab === t.id && !modal;
          return (
            <TouchableOpacity
              key={t.id}
              style={{
                flex: 1, alignItems: 'center', paddingVertical: 7,
                paddingHorizontal: 2, borderRadius: 10,
                backgroundColor: isActive ? colors.primaryLight : 'transparent',
              }}
              onPress={() => { setTab(t.id); }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, opacity: isActive ? 1 : 0.35 }}>{t.icon}</Text>
              <Text style={{
                fontSize: 9, fontWeight: '700',
                color: isActive ? colors.primary : colors.textMuted,
                marginTop: 1, letterSpacing: 0.1,
              }}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Row 2 — modal breadcrumb (only when in modal) */}
      {modal && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.elevated,
        }}>
          <TouchableOpacity
            onPress={onBack}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18, color: colors.primary, lineHeight: 20 }}>←</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>Zurück</Text>
          </TouchableOpacity>
          <View style={{ width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: 10 }} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
            {MODAL_TITLES[modal.id] || modal.id}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── APP CONTENT ────────────────────────────────────────────────────────────
function AppContent() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<TabId>('home');
  const [modalStack, setModalStack] = useState<ModalState[]>([]);

  const currentModal = modalStack[modalStack.length - 1];

  const navigate = (id: ModalId, params?: any) =>
    setModalStack((s) => [...s, { id, params }]);

  const goBack = () => setModalStack((s) => s.slice(0, -1));

  const handleSetTab = (t: TabId) => {
    setModalStack([]);
    setTab(t);
  };

  const navigation = { navigate: (s: string, p?: any) => navigate(s as ModalId, p), goBack };

  const renderTab = () => {
    const props: any = { navigation, route: {} };
    switch (tab) {
      case 'home':     return <HomeScreen {...props} />;
      case 'learn':    return <LearnScreen {...props} />;
      case 'exam':     return <ExamScreen {...props} />;
      case 'stats':    return <StatsScreen {...props} />;
      case 'settings': return <SettingsScreen {...props} />;
    }
  };

  const renderModal = (modal: ModalState) => {
    const nav = { navigate: (s: string, p?: any) => navigate(s as ModalId, p), goBack };
    const route = { params: modal.params || {} };
    switch (modal.id) {
      case 'MultipleChoice': return <MultipleChoiceScreen navigation={nav} route={route} />;
      case 'Flashcard':      return <FlashcardScreen navigation={nav} route={{ params: modal.params || { questions: SAMPLE_QUESTIONS } }} />;
      case 'Swipe':          return <SwipeScreen navigation={nav} route={{ params: modal.params || { questions: SAMPLE_QUESTIONS } }} />;
      case 'SpeedRound':     return <SpeedRoundScreen navigation={nav} />;
      case 'MemoryMatch':    return <MemoryMatchScreen navigation={nav} />;
      case 'ExamSession':    return <ExamSessionScreen navigation={nav} />;
      case 'Topic':          return <TopicScreen navigation={nav} route={route} />;
      case 'Pruefungsampel': return <PruefungsampelScreen navigation={nav} />;
      case 'Fragenliste':    return <FragenlisteScreen navigation={nav} />;
      default:               return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* ← TOP NAV: ALWAYS VISIBLE, EVERY PAGE */}
      <TopNav
        tab={tab}
        setTab={handleSetTab}
        modal={currentModal}
        onBack={goBack}
      />

      {/* Content */}
      <View style={{ flex: 1 }}>
        {currentModal ? renderModal(currentModal) : renderTab()}
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
