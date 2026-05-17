import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, Animated,
} from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getImageUrl } from '../../utils/imageProxy';
import type { ParsedQuestion } from '../../utils/api';

interface Props {
  question: ParsedQuestion & { ampel?: 0|1|2 };
  onAnswer: (correct: boolean) => void;
  onBookmark?: (id: string) => void;
  bookmarked?: boolean;
  showIndex?: string;
}

const AMPEL_COLOR = {0:'#DC2626', 1:'#B45309', 2:'#059669'};

const TOPIC_COLORS: Record<string, string> = {
  gefahrenlehre: '#DC2626',
  verhalten:     '#059669',
  vorfahrt:      '#B45309',
  verkehrszeichen:'#2563EB',
  technik:       '#475569',
  umwelt:        '#059669',
  eignung:       '#7C3AED',
};

export default function VisualQuestionCard({
  question: q, onAnswer, onBookmark, bookmarked = false, showIndex,
}: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isMulti = q.answers.filter((a) => a.correct).length > 1;
  const ampel = q.ampel ?? 0;
  const tc = TOPIC_COLORS[q.topic] || colors.primary;

  // Always show an image: real or placeholder
  const imgUrl = getImageUrl(q.id, q.imageUrl, q.topic);
  const isSvgPlaceholder = !q.imageUrl || q.imageUrl.trim().length === 0;

  const shake = () =>
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 7, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();

  const toggle = (i: number) => {
    if (confirmed) return;
    if (isMulti) setSelected((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]);
    else setSelected([i]);
  };

  const confirm = () => {
    if (!selected.length || confirmed) return;
    setConfirmed(true);
    const cIdx = q.answers.map((a, i) => (a.correct ? i : -1)).filter((i) => i >= 0);
    const ok = cIdx.length === selected.length && cIdx.every((i) => selected.includes(i));
    if (!ok) shake();
    onAnswer(ok);
  };

  const getStyle = (i: number) => {
    const sel = selected.includes(i);
    const isC = q.answers[i].correct;
    if (confirmed) {
      if (isC) return { border: colors.success, bg: colors.successLight, cb: colors.success, text: colors.text };
      if (sel) return { border: colors.danger,  bg: colors.dangerLight,  cb: colors.danger,  text: colors.textSecondary };
      return { border: colors.border, bg: '#fff', cb: 'transparent', text: colors.textMuted };
    }
    if (sel) return { border: colors.primary, bg: colors.primaryLight, cb: colors.primary, text: colors.text };
    return { border: colors.border, bg: '#fff', cb: 'transparent', text: colors.text };
  };

  const s = StyleSheet.create({
    card: {
      backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.border, marginBottom: 16,
      shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    },
    topRule: { height: 3, backgroundColor: tc, opacity: 0.7 },
    meta: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 16, paddingVertical: 11,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    ampelDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: AMPEL_COLOR[ampel] },
    imgBox: {
      backgroundColor: isSvgPlaceholder ? tc + '08' : colors.elevated,
      alignItems: 'center', justifyContent: 'center',
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    body: { padding: 16 },
    multiHint: {
      flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10,
      padding: 8, backgroundColor: colors.warningLight, borderRadius: 8,
      borderWidth: 1, borderColor: colors.warningMid,
    },
    question: { fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 25, marginBottom: 16 },
    ansRow: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10,
      padding: 13, borderRadius: 12, borderWidth: 1.5, marginBottom: 8,
    },
    checkbox: {
      width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
    },
    ansText: { flex: 1, fontSize: 13, lineHeight: 20 },
    expl: {
      marginTop: 10, padding: 12, backgroundColor: colors.primaryLight,
      borderRadius: 10, borderLeftWidth: 3, borderLeftColor: colors.primary,
    },
    btn: { borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4 },
  });

  return (
    <Animated.View style={[s.card, { transform: [{ translateX: shakeAnim }] }]}>
      <View style={s.topRule} />

      {/* Meta row */}
      <View style={[s.meta, { backgroundColor: tc + '08' }]}>
        <View style={s.ampelDot} />
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {q.topic}
        </Text>
        <View style={{ borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, backgroundColor: tc + '18', borderWidth: 1, borderColor: tc + '33' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: tc }}>{q.points} Pkt</Text>
        </View>
        {showIndex && <Text style={{ fontSize: 11, color: colors.textMuted, marginLeft: 4 }}>{showIndex}</Text>}
        {onBookmark && (
          <TouchableOpacity onPress={() => onBookmark(q.id)} style={{ marginLeft: 'auto' as any }}>
            <Text style={{ fontSize: 16, opacity: bookmarked ? 0.9 : 0.2 }}>🔖</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image — ALWAYS shown: real photo or topic placeholder */}
      {!imgErr && (
        <View style={[s.imgBox, { minHeight: isSvgPlaceholder ? 120 : 160 }]}>
          <Image
            source={{ uri: imgUrl }}
            style={{
              width: '100%',
              height: isSvgPlaceholder ? 120 : 180,
              resizeMode: isSvgPlaceholder ? 'contain' : 'contain',
            }}
            onError={() => setImgErr(true)}
          />
        </View>
      )}

      {/* Body */}
      <View style={s.body}>
        {isMulti && (
          <View style={s.multiHint}>
            <Text style={{ fontSize: 13, color: colors.warning }}>⚠️</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.warning }}>Mehrere Antworten möglich</Text>
          </View>
        )}

        <Text style={s.question}>{t(q.question)}</Text>

        {q.answers.map((ans, i) => {
          const st = getStyle(i);
          const sel = selected.includes(i);
          const cConf = confirmed && ans.correct;
          return (
            <TouchableOpacity key={i}
              style={[s.ansRow, { borderColor: st.border, backgroundColor: st.bg }]}
              onPress={() => toggle(i)} activeOpacity={0.8}
            >
              <View style={[s.checkbox, { borderColor: st.border, backgroundColor: st.cb }]}>
                {(sel || cConf) && (
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff' }}>
                    {confirmed ? (ans.correct ? '✓' : sel ? '✗' : '') : '✓'}
                  </Text>
                )}
              </View>
              <Text style={[s.ansText, { color: st.text }]}>{t(ans.text)}</Text>
            </TouchableOpacity>
          );
        })}

        {confirmed && q.explanation && t(q.explanation) && (
          <View style={s.expl}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 4 }}>💡 Erklärung</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>{t(q.explanation)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[s.btn, {
            backgroundColor: confirmed ? colors.elevated : selected.length ? colors.primary : 'transparent',
            borderWidth: confirmed || selected.length ? 0 : 1.5,
            borderColor: colors.border,
          }]}
          onPress={confirm}
          disabled={!selected.length || confirmed}
          activeOpacity={0.85}
        >
          <Text style={{
            fontSize: 14, fontWeight: '600', letterSpacing: 0.2,
            color: confirmed ? colors.textMuted : selected.length ? '#fff' : colors.textLight,
          }}>
            {confirmed ? '✓  Antwort erfasst' : 'Bestätigen'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
