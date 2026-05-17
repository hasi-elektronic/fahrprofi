import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import { useXP, XP_REWARDS } from '../../hooks/useXP';
import { useQuestions } from '../../hooks/useQuestions';
import type { ParsedQuestion } from '../../utils/api';

const { width } = Dimensions.get('window');

function XPPopup({ amount, visible }: { amount: number; visible: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  React.useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.sequence([
        Animated.spring(anim, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.delay(600),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, amount]);

  if (!visible) return null;
  return (
    <Animated.View style={{
      position: 'absolute', top: '40%', alignSelf: 'center', zIndex: 999,
      opacity: anim, transform: [{ scale: anim }, { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, -30] }) }],
    }}>
      <View style={{ backgroundColor: colors.primary, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 10, shadowColor: colors.primary, shadowOpacity: 0.6, shadowRadius: 12, elevation: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#000' }}>+{amount} XP ⚡</Text>
      </View>
    </Animated.View>
  );
}

export default function MultipleChoiceScreen({ route, navigation }: any) {
  const topicFilter = route?.params?.topic;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { recordAnswer } = useProgress();
  const { addXP } = useXP();
  const { questions, loading } = useQuestions({ topic: topicFilter, limit: 20, random: true, autoLoad: true });

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0, xp: 0 });
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [done, setDone] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(1)).current;

  const q = questions[idx];
  const isMulti = q ? q.answers.filter((a) => a.correct).length > 1 : false;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const toggle = (i: number) => {
    if (confirmed) return;
    if (isMulti) {
      setSelected((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]);
    } else {
      setSelected([i]);
    }
  };

  const confirm = async () => {
    if (selected.length === 0 || confirmed || !q) return;
    setConfirmed(true);
    const correctIdx = q.answers.map((a, i) => a.correct ? i : -1).filter((i) => i >= 0);
    const isCorrect = correctIdx.length === selected.length && correctIdx.every((i) => selected.includes(i));
    const xpGain = isCorrect ? (q.points >= 4 ? XP_REWARDS.correct_hard : XP_REWARDS.correct_easy) : 0;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);

    if (isCorrect) {
      const bonus = newStreak >= 5 ? XP_REWARDS.streak_5 : 0;
      setXpAmount(xpGain + bonus);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
      setScore((s) => ({ ...s, correct: s.correct + 1, xp: s.xp + xpGain + bonus }));
      await addXP(xpGain + bonus, 'multiple_choice');
    } else {
      shake();
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
    await recordAnswer(q.id, isCorrect ? 4 : 1);
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1);
      setSelected([]);
      setConfirmed(false);
    } else {
      setDone(true);
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    closeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    closeBtn: { fontSize: 22, color: colors.primary, marginRight: 12 },
    streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto', backgroundColor: streak >= 2 ? colors.primary + '22' : 'transparent', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: streak >= 2 ? colors.primary + '44' : 'transparent' },
    streakText: { fontSize: 14, fontWeight: '700', color: colors.primary },
    progressBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
    scroll: { padding: 20, flex: 1 },
    topicBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 14 },
    topicText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.5 },
    pointsBadge: { fontSize: 12, fontWeight: '800', color: colors.primary },
    multiHint: { fontSize: 12, color: colors.textSecondary, marginBottom: 10, fontStyle: 'italic' },
    question: { fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 26, marginBottom: 20 },
    answerBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 2, padding: 14, marginBottom: 10 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, marginRight: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    answerText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
    explanation: { marginTop: 10, padding: 14, backgroundColor: colors.border + '66', borderRadius: 12, borderLeftWidth: 3, borderLeftColor: colors.primary },
    explanationText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
    confirmBtn: { borderRadius: 14, padding: 15, alignItems: 'center' },
    resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    resultIcon: { fontSize: 72, marginBottom: 16 },
    resultTitle: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 16 },
    resultGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
    resultStat: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, width: 90 },
    resultValue: { fontSize: 28, fontWeight: '900' },
    resultLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  });

  if (done) {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    return (
      <SafeAreaView style={s.container}>
        <View style={s.resultContainer}>
          <Text style={s.resultIcon}>{pct >= 70 ? '🎉' : pct >= 50 ? '🤔' : '😔'}</Text>
          <Text style={s.resultTitle}>{pct >= 70 ? 'Sehr gut!' : pct >= 50 ? 'Gut!' : 'Weiter üben!'}</Text>
          <View style={s.resultGrid}>
            <View style={s.resultStat}>
              <Text style={[s.resultValue, { color: colors.success }]}>{score.correct}</Text>
              <Text style={s.resultLabel}>Richtig</Text>
            </View>
            <View style={s.resultStat}>
              <Text style={[s.resultValue, { color: colors.danger }]}>{score.wrong}</Text>
              <Text style={s.resultLabel}>Falsch</Text>
            </View>
            <View style={s.resultStat}>
              <Text style={[s.resultValue, { color: colors.primary }]}>{score.xp}</Text>
              <Text style={s.resultLabel}>XP</Text>
            </View>
          </View>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, width: '100%', alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!q) return null;

  return (
    <SafeAreaView style={s.container}>
      <XPPopup amount={xpAmount} visible={showXP} />

      <View style={s.header}>
        <View style={s.closeRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={s.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>
            {idx + 1} / {questions.length}
          </Text>
          {streak >= 2 && (
            <View style={s.streakBadge}>
              <Text>🔥</Text>
              <Text style={s.streakText}>{streak}</Text>
            </View>
          )}
        </View>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` }]} />
        </View>
      </View>

      <Animated.ScrollView style={[s.scroll, { transform: [{ translateX: shakeAnim }] }]}>
        <View style={s.topicBadge}>
          <Text style={s.topicText}>{q.topic.toUpperCase()}</Text>
          <Text style={s.pointsBadge}>{q.points} Pkt</Text>
        </View>
        {isMulti && <Text style={s.multiHint}>⚠️ Mehrere Antworten möglich</Text>}
        <Text style={s.question}>{t(q.question)}</Text>

        {q.answers.map((ans, i) => {
          const isSel = selected.includes(i);
          let borderColor = colors.border;
          let bgColor = 'transparent';
          let checkBg = 'transparent';
          let checkBorder = colors.border;

          if (confirmed) {
            if (ans.correct) { borderColor = colors.success; bgColor = colors.success + '18'; checkBg = colors.success; checkBorder = colors.success; }
            else if (isSel) { borderColor = colors.danger; bgColor = colors.danger + '18'; checkBg = colors.danger; checkBorder = colors.danger; }
          } else if (isSel) {
            borderColor = colors.primary; bgColor = colors.primary + '18'; checkBg = colors.primary; checkBorder = colors.primary;
          }

          return (
            <TouchableOpacity key={i} style={[s.answerBtn, { borderColor, backgroundColor: bgColor }]} onPress={() => toggle(i)} activeOpacity={0.8}>
              <View style={[s.checkbox, { borderColor: checkBorder, backgroundColor: checkBg }]}>
                {(isSel || (confirmed && ans.correct)) && (
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#000' }}>
                    {confirmed ? (ans.correct ? '✓' : isSel ? '✗' : '') : '✓'}
                  </Text>
                )}
              </View>
              <Text style={s.answerText}>{t(ans.text)}</Text>
            </TouchableOpacity>
          );
        })}

        {confirmed && q.explanation && (
          <View style={s.explanation}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 }}>💡 Erklärung</Text>
            <Text style={s.explanationText}>{t(q.explanation)}</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </Animated.ScrollView>

      <View style={s.footer}>
        {!confirmed ? (
          <TouchableOpacity style={[s.confirmBtn, { backgroundColor: selected.length > 0 ? colors.primary : colors.border }]} onPress={confirm} disabled={selected.length === 0}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: selected.length > 0 ? '#000' : colors.textMuted }}>Bestätigen ✓</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[s.confirmBtn, { backgroundColor: colors.primary }]} onPress={next}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#000' }}>
              {idx + 1 < questions.length ? 'Weiter →' : 'Auswertung 🏆'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
