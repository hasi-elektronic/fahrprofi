import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useXP, XP_REWARDS } from '../../hooks/useXP';
import { useQuestions } from '../../hooks/useQuestions';

const { width } = Dimensions.get('window');
const DURATION = 60;

export default function SpeedRoundScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { addXP } = useXP();
  const { questions } = useQuestions({ limit: 50, random: true });

  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  const q = questions[idx % Math.max(questions.length, 1)];

  useEffect(() => {
    if (!started || done) return;
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, done]);

  const doFlash = (type: 'correct' | 'wrong') => {
    setFlash(type);
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setFlash(null));
  };

  const answer = (i: number) => {
    if (done || !started) return;
    const correct = q.answers[i].correct;
    doFlash(correct ? 'correct' : 'wrong');
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
    setIdx((x) => x + 1);
  };

  const handleDone = async () => {
    const xpEarned = score * XP_REWARDS.speed_round;
    await addXP(xpEarned, 'speed_round');
    navigation.goBack();
  };

  const timeColor = time > 30 ? colors.success : time > 10 ? colors.primary : colors.danger;
  const timePct = (time / DURATION) * 100;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center' },
    closeBtn: { fontSize: 22, color: colors.primary },
    content: { flex: 1, padding: 20 },
    timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    timerText: { fontSize: 42, fontWeight: '900', fontVariant: ['tabular-nums'] },
    timerBar: { width: 4, height: 48, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' },
    timerFill: { width: '100%', borderRadius: 2 },
    scoreBox: { alignItems: 'center' },
    scoreNum: { fontSize: 36, fontWeight: '900', color: colors.primary },
    scoreLabel: { fontSize: 12, color: colors.textSecondary },
    qCard: { backgroundColor: colors.card, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    qMeta: { fontSize: 11, color: colors.textSecondary, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 },
    qText: { fontSize: 16, fontWeight: '700', color: colors.text, lineHeight: 23 },
    ansBtn: { borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, padding: 14, marginBottom: 10 },
    ansBtnText: { fontSize: 14, color: colors.text, fontWeight: '500' },
    startScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    startIcon: { fontSize: 72, marginBottom: 20 },
    startTitle: { fontSize: 26, fontWeight: '900', color: colors.text, marginBottom: 8, textAlign: 'center' },
    startDesc: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    startBtn: { backgroundColor: colors.primary, borderRadius: 18, padding: 18, width: '100%', alignItems: 'center' },
    resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  });

  const flashBg = flash === 'correct' ? colors.success + '22' : flash === 'wrong' ? colors.danger + '22' : 'transparent';

  if (!started) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
        </View>
        <View style={s.startScreen}>
          <Text style={s.startIcon}>⚡</Text>
          <Text style={s.startTitle}>Speed Round</Text>
          <Text style={s.startDesc}>60 Sekunden · So viele Fragen wie möglich beantworten.{'\n'}Pro Richtige: {XP_REWARDS.speed_round} XP ⚡</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
            {[['⏱️', '60 Sek'], ['⚡', '5 XP/Frage'], ['🎯', 'Schnell!']].map(([icon, label]) => (
              <View key={label} style={{ flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 24 }}>{icon}</Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4, fontWeight: '600', textAlign: 'center' }}>{label}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={s.startBtn} onPress={() => setStarted(true)}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#000' }}>START! ⚡</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (done) {
    const xpEarned = score * XP_REWARDS.speed_round;
    const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
    return (
      <SafeAreaView style={s.container}>
        <View style={s.resultContainer}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>⚡</Text>
          <Text style={{ fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 6 }}>Zeit ist um!</Text>
          <Text style={{ fontSize: 52, fontWeight: '900', color: colors.primary, marginBottom: 4 }}>{score}</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>von {answered} Fragen · {accuracy}% Trefferquote</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.primary, marginBottom: 32 }}>+{xpEarned} XP ⚡</Text>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, width: '100%', alignItems: 'center', marginBottom: 12 }} onPress={handleDone}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Fertig ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.border }} onPress={() => { setScore(0); setAnswered(0); setIdx(0); setTime(DURATION); setDone(false); }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Nochmal ↺</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: flashBg || colors.background }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text }}>⚡ Speed Round</Text>
      </View>

      <View style={s.content}>
        <View style={s.timerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[s.timerText, { color: timeColor }]}>{time}s</Text>
            <View style={s.timerBar}>
              <View style={[s.timerFill, { height: `${timePct}%`, backgroundColor: timeColor, position: 'absolute', bottom: 0 }]} />
            </View>
          </View>
          <View style={s.scoreBox}>
            <Text style={s.scoreNum}>{score}</Text>
            <Text style={s.scoreLabel}>Richtig</Text>
          </View>
        </View>

        {q && (
          <>
            <View style={s.qCard}>
              <Text style={s.qMeta}>{q.topic.toUpperCase()} · {q.points} Punkte</Text>
              <Text style={s.qText}>{t(q.question)}</Text>
            </View>
            {q.answers.map((ans, i) => (
              <TouchableOpacity key={i} style={s.ansBtn} onPress={() => answer(i)} activeOpacity={0.7}>
                <Text style={s.ansBtnText}>{t(ans.text)}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
