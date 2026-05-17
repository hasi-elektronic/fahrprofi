import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import { useXP, XP_REWARDS } from '../../hooks/useXP';
import { useQuestions } from '../../hooks/useQuestions';
import { useAmpel } from '../../hooks/useAmpel';
import VisualQuestionCard from '../../components/ui/VisualQuestionCard';

export default function MultipleChoiceScreen({ route, navigation }: any) {
  const topicFilter = route?.params?.topic;
  const preloaded = route?.params?.preloadedQuestions;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { recordAnswer } = useProgress();
  const { addXP } = useXP();
  const { recordAnswer: recordAmpel, toggleBookmark, getAmpel, isBookmarked } = useAmpel();
  const { questions: apiQs, loading } = useQuestions({ topic: topicFilter, limit: 20, random: true, autoLoad: !preloaded });
  const questions = preloaded || apiQs;

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0, xp: 0 });
  const [done, setDone] = useState(false);
  const [showXPFlash, setShowXPFlash] = useState(false);
  const [xpGain, setXpGain] = useState(0);

  const q = questions[idx];

  // Skip questions with no answers
  React.useEffect(() => {
    if (q && q.answers.length === 0 && !done) {
      setTimeout(() => {
        if (idx + 1 < questions.length) setIdx(i => i + 1);
        else setDone(true);
      }, 100);
    }
  }, [idx, q]);

  const handleAnswer = async (correct: boolean) => {
    if (!q) return;
    const gained = correct ? (q.points >= 4 ? XP_REWARDS.correct_hard : XP_REWARDS.correct_easy) : 0;
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      xp: s.xp + gained,
    }));
    await Promise.all([
      recordAnswer(q.id, correct ? 4 : 1),
      recordAmpel(q.id, correct),
      correct ? addXP(gained) : Promise.resolve(),
    ]);
    if (correct && gained > 0) { setXpGain(gained); setShowXPFlash(true); setTimeout(() => setShowXPFlash(false), 1200); }
    setTimeout(() => {
      if (idx + 1 < questions.length) setIdx((i) => i + 1);
      else setDone(true);
    }, 800);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    closeBtn: { fontSize: 22, color: colors.primary, marginRight: 12 },
    progressBar: { height: 4, flex: 1, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
    xpFlash: {
      position: 'absolute', top: '40%', alignSelf: 'center', zIndex: 999,
      backgroundColor: colors.primary, borderRadius: 30,
      paddingHorizontal: 20, paddingVertical: 10,
    },
    result: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    resultStats: { flexDirection: 'row', gap: 16, marginBottom: 32 },
    statBox: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, minWidth: 80 },
  });

  if (loading) return (
    <SafeAreaView style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.textSecondary, marginTop: 12 }}>Lädt Fragen...</Text>
    </SafeAreaView>
  );

  if (done) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <SafeAreaView style={s.container}>
        <View style={s.result}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>{pct >= 70 ? '🎉' : pct >= 50 ? '🤔' : '💪'}</Text>
          <Text style={{ fontSize: 26, fontWeight: '900', color: colors.text, marginBottom: 20 }}>
            {pct >= 70 ? 'Sehr gut!' : pct >= 50 ? 'Gut!' : 'Weiter üben!'}
          </Text>
          <View style={s.resultStats}>
            {[{ val: score.correct, label: 'Richtig', col: colors.success },
              { val: score.wrong, label: 'Falsch', col: colors.danger },
              { val: score.xp, label: 'XP ⚡', col: colors.primary }].map((item) => (
              <View key={item.label} style={s.statBox}>
                <Text style={{ fontSize: 26, fontWeight: '900', color: item.col }}>{item.val}</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{item.label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 15, width: '100%', alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!q) return null;

  const qWithMeta = {
    ...q,
    ampel: getAmpel(q.id) as 0 | 1 | 2,
  };

  return (
    <SafeAreaView style={s.container}>
      {showXPFlash && (
        <View style={s.xpFlash} pointerEvents="none">
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#000' }}>+{xpGain} XP ⚡</Text>
        </View>
      )}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` }]} />
        </View>
        <Text style={{ fontSize: 12, color: colors.textSecondary, marginLeft: 10 }}>{idx + 1}/{questions.length}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VisualQuestionCard
          key={q.id}
          question={qWithMeta}
          onAnswer={handleAnswer}
          onBookmark={toggleBookmark}
          bookmarked={isBookmarked(q.id)}
          showIndex={`${idx + 1} / ${questions.length}`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
