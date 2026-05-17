import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { SAMPLE_QUESTIONS, TOPICS } from '../../data/questions';
import { useLanguage } from '../../contexts/LanguageContext';
import { getSuccessRate } from '../../utils/spaced-repetition';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { colors } = useTheme();
  const { progress, getStats } = useProgress();
  const { t } = useLanguage();
  const stats = getStats();
  const total = SAMPLE_QUESTIONS.length;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20 },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 20 },
    statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    statCard: {
      width: (width - 52) / 2,
      backgroundColor: colors.card, borderRadius: 16,
      borderWidth: 1, borderColor: colors.border,
      padding: 16, alignItems: 'center',
    },
    statValue: { fontSize: 32, fontWeight: '900', color: colors.primary },
    statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
    topicBar: { marginBottom: 14 },
    topicLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    topicName: { fontSize: 14, color: colors.text, fontWeight: '600' },
    topicPct: { fontSize: 14, color: colors.primary, fontWeight: '700' },
    barBg: { height: 8, backgroundColor: colors.border, borderRadius: 4 },
    barFill: { height: 8, borderRadius: 4 },
    emptyState: {
      alignItems: 'center', padding: 40,
      backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  });

  const progressPct = total > 0 ? Math.round((stats.learned / total) * 100) : 0;
  const successRate = stats.correct + stats.wrong > 0
    ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
    : 0;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={s.scroll}>
        <Text style={s.title}>📊 Statistik</Text>

        <View style={s.statGrid}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{progressPct}%</Text>
            <Text style={s.statLabel}>Fortschritt</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: colors.success }]}>{successRate}%</Text>
            <Text style={s.statLabel}>Erfolgsrate</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statValue}>{stats.correct}</Text>
            <Text style={s.statLabel}>Richtige Antworten</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: colors.danger }]}>{stats.wrong}</Text>
            <Text style={s.statLabel}>Falsche Antworten</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Themenfortschritt</Text>
        {stats.total === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>📭</Text>
            <Text style={s.emptyText}>Noch keine Fragen beantwortet.{'\n'}Starte mit Karteikarten oder Swipe!</Text>
          </View>
        ) : (
          TOPICS.map((topic) => {
            const topicQs = SAMPLE_QUESTIONS.filter((q) => q.topic === topic.id);
            const answered = topicQs.filter((q) => progress[q.id]).length;
            const pct = topicQs.length > 0 ? Math.round((answered / topicQs.length) * 100) : 0;
            return (
              <View key={topic.id} style={s.topicBar}>
                <View style={s.topicLabel}>
                  <Text style={s.topicName}>{topic.icon} {t(topic.label)}</Text>
                  <Text style={s.topicPct}>{pct}%</Text>
                </View>
                <View style={s.barBg}>
                  <View style={[s.barFill, { width: `${pct}%`, backgroundColor: topic.color }]} />
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
