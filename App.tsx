import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Screens
import HomeScreen    from './app/tabs/HomeScreen';
import LearnScreen   from './app/tabs/LearnScreen';
import ExamScreen    from './app/tabs/ExamScreen';
import StatsScreen   from './app/tabs/StatsScreen';
import SettingsScreen from './app/tabs/SettingsScreen';

// Modals (pushed on top of main)
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

interface ModalState {
  id: ModalId;
  params?: any;
}

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home',     icon: '⌂',  label: 'Start' },
  { id: 'learn',    icon: '◎',  label: 'Lernen' },
  { id: 'exam',     icon: '✏',  label: 'Prüfung' },
  { id: 'stats',    icon: '▦',  label: 'Statistik' },
  { id: 'settings', icon: '⚙',  label: 'Einstellung' },
];

function TopNav({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const s = StyleSheet.create({
    wrap: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingTop: insets.top,
      shadowColor: '#1E3A5F',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 100,
    },
    inner: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    logo: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginRight: 4,
    },
    logoText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: -0.3,
    },
    divider: {
      width: 1, height: 22,
      backgroundColor: colors.border,
      marginRight: 4,
    },
    tab: {
      flex: 1, alignItems: 'center', paddingVertical: 8,
      paddingHorizontal: 2, borderRadius: 10,
    },
    tabActive: {
      backgroundColor: colors.primaryLight,
    },
    tabIcon: { fontSize: 17, marginBottom: 2 },
    tabLabel: { fontSize: 9.5, fontWeight: '600', letterSpacing: 0.1 },
  });

  return (
    <View style={s.wrap}>
      <View style={s.inner}>
        {/* Logo — sempre cliccabile per home */}
        <TouchableOpacity style={s.logo} onPress={() => setTab('home')} activeOpacity={0.7}>
          <Text style={s.logoText}>FahrProfi</Text>
        </TouchableOpacity>
        <View style={s.divider} />
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[s.tab, isActive && s.tabActive]}
              onPress={() => setTab(t.id)}
              activeOpacity={0.7}
            >
              <Text style={[s.tabIcon, { opacity: isActive ? 1 : 0.4 }]}>{t.icon}</Text>
              <Text style={[s.tabLabel, { color: isActive ? colors.primary : colors.textMuted }]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ModalNav({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const TITLES: Partial<Record<ModalId, string>> = {
    MultipleChoice: 'Multiple Choice',
    Flashcard: 'Karteikarten',
    Swipe: 'Swipe & Learn',
    SpeedRound: '⚡ Speed Round',
    MemoryMatch: '🃏 Memory Match',
    ExamSession: 'Prüfungssimulation',
    Topic: 'Thema',
    Pruefungsampel: '🚦 Prüfungsampel',
    Fragenliste: '📋 Fragenliste',
  };
  return (
    <View style={{
      backgroundColor: colors.surface, borderBottomWidth: 1,
      borderBottomColor: colors.border, paddingTop: insets.top,
      shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 4, elevation: 3, zIndex: 100,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 }}>
        <TouchableOpacity
          onPress={onClose}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20, color: colors.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 }}>
          {TITLES[modal.id] || modal.id}
        </Text>
        {/* Always-visible home button */}
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}
          style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primaryLight, borderRadius: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>⌂ Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AppContent() {
  const { colors } = useTheme();
  const [tab, setTab] = useState<TabId>('home');
  const [modalStack, setModalStack] = useState<ModalState[]>([]);

  const currentModal = modalStack[modalStack.length - 1];

  const navigate = (id: ModalId, params?: any) => {
    setModalStack((s) => [...s, { id, params }]);
  };

  const goBack = () => {
    setModalStack((s) => s.slice(0, -1));
  };

  const goHome = () => {
    setModalStack([]);
    setTab('home');
  };

  // Navigation object for screens
  const navigation = {
    navigate: (screen: string, params?: any) => navigate(screen as ModalId, params),
    goBack,
  };

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
    const nav = {
      navigate: (screen: string, params?: any) => navigate(screen as ModalId, params),
      goBack,
    };
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

      {/* Top navigation — always visible */}
      {currentModal ? (
        <ModalNav modal={currentModal} onClose={goBack} />
      ) : (
        <TopNav tab={tab} setTab={setTab} />
      )}

      {/* Screen content */}
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
