import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import type { Question } from '../../data/questions';

const { width } = Dimensions.get('window');

export default function FlashcardScreen({ route, navigation }: any) {
  const { questions }: { questions: Question[] } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { recordAnswer } = useProgress();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const question = questions[index];
  const total = questions.length;

  const flip = () => {
    if (answered) return;
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  const handleQuality = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    await recordAnswer(question.id, quality);
    setFlipped(false);
    setAnswered(false);
    flipAnim.setValue(0);
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      navigation.goBack();
    }
  };

  const correctAnswers = question.answers.filter((a) => a.correct);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { fontSize: 24, color: colors.primary, marginRight: 12 },
    progress: { flex: 1, alignItems: 'center' },
    progressText: { fontSize: 14, color: colors.textSecondary },
    progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 6, width: width - 80 },
    progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
    cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    card: {
      width: width - 40, minHeight: 260, borderRadius: 20,
      padding: 24, backfaceVisibility: 'hidden',
      position: 'absolute',
    },
    cardFront: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    cardBack: { backgroundColor: colors.surfaceElevated, borderWidth: 2, borderColor: colors.primary },
    cardLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 16 },
    cardQuestion: { fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 26 },
    cardPoints: {
      position: 'absolute', top: 16, right: 16,
      backgroundColor: colors.primary,
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    },
    cardPointsText: { fontSize: 12, fontWeight: '800', color: '#000' },
    topicBadge: {
      position: 'absolute', top: 16, left: 16,
      backgroundColor: colors.border,
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    },
    topicText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
    answerLabel: { fontSize: 12, fontWeight: '700', color: colors.primary, letterSpacing: 1, marginBottom: 12 },
    answerItem: {
      flexDirection: 'row', alignItems: 'flex-start',
      backgroundColor: colors.card, borderRadius: 10,
      padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border,
    },
    answerCorrect: { borderColor: colors.success, backgroundColor: 'rgba(63,185,80,0.1)' },
    answerIcon: { fontSize: 16, marginRight: 8, marginTop: 1 },
    answerText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 20 },
    tapHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 180 },
    ratingArea: { padding: 20, gap: 10 },
    ratingTitle: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 6 },
    ratingRow: { flexDirection: 'row', gap: 10 },
    ratingBtn: {
      flex: 1, padding: 14, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
    },
    ratingIcon: { fontSize: 22 },
    ratingLabel: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  });

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backBtn}>✕</Text>
        </TouchableOpacity>
        <View style={s.progress}>
          <Text style={s.progressText}>{index + 1} / {total}</Text>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${((index + 1) / total) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Card */}
      <View style={s.cardArea}>
        {/* Front */}
        <Animated.View style={[s.card, s.cardFront, { transform: [{ rotateY: frontRotate }] }]}>
          <View style={s.topicBadge}>
            <Text style={s.topicText}>{question.topic.toUpperCase()}</Text>
          </View>
          <View style={s.cardPoints}>
            <Text style={s.cardPointsText}>{question.points} Pkt</Text>
          </View>
          <Text style={[s.cardLabel, { marginTop: 30 }]}>FRAGE</Text>
          <Text style={s.cardQuestion}>{t(question.question)}</Text>
        </Animated.View>

        {/* Back */}
        <Animated.View style={[s.card, s.cardBack, { transform: [{ rotateY: backRotate }] }]}>
          <Text style={s.answerLabel}>✓ RICHTIGE ANTWORTEN</Text>
          <ScrollView>
            {question.answers.map((ans, i) => (
              <View key={i} style={[s.answerItem, ans.correct && s.answerCorrect]}>
                <Text style={s.answerIcon}>{ans.correct ? '✅' : '❌'}</Text>
                <Text style={s.answerText}>{t(ans.text)}</Text>
              </View>
            ))}
            {question.explanation && (
              <View style={{ marginTop: 8, padding: 12, backgroundColor: colors.border, borderRadius: 10 }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
                  💡 {t(question.explanation)}
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {!flipped && <Text style={s.tapHint}>Tippe zum Aufdecken 👆</Text>}
      </View>

      {/* Flip / Rate buttons */}
      {!flipped ? (
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, alignItems: 'center' }}
            onPress={flip}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Antwort anzeigen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={s.ratingArea}>
          <Text style={s.ratingTitle}>Wie gut wusstest du es?</Text>
          <View style={s.ratingRow}>
            <TouchableOpacity
              style={[s.ratingBtn, { backgroundColor: '#F85149' }]}
              onPress={() => handleQuality(0)}
            >
              <Text style={s.ratingIcon}>😵</Text>
              <Text style={[s.ratingLabel, { color: '#fff' }]}>Gar nicht</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.ratingBtn, { backgroundColor: colors.warning }]}
              onPress={() => handleQuality(3)}
            >
              <Text style={s.ratingIcon}>🤔</Text>
              <Text style={[s.ratingLabel, { color: '#000' }]}>Schwer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.ratingBtn, { backgroundColor: colors.success }]}
              onPress={() => handleQuality(5)}
            >
              <Text style={s.ratingIcon}>😎</Text>
              <Text style={[s.ratingLabel, { color: '#fff' }]}>Leicht!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
