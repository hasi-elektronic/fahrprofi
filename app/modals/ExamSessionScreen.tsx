import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SAMPLE_QUESTIONS } from '../../data/questions';
import { selectExamQuestions, calculateExamScore } from '../../utils/spaced-repetition';

const { width } = Dimensions.get('window');

export default function ExamSessionScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const questions = useMemo(() => selectExamQuestions(SAMPLE_QUESTIONS, Math.min(30, SAMPLE_QUESTIONS.length)), []);
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number[] }>({});
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  const question = questions[current];
  const chosen = selectedAnswers[current] || [];

  const toggleAnswer = (ansIdx: number) => {
    if (finished) return;
    const prev = selectedAnswers[current] || [];
    const updated = prev.includes(ansIdx)
      ? prev.filter((i) => i !== ansIdx)
      : [...prev, ansIdx];
    setSelectedAnswers({ ...selectedAnswers, [current]: updated });
  };

  const finish = () => {
    const answers = questions.map((q, qi) => {
      const selected = selectedAnswers[qi] || [];
      const correctIndices = q.answers.map((a, i) => a.correct ? i : -1).filter(i => i >= 0);
      const isCorrect = correctIndices.length === selected.length &&
        correctIndices.every(i => selected.includes(i));
      return { questionId: q.id, correct: isCorrect, points: q.points };
    });
    const score = calculateExamScore(answers);
    setResults({ ...score, answers });
    setFinished(true);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
      flexDirection: 'row', alignItems: 'center',
    },
    closeBtn: { fontSize: 22, color: colors.primary, marginRight: 12 },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    progressText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    progressBar: { height: 3, backgroundColor: colors.border, marginTop: 8 },
    progressFill: { height: 3, backgroundColor: colors.primary },
    scroll: { padding: 20 },
    questionNum: { fontSize: 12, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 8 },
    questionText: { fontSize: 19, fontWeight: '700', color: colors.text, lineHeight: 27, marginBottom: 6 },
    pointsBadge: {
      alignSelf: 'flex-start', backgroundColor: colors.primary,
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 20,
    },
    answerBtn: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.card, borderRadius: 12,
      borderWidth: 2, borderColor: colors.border,
      padding: 14, marginBottom: 10,
    },
    answerSelected: { borderColor: colors.primary, backgroundColor: 'rgba(244,167,0,0.08)' },
    answerCorrect: { borderColor: colors.success, backgroundColor: 'rgba(63,185,80,0.1)' },
    answerWrong: { borderColor: colors.danger, backgroundColor: 'rgba(248,81,73,0.1)' },
    checkbox: {
      width: 22, height: 22, borderRadius: 4,
      borderWidth: 2, borderColor: colors.border,
      marginRight: 12, alignItems: 'center', justifyContent: 'center',
    },
    checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    answerText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
    navRow: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
    navBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
    navBtnPrimary: { backgroundColor: colors.primary },
    navBtnSecondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },

    // Results
    resultContainer: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
    resultIcon: { fontSize: 72, marginBottom: 16 },
    resultTitle: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 8 },
    resultScore: { fontSize: 48, fontWeight: '900', color: colors.primary, marginBottom: 4 },
    resultSub: { fontSize: 16, color: colors.textSecondary, marginBottom: 32 },
    resultPassedBadge: {
      paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30,
      marginBottom: 32,
    },
    resultPassedText: { fontSize: 16, fontWeight: '800' },
    restartBtn: {
      backgroundColor: colors.primary, borderRadius: 16,
      padding: 16, width: '100%', alignItems: 'center', marginBottom: 12,
    },
    homeBtn: {
      backgroundColor: colors.card, borderRadius: 16,
      padding: 16, width: '100%', alignItems: 'center',
      borderWidth: 1, borderColor: colors.border,
    },
  });

  if (finished && results) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.resultContainer}>
          <Text style={s.resultIcon}>{results.passed ? '🎉' : '😔'}</Text>
          <Text style={s.resultTitle}>{results.passed ? 'Bestanden!' : 'Nicht bestanden'}</Text>
          <Text style={s.resultScore}>{results.percentage}%</Text>
          <Text style={s.resultSub}>{results.score} / {results.maxScore} Punkte</Text>
          <View style={[s.resultPassedBadge, {
            backgroundColor: results.passed ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)',
          }]}>
            <Text style={[s.resultPassedText, { color: results.passed ? colors.success : colors.danger }]}>
              {results.passed ? '✓ Max. 10 Fehlerpunkte' : '✗ Mehr als 10 Fehlerpunkte'}
            </Text>
          </View>
          <TouchableOpacity style={s.restartBtn} onPress={() => {
            setCurrent(0);
            setSelectedAnswers({});
            setFinished(false);
            setResults(null);
          }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Nochmal versuchen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.homeBtn} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.closeBtn}>✕</Text>
        </TouchableOpacity>
        <View style={s.headerInfo}>
          <Text style={s.headerTitle}>Prüfungssimulation</Text>
          <Text style={s.progressText}>Frage {current + 1} von {questions.length}</Text>
        </View>
      </View>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${((current + 1) / questions.length) * 100}%` }]} />
      </View>

      <ScrollView style={s.scroll}>
        <Text style={s.questionNum}>FRAGE {current + 1}</Text>
        <Text style={s.questionText}>{t(question.question)}</Text>
        <View style={s.pointsBadge}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#000' }}>{question.points} Punkte</Text>
        </View>

        {question.answers.map((ans, i) => {
          const isSelected = chosen.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[s.answerBtn, isSelected && s.answerSelected]}
              onPress={() => toggleAnswer(i)}
              activeOpacity={0.8}
            >
              <View style={[s.checkbox, isSelected && s.checkboxSelected]}>
                {isSelected && <Text style={{ color: '#000', fontWeight: '900', fontSize: 14 }}>✓</Text>}
              </View>
              <Text style={s.answerText}>{t(ans.text)}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={s.navRow}>
        {current > 0 && (
          <TouchableOpacity style={[s.navBtn, s.navBtnSecondary]} onPress={() => setCurrent(current - 1)}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>← Zurück</Text>
          </TouchableOpacity>
        )}
        {current < questions.length - 1 ? (
          <TouchableOpacity style={[s.navBtn, s.navBtnPrimary]} onPress={() => setCurrent(current + 1)}>
            <Text style={{ color: '#000', fontWeight: '800' }}>Weiter →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[s.navBtn, s.navBtnPrimary]} onPress={finish}>
            <Text style={{ color: '#000', fontWeight: '800' }}>Prüfung abgeben ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
