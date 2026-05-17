import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import { SAMPLE_QUESTIONS, TOPICS } from '../../data/questions';

const { width } = Dimensions.get('window');

const UI_STRINGS = {
  greeting: { de: 'Guten Morgen!', tr: 'Günaydın!', en: 'Good morning!', ar: 'صباح الخير!', ru: 'Доброе утро!' },
  subtitle: { de: 'Weiter lernen für die Theorieprüfung', tr: 'Teori sınavına hazırlanmaya devam et', en: 'Continue studying for the theory test', ar: 'واصل الدراسة لاختبار النظرية', ru: 'Продолжайте готовиться к теоретическому экзамену' },
  quickMode: { de: 'Schnell-Modus', tr: 'Hızlı Mod', en: 'Quick Mode', ar: 'الوضع السريع', ru: 'Быстрый режим' },
  swipeLearn: { de: 'Swipe & Learn', tr: 'Kaydır & Öğren', en: 'Swipe & Learn', ar: 'تمرير وتعلم', ru: 'Свайп и учёба' },
  examSim: { de: 'Prüfungssimulation', tr: 'Sınav Simülasyonu', en: 'Exam Simulation', ar: 'محاكاة الاختبار', ru: 'Симуляция экзамена' },
  topicLearn: { de: 'Themenlernen', tr: 'Konu Bazlı', en: 'Topic Learning', ar: 'التعلم الموضوعي', ru: 'По темам' },
  progress: { de: 'Dein Fortschritt', tr: 'Senin İlerlemen', en: 'Your Progress', ar: 'تقدمك', ru: 'Ваш прогресс' },
  learned: { de: 'Gelernt', tr: 'Öğrenildi', en: 'Learned', ar: 'تعلمت', ru: 'Выучено' },
  correct: { de: 'Richtig', tr: 'Doğru', en: 'Correct', ar: 'صحيح', ru: 'Верно' },
  wrong: { de: 'Falsch', tr: 'Yanlış', en: 'Wrong', ar: 'خطأ', ru: 'Неверно' },
  topics: { de: 'Themen', tr: 'Konular', en: 'Topics', ar: 'المواضيع', ru: 'Темы' },
};

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getStats } = useProgress();
  const stats = getStats();
  const totalQuestions = SAMPLE_QUESTIONS.length;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20 },
    header: { marginBottom: 24 },
    greeting: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
    quickCard: {
      width: (width - 52) / 2,
      padding: 18,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickCardPrimary: { backgroundColor: colors.primary },
    quickIcon: { fontSize: 28, marginBottom: 10 },
    quickTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
    quickTitlePrimary: { color: '#000' },
    quickDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 3 },
    quickDescPrimary: { color: 'rgba(0,0,0,0.6)' },
    progressCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      marginBottom: 28,
    },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
    statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, marginTop: 14 },
    progressBarFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
    topicsGrid: { gap: 10, marginBottom: 40 },
    topicRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    topicIcon: { fontSize: 20, marginRight: 12 },
    topicName: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1 },
    topicArrow: { fontSize: 14, color: colors.textMuted },
  });

  const progressPct = totalQuestions > 0 ? (stats.learned / totalQuestions) : 0;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.greeting}>{t(UI_STRINGS.greeting)} 👋</Text>
          <Text style={s.subtitle}>{t(UI_STRINGS.subtitle)}</Text>
        </View>

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>{t(UI_STRINGS.quickMode)}</Text>
        <View style={s.quickGrid}>
          <TouchableOpacity
            style={[s.quickCard, s.quickCardPrimary]}
            onPress={() => navigation.navigate('Flashcard', { questions: SAMPLE_QUESTIONS })}
            activeOpacity={0.85}
          >
            <Text style={s.quickIcon}>🃏</Text>
            <Text style={[s.quickTitle, s.quickTitlePrimary]}>Karteikarten</Text>
            <Text style={[s.quickDesc, s.quickDescPrimary]}>Spaced Repetition</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.quickCard}
            onPress={() => navigation.navigate('Swipe', { questions: SAMPLE_QUESTIONS })}
            activeOpacity={0.85}
          >
            <Text style={s.quickIcon}>👆</Text>
            <Text style={s.quickTitle}>{t(UI_STRINGS.swipeLearn)}</Text>
            <Text style={s.quickDesc}>Wisch links / rechts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.quickCard}
            onPress={() => navigation.navigate('ExamSession')}
            activeOpacity={0.85}
          >
            <Text style={s.quickIcon}>📝</Text>
            <Text style={s.quickTitle}>{t(UI_STRINGS.examSim)}</Text>
            <Text style={s.quickDesc}>30 Fragen · TÜV-Format</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.quickCard}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.85}
          >
            <Text style={s.quickIcon}>📚</Text>
            <Text style={s.quickTitle}>{t(UI_STRINGS.topicLearn)}</Text>
            <Text style={s.quickDesc}>Konu konu çalış</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <Text style={s.sectionTitle}>{t(UI_STRINGS.progress)}</Text>
        <View style={s.progressCard}>
          <View style={s.statRow}>
            <View style={s.statItem}>
              <Text style={s.statValue}>{stats.learned}</Text>
              <Text style={s.statLabel}>{t(UI_STRINGS.learned)}</Text>
            </View>
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: colors.success }]}>{stats.correct}</Text>
              <Text style={s.statLabel}>{t(UI_STRINGS.correct)}</Text>
            </View>
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: colors.danger }]}>{stats.wrong}</Text>
              <Text style={s.statLabel}>{t(UI_STRINGS.wrong)}</Text>
            </View>
            <View style={s.statItem}>
              <Text style={s.statValue}>{totalQuestions}</Text>
              <Text style={s.statLabel}>Total</Text>
            </View>
          </View>
          <View style={s.progressBarBg}>
            <View style={[s.progressBarFill, { width: `${progressPct * 100}%` }]} />
          </View>
        </View>

        {/* Topics */}
        <Text style={s.sectionTitle}>{t(UI_STRINGS.topics)}</Text>
        <View style={s.topicsGrid}>
          {TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={s.topicRow}
              onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
              activeOpacity={0.8}
            >
              <Text style={s.topicIcon}>{topic.icon}</Text>
              <Text style={s.topicName}>{t(topic.label)}</Text>
              <Text style={s.topicArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
