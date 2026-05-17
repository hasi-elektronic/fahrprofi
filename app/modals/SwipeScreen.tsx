import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, PanResponder, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import type { Question } from '../../data/questions';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export default function SwipeScreen({ route, navigation }: any) {
  const { questions }: { questions: Question[] } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { recordAnswer } = useProgress();

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const question = questions[index];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeOut('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeOut('left');
      } else {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
      }
    },
  });

  const swipeOut = async (dir: 'left' | 'right') => {
    const toX = dir === 'right' ? width * 1.5 : -width * 1.5;
    Animated.parallel([
      Animated.timing(position, { toValue: { x: toX, y: 0 }, duration: 280, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(async () => {
      await recordAnswer(question.id, dir === 'right' ? 5 : 0);
      position.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
      setShowAnswer(false);
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
      } else {
        navigation.goBack();
      }
    });
  };

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rightOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { fontSize: 22, color: colors.primary },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text },
    counter: { fontSize: 14, color: colors.textSecondary },
    cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
      width: width - 40, minHeight: 340, borderRadius: 24,
      padding: 28, backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border,
      shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3, shadowRadius: 16, elevation: 10,
    },
    badge: {
      position: 'absolute', top: 20, paddingHorizontal: 14, paddingVertical: 8,
      borderRadius: 20, borderWidth: 3,
    },
    badgeRight: { right: 20, borderColor: colors.success },
    badgeLeft: { left: 20, borderColor: colors.danger },
    badgeText: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
    topicBadge: {
      alignSelf: 'flex-start', backgroundColor: colors.border,
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 16,
    },
    topicText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
    question: { fontSize: 20, fontWeight: '700', color: colors.text, lineHeight: 28 },
    pointsBadge: {
      alignSelf: 'flex-end', marginTop: 12,
      backgroundColor: colors.primary, borderRadius: 20,
      paddingHorizontal: 10, paddingVertical: 4,
    },
    tapHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 12 },
    answerArea: { marginTop: 16 },
    answerTitle: { fontSize: 13, fontWeight: '700', color: colors.primary, marginBottom: 8 },
    answerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
    answerText: { fontSize: 14, color: colors.text, flex: 1, lineHeight: 20 },
    swipeButtons: { flexDirection: 'row', justifyContent: 'center', gap: 20, padding: 20 },
    swipeBtn: {
      width: 64, height: 64, borderRadius: 32,
      alignItems: 'center', justifyContent: 'center',
    },
    swipeBtnIcon: { fontSize: 28 },
    hint: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginBottom: 16 },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Swipe & Learn</Text>
        <Text style={s.counter}>{index + 1}/{questions.length}</Text>
      </View>

      <View style={s.cardContainer}>
        <Animated.View
          style={[{ transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }], opacity }]}
          {...panResponder.panHandlers}
        >
          {/* Right label */}
          <Animated.View style={[s.badge, s.badgeRight, { opacity: rightOpacity }]}>
            <Text style={[s.badgeText, { color: colors.success }]}>✓ RICHTIG</Text>
          </Animated.View>
          {/* Left label */}
          <Animated.View style={[s.badge, s.badgeLeft, { opacity: leftOpacity }]}>
            <Text style={[s.badgeText, { color: colors.danger }]}>✗ FALSCH</Text>
          </Animated.View>

          <View style={s.card}>
            <View style={s.topicBadge}>
              <Text style={s.topicText}>{question.topic.toUpperCase()}</Text>
            </View>
            <Text style={s.question}>{t(question.question)}</Text>
            <View style={s.pointsBadge}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#000' }}>
                {question.points} Punkte
              </Text>
            </View>

            {showAnswer && (
              <View style={s.answerArea}>
                <Text style={s.answerTitle}>Richtige Antworten:</Text>
                {question.answers.filter((a) => a.correct).map((ans, i) => (
                  <View key={i} style={s.answerRow}>
                    <Text style={{ color: colors.success, marginRight: 6, fontSize: 14 }}>✓</Text>
                    <Text style={s.answerText}>{t(ans.text)}</Text>
                  </View>
                ))}
              </View>
            )}

            {!showAnswer && (
              <TouchableOpacity onPress={() => setShowAnswer(true)} style={{ marginTop: 12 }}>
                <Text style={s.tapHint}>Tippe zum Aufdecken 👆</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>

      <Text style={s.hint}>← Falsch &nbsp;&nbsp;&nbsp; Richtig →</Text>
      <View style={s.swipeButtons}>
        <TouchableOpacity
          style={[s.swipeBtn, { backgroundColor: 'rgba(248,81,73,0.15)', borderWidth: 2, borderColor: colors.danger }]}
          onPress={() => swipeOut('left')}
        >
          <Text style={s.swipeBtnIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.swipeBtn, { backgroundColor: 'rgba(63,185,80,0.15)', borderWidth: 2, borderColor: colors.success }]}
          onPress={() => swipeOut('right')}
        >
          <Text style={s.swipeBtnIcon}>✓</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
