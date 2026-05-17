import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TOPICS, SAMPLE_QUESTIONS, type QuestionTopic } from '../../data/questions';

export default function TopicScreen({ route, navigation }: any) {
  const { topicId }: { topicId: QuestionTopic } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();

  const topic = TOPICS.find((tp) => tp.id === topicId)!;
  const questions = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border,
      flexDirection: 'row', alignItems: 'center',
    },
    backBtn: { fontSize: 22, color: colors.primary, marginRight: 12 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
    scroll: { padding: 20 },
    modeCard: {
      backgroundColor: colors.card, borderRadius: 16,
      borderWidth: 1, borderColor: colors.border,
      padding: 18, marginBottom: 12,
      flexDirection: 'row', alignItems: 'center',
    },
    modeIcon: { fontSize: 28, marginRight: 14 },
    modeTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    modeDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    qCard: {
      backgroundColor: colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: colors.border,
      padding: 14, marginBottom: 10,
    },
    qText: { fontSize: 14, color: colors.text, lineHeight: 20 },
    qMeta: { flexDirection: 'row', gap: 8, marginTop: 8 },
    qBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    qBadgeText: { fontSize: 11, fontWeight: '700' },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{topic.icon} {t(topic.label)}</Text>
      </View>
      <ScrollView style={s.scroll}>
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            style={[s.modeCard, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Flashcard', { questions })}
          >
            <Text style={s.modeIcon}>🃏</Text>
            <View>
              <Text style={s.modeTitle}>Karteikarten</Text>
              <Text style={s.modeDesc}>{questions.length} Fragen · Spaced Repetition</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.modeCard}
            onPress={() => navigation.navigate('Swipe', { questions })}
          >
            <Text style={s.modeIcon}>👆</Text>
            <View>
              <Text style={s.modeTitle}>Swipe & Learn</Text>
              <Text style={s.modeDesc}>Schnell durchblättern</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
          Alle Fragen ({questions.length})
        </Text>
        {questions.map((q) => (
          <View key={q.id} style={s.qCard}>
            <Text style={s.qText}>{t(q.question)}</Text>
            <View style={s.qMeta}>
              <View style={[s.qBadge, { backgroundColor: colors.primary + '22' }]}>
                <Text style={[s.qBadgeText, { color: colors.primary }]}>{q.points} Pkt</Text>
              </View>
              <View style={[s.qBadge, { backgroundColor: colors.border }]}>
                <Text style={[s.qBadgeText, { color: colors.textSecondary }]}>{q.id}</Text>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
