import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { TOPICS, SAMPLE_QUESTIONS } from '../../data/questions';
import { useLanguage } from '../../contexts/LanguageContext';
import { useXP, LEVEL_NAMES } from '../../hooks/useXP';
import { useProgress } from '../../hooks/useProgress';

const { width } = Dimensions.get('window');

function XPBar({ xp, maxXP, level, colors }: any) {
  const pct = Math.min((xp / maxXP) * 100, 100);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '900', color: '#000' }}>{level}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{LEVEL_NAMES[level]?.icon} {LEVEL_NAMES[level]?.de}</Text>
          <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '700' }}>{xp} XP</Text>
        </View>
        <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 3 }} />
        </View>
      </View>
    </View>
  );
}

function ModeCard({ icon, title, desc, color, badge, locked, onPress }: any) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.card, borderRadius: 16,
        borderWidth: 1, borderColor: colors.border,
        padding: 18, marginBottom: 10,
        flexDirection: 'row', alignItems: 'center',
        opacity: locked ? 0.5 : 1,
      }}
      onPress={locked ? undefined : onPress}
      activeOpacity={0.8}
    >
      <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: color + '22', borderWidth: 1, borderColor: color + '44', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{title}</Text>
          {badge && <View style={{ backgroundColor: color, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 }}>
            <Text style={{ fontSize: 9, fontWeight: '900', color: '#000' }}>{badge}</Text>
          </View>}
          {locked && <Text style={{ fontSize: 11, color: colors.textMuted }}>🔒 PRO</Text>}
        </View>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{desc}</Text>
      </View>
      {!locked && <Text style={{ fontSize: 18, color: colors.textMuted }}>›</Text>}
    </TouchableOpacity>
  );
}

export default function LearnScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { xp } = useXP();
  const { getStats } = useProgress();
  const stats = getStats();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    header: { padding: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    title: { fontSize: 22, fontWeight: '900', color: colors.text },
    streakBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: xp.streak > 0 ? colors.primary + '22' : colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
    dailyBanner: {
      margin: 20, marginBottom: 12, borderRadius: 18, padding: 20,
      backgroundColor: '#0d2a1a', borderWidth: 1, borderColor: colors.success + '44',
      overflow: 'hidden',
    },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10, paddingHorizontal: 20 },
    topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 },
    topicCard: {
      width: (width - 50) / 2, backgroundColor: colors.card, borderRadius: 14,
      borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10,
    },
    topicIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    topicName: { fontSize: 13, fontWeight: '600', color: colors.text, flex: 1 },
    statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 20 },
    statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, alignItems: 'center' },
  });

  const TOPIC_INFO = [
    { id: 'gefahrenlehre', icon: '⚠️', color: '#ef4444' },
    { id: 'verhalten', icon: '🚦', color: '#10b981' },
    { id: 'vorfahrt', icon: '➡️', color: '#f59e0b' },
    { id: 'verkehrszeichen', icon: '🚧', color: '#3b82f6' },
    { id: 'umwelt', icon: '🌱', color: '#10b981' },
    { id: 'technik', icon: '🔧', color: '#6b7280' },
    { id: 'eignung', icon: '👤', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.title}>📚 Lernen</Text>
          <View style={s.streakBadge}>
            <Text style={{ fontSize: 14 }}>{xp.streak > 0 ? '🔥' : '💤'}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: xp.streak > 0 ? colors.primary : colors.textMuted }}>{xp.streak} Tage</Text>
          </View>
        </View>
        <XPBar xp={xp.xpInLevel} maxXP={xp.xpForNextLevel} level={xp.level} colors={colors} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Daily Challenge Banner */}
        <TouchableOpacity style={s.dailyBanner} onPress={() => navigation.navigate('MultipleChoice', {})} activeOpacity={0.85}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Text style={{ fontSize: 16 }}>🌟</Text>
            <Text style={{ fontSize: 11, fontWeight: '900', color: colors.success, letterSpacing: 1 }}>TAGES-CHALLENGE</Text>
            <View style={{ backgroundColor: colors.success, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 2 }}>
              <Text style={{ fontSize: 9, fontWeight: '900', color: '#000' }}>NEU</Text>
            </View>
          </View>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 4 }}>10 Fragen · Bonus XP</Text>
          <Text style={{ fontSize: 12, color: '#86efac' }}>Jeden Tag neue Fragen · Streaks halten ✓</Text>
        </TouchableOpacity>

        {/* Stats mini */}
        <View style={s.statsRow}>
          {[['🎯', stats.correct, 'Richtig'], ['❌', stats.wrong, 'Falsch'], ['📚', stats.learned, 'Gelernt']].map(([icon, val, label]) => (
            <View key={String(label)} style={s.statCard}>
              <Text style={{ fontSize: 20 }}>{icon}</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: colors.primary, marginTop: 2 }}>{val}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Modes */}
        <Text style={s.sectionTitle}>Lernmodi</Text>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <ModeCard icon="🎯" title="Multiple Choice" desc="Ankreuzen · Erklärungen · XP verdienen" color={colors.primary} badge="BELIEBT" onPress={() => navigation.navigate('MultipleChoice', {})} />
          <ModeCard icon="⚡" title="Speed Round" desc="60 Sekunden · so viele wie möglich" color="#f59e0b" badge="NEU" onPress={() => navigation.navigate('SpeedRound')} />
          <ModeCard icon="🃏" title="Memory Match" desc="Frage ↔ Antwort paaren" color="#a855f7" onPress={() => navigation.navigate('MemoryMatch')} />
          <ModeCard icon="🔄" title="Karteikarten" desc="Spaced Repetition · SM-2" color="#06b6d4" onPress={() => navigation.navigate('Flashcard', { questions: SAMPLE_QUESTIONS })} />
          <ModeCard icon="👆" title="Swipe & Learn" desc="Links = Falsch · Rechts = Richtig" color="#10b981" onPress={() => navigation.navigate('Swipe', { questions: SAMPLE_QUESTIONS })} />
          <ModeCard icon="🏆" title="Battle Mode" desc="Gegen andere testen" color="#8b5cf6" locked />
        </View>

        {/* Topics */}
        <Text style={s.sectionTitle}>Nach Thema lernen</Text>
        <View style={s.topicGrid}>
          {TOPIC_INFO.map((tp) => {
            const count = SAMPLE_QUESTIONS.filter((q) => q.topic === tp.id).length;
            return (
              <TouchableOpacity key={tp.id} style={s.topicCard} onPress={() => navigation.navigate('MultipleChoice', { topic: tp.id })} activeOpacity={0.8}>
                <View style={[s.topicIcon, { backgroundColor: tp.color + '22' }]}>
                  <Text style={{ fontSize: 18 }}>{tp.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.topicName} numberOfLines={2}>{tp.id}</Text>
                  <Text style={{ fontSize: 10, color: colors.textMuted }}>2413 Fragen</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
