import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, Dimensions, Animated,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ParsedQuestion } from '../../utils/api';

const { width } = Dimensions.get('window');

interface VisualQuestionCardProps {
  question: ParsedQuestion & { imageUrl?: string; ampel?: 0 | 1 | 2 };
  onAnswer: (correct: boolean) => void;
  onBookmark?: (id: string) => void;
  bookmarked?: boolean;
  showIndex?: string; // e.g. "3 / 20"
}

const AMPEL_COLORS = {
  0: '#FF3B30',
  1: '#FF9F0A',
  2: '#30D158',
};

export default function VisualQuestionCard({
  question: q,
  onAnswer,
  onBookmark,
  bookmarked = false,
  showIndex,
}: VisualQuestionCardProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isMulti = q.answers.filter((a) => a.correct).length > 1;
  const ampel = q.ampel ?? 0;
  const ampelColor = AMPEL_COLORS[ampel];

  const TOPIC_COLORS: { [key: string]: string } = {
    gefahrenlehre: '#FF3B30',
    verhalten: '#30D158',
    vorfahrt: '#FF9F0A',
    verkehrszeichen: '#4F9EFF',
    umwelt: '#30D158',
    technik: '#6B84A0',
    eignung: '#A78BFA',
  };
  const topicColor = TOPIC_COLORS[q.topic] || colors.primary;

  const toggle = (i: number) => {
    if (confirmed) return;
    if (isMulti) {
      setSelected((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]);
    } else {
      setSelected([i]);
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const confirm = () => {
    if (!selected.length || confirmed) return;
    setConfirmed(true);
    const correctIdx = q.answers.map((a, i) => a.correct ? i : -1).filter((i) => i >= 0);
    const isCorrect = correctIdx.length === selected.length && correctIdx.every((i) => selected.includes(i));
    if (!isCorrect) shake();
    onAnswer(isCorrect);
  };

  const s = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: 16,
    },
    topicStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    ampelDot: {
      width: 8, height: 8, borderRadius: 4,
    },
    topicText: {
      fontSize: 11, fontWeight: '700',
      color: colors.textSecondary, letterSpacing: 0.5,
    },
    pointsBadge: {
      backgroundColor: topicColor + '22',
      borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
      borderWidth: 1, borderColor: topicColor + '44',
    },
    pointsText: { fontSize: 11, fontWeight: '800', color: topicColor },
    bookmarkBtn: { marginLeft: 'auto', fontSize: 18, padding: 2 },
    imageContainer: {
      backgroundColor: colors.elevated,
      minHeight: 160, alignItems: 'center', justifyContent: 'center',
    },
    image: { width: '100%', height: 180, resizeMode: 'contain' },
    body: { padding: 16 },
    multiHint: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      marginBottom: 8,
    },
    multiHintText: { fontSize: 11, color: colors.textSecondary, fontStyle: 'italic' },
    questionText: {
      fontSize: 16, fontWeight: '700',
      color: colors.text, lineHeight: 24, marginBottom: 16,
    },
    answerRow: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10,
      padding: 13, borderRadius: 13, borderWidth: 1.5,
      marginBottom: 9,
    },
    checkbox: {
      width: 20, height: 20, borderRadius: 5,
      borderWidth: 1.5, alignItems: 'center',
      justifyContent: 'center', flexShrink: 0, marginTop: 1,
    },
    answerText: { flex: 1, fontSize: 13, lineHeight: 20 },
    confirmBtn: {
      borderRadius: 13, padding: 14,
      alignItems: 'center', marginTop: 4,
    },
    confirmText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.2 },
    explanation: {
      marginTop: 10, padding: 12,
      backgroundColor: colors.primary + '12',
      borderRadius: 11, borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
  });

  const getAnswerStyle = (i: number) => {
    const isSel = selected.includes(i);
    const isCorrect = q.answers[i].correct;
    if (confirmed) {
      if (isCorrect) return {
        borderColor: '#30D158', backgroundColor: '#0A2015',
        checkBg: '#30D158', checkBorder: '#30D158', textColor: colors.text,
      };
      if (isSel) return {
        borderColor: '#FF3B30', backgroundColor: '#2D0A08',
        checkBg: '#FF3B30', checkBorder: '#FF3B30', textColor: colors.text,
      };
      return { borderColor: colors.border, backgroundColor: 'transparent', checkBg: 'transparent', checkBorder: colors.border, textColor: colors.textSecondary };
    }
    if (isSel) return {
      borderColor: colors.primary, backgroundColor: colors.primary + '15',
      checkBg: colors.primary, checkBorder: colors.primary, textColor: colors.text,
    };
    return { borderColor: colors.border, backgroundColor: 'transparent', checkBg: 'transparent', checkBorder: colors.border, textColor: colors.text };
  };

  return (
    <Animated.View style={[s.card, { transform: [{ translateX: shakeAnim }] }]}>
      {/* Topic strip */}
      <View style={[s.topicStrip, { backgroundColor: topicColor + '0A' }]}>
        <View style={[s.ampelDot, { backgroundColor: ampelColor }]} />
        <Text style={s.topicText}>{q.topic.toUpperCase()}</Text>
        <View style={s.pointsBadge}>
          <Text style={s.pointsText}>{q.points} Pkt</Text>
        </View>
        {showIndex && (
          <Text style={{ marginLeft: 4, fontSize: 11, color: colors.textMuted }}>{showIndex}</Text>
        )}
        {onBookmark && (
          <TouchableOpacity onPress={() => onBookmark(q.id)} style={{ marginLeft: 'auto' }}>
            <Text style={{ fontSize: 18, opacity: bookmarked ? 1 : 0.3 }}>📌</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image */}
      {q.imageUrl && !imgError && (
        <View style={s.imageContainer}>
          <Image
            source={{ uri: q.imageUrl }}
            style={s.image}
            onError={() => setImgError(true)}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Body */}
      <View style={s.body}>
        {isMulti && (
          <View style={s.multiHint}>
            <Text style={{ fontSize: 14, color: colors.warning }}>⚠️</Text>
            <Text style={s.multiHintText}>Mehrere Antworten möglich</Text>
          </View>
        )}

        <Text style={s.questionText}>{t(q.question)}</Text>

        {q.answers.map((ans, i) => {
          const style = getAnswerStyle(i);
          const isSel = selected.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[s.answerRow, { borderColor: style.borderColor, backgroundColor: style.backgroundColor }]}
              onPress={() => toggle(i)}
              activeOpacity={0.8}
            >
              <View style={[s.checkbox, { borderColor: style.checkBorder, backgroundColor: style.checkBg }]}>
                {(isSel || (confirmed && ans.correct)) && (
                  <Text style={{ fontSize: 10, fontWeight: '900', color: '#000' }}>
                    {confirmed ? (ans.correct ? '✓' : isSel ? '✗' : '') : '✓'}
                  </Text>
                )}
              </View>
              <Text style={[s.answerText, { color: style.textColor }]}>{t(ans.text)}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {confirmed && q.explanation && t(q.explanation) && (
          <View style={s.explanation}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 4 }}>
              💡 Erklärung
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
              {t(q.explanation)}
            </Text>
          </View>
        )}

        {/* Button */}
        <TouchableOpacity
          style={[s.confirmBtn, {
            backgroundColor: confirmed
              ? colors.elevated
              : selected.length > 0 ? colors.primary : colors.textMuted + '44',
          }]}
          onPress={confirm}
          disabled={!selected.length || confirmed}
          activeOpacity={0.85}
        >
          <Text style={[s.confirmText, {
            color: confirmed ? colors.textSecondary : selected.length > 0 ? '#000' : colors.textMuted,
          }]}>
            {confirmed ? '✓ Gespeichert' : 'Bestätigen ✓'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
