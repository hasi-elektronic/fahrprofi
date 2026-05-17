import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, Animated,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ParsedQuestion } from '../../utils/api';

interface Props {
  question: ParsedQuestion & { ampel?: 0 | 1 | 2 };
  onAnswer: (correct: boolean) => void;
  onBookmark?: (id: string) => void;
  bookmarked?: boolean;
  showIndex?: string;
}

const IMG_PROXY = 'https://fahrprofi-img.hguencavdi.workers.dev/img';

// Topic visual config — shown when no real photo exists
const TOPIC_CONFIG: Record<string, { bg: string; accent: string; icon: string; label: string }> = {
  gefahrenlehre:  { bg: '#FEF2F2', accent: '#DC2626', icon: '⚠️',  label: 'Gefahrenlehre'        },
  verhalten:      { bg: '#F0FDF4', accent: '#059669', icon: '🚦',  label: 'Verhalten'             },
  vorfahrt:       { bg: '#FFFBEB', accent: '#B45309', icon: '↗️',  label: 'Vorfahrt'              },
  verkehrszeichen:{ bg: '#EFF6FF', accent: '#2563EB', icon: '🚧',  label: 'Verkehrszeichen'       },
  technik:        { bg: '#F8FAFC', accent: '#475569', icon: '⚙️',  label: 'Fahrzeugtechnik'       },
  umwelt:         { bg: '#F0FDF4', accent: '#059669', icon: '🌿',  label: 'Umweltschutz'          },
  eignung:        { bg: '#FAF5FF', accent: '#7C3AED', icon: '👤',  label: 'Eignung & Befähigung'  },
};

const DEFAULT_CONFIG = { bg: '#F8FAFC', accent: '#1E3A5F', icon: '📋', label: 'Frage' };

const AMPEL_COLOR: Record<number, string> = { 0: '#DC2626', 1: '#B45309', 2: '#059669' };
const TOPIC_COLORS: Record<string, string> = {
  gefahrenlehre: '#DC2626', verhalten: '#059669', vorfahrt: '#B45309',
  verkehrszeichen: '#2563EB', technik: '#475569', umwelt: '#059669', eignung: '#7C3AED',
};

// Placeholder rendered as a styled View — works on web + native, no external URL
function TopicPlaceholder({ topic }: { topic: string }) {
  const cfg = TOPIC_CONFIG[topic] || DEFAULT_CONFIG;
  return (
    <View style={{
      backgroundColor: cfg.bg,
      height: 130,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      {/* Decorative rings */}
      <View style={{
        position: 'absolute',
        width: 120, height: 120, borderRadius: 60,
        borderWidth: 1, borderColor: cfg.accent + '15',
      }} />
      <View style={{
        position: 'absolute',
        width: 80, height: 80, borderRadius: 40,
        borderWidth: 1, borderColor: cfg.accent + '25',
      }} />
      <Text style={{ fontSize: 44 }}>{cfg.icon}</Text>
      <Text style={{
        fontSize: 11, fontWeight: '600',
        color: cfg.accent, letterSpacing: 0.5,
        textTransform: 'uppercase',
      }}>{cfg.label}</Text>
    </View>
  );
}

// Real photo from our proxy
function QuestionPhoto({ questionId }: { questionId: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const topic = questionId.split('.')[1] ? 
    Object.keys(TOPIC_CONFIG)[parseInt(questionId.split('.')[0]) - 1] || 'gefahrenlehre'
    : 'gefahrenlehre';

  if (error) return <TopicPlaceholder topic={topic} />;

  return (
    <View style={{ backgroundColor: '#F8FAFC', minHeight: 170 }}>
      {!loaded && (
        <View style={{
          position: 'absolute', inset: 0 as any,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#F8FAFC', zIndex: 1,
        } as any}>
          <Text style={{ fontSize: 24, opacity: 0.3 }}>🖼️</Text>
        </View>
      )}
      <Image
        source={{ uri: `${IMG_PROXY}/${questionId}.png` }}
        style={{ width: '100%', height: 180, opacity: loaded ? 1 : 0 }}
        resizeMode="contain"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </View>
  );
}

export default function VisualQuestionCard({
  question: q, onAnswer, onBookmark, bookmarked = false, showIndex,
}: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isMulti = q.answers.filter(a => a.correct).length > 1;
  const ampel = q.ampel ?? 0;
  const tc = TOPIC_COLORS[q.topic] || colors.primary;
  const hasRealImage = !!(q.imageUrl && q.imageUrl.trim().length > 0);

  const shake = () => Animated.sequence([
    Animated.timing(shakeAnim, { toValue: 7,  duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: -7, duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 4,  duration: 60, useNativeDriver: true }),
    Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
  ]).start();

  const toggle = (i: number) => {
    if (confirmed) return;
    if (isMulti) setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
    else setSelected([i]);
  };

  const confirm = () => {
    if (!selected.length || confirmed) return;
    setConfirmed(true);
    const correctIdx = q.answers.map((a, i) => a.correct ? i : -1).filter(i => i >= 0);
    const ok = correctIdx.length === selected.length && correctIdx.every(i => selected.includes(i));
    if (!ok) shake();
    onAnswer(ok);
  };

  const getStyle = (i: number) => {
    const sel = selected.includes(i);
    const isC = q.answers[i].correct;
    if (confirmed) {
      if (isC)  return { border: colors.success, bg: colors.successLight, cb: colors.success, text: colors.text };
      if (sel)  return { border: colors.danger,  bg: colors.dangerLight,  cb: colors.danger,  text: colors.textSecondary };
      return { border: colors.border, bg: '#fff', cb: 'transparent', text: colors.textMuted };
    }
    if (sel) return { border: colors.primary, bg: colors.primaryLight, cb: colors.primary, text: colors.text };
    return { border: colors.border, bg: '#fff', cb: 'transparent', text: colors.text };
  };

  return (
    <Animated.View style={[{
      backgroundColor: '#fff',
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      shadowColor: '#1E3A5F',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    }, { transform: [{ translateX: shakeAnim }] }]}>

      {/* Colored top rule */}
      <View style={{ height: 3, backgroundColor: tc, opacity: 0.8 }} />

      {/* Meta row */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 16, paddingVertical: 11,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        backgroundColor: tc + '08',
      }}>
        {/* Ampel dot */}
        <View style={{
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: AMPEL_COLOR[ampel],
        }} />
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {q.topic}
        </Text>
        <View style={{
          borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3,
          backgroundColor: tc + '18', borderWidth: 1, borderColor: tc + '33',
        }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: tc }}>{q.points} Pkt</Text>
        </View>
        {showIndex && <Text style={{ fontSize: 11, color: colors.textMuted, marginLeft: 4 }}>{showIndex}</Text>}
        {onBookmark && (
          <TouchableOpacity onPress={() => onBookmark(q.id)} style={{ marginLeft: 'auto' as any }}>
            <Text style={{ fontSize: 16, opacity: bookmarked ? 0.9 : 0.2 }}>🔖</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* IMAGE — always present */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {hasRealImage
          ? <QuestionPhoto questionId={q.id} />
          : <TopicPlaceholder topic={q.topic} />
        }
      </View>

      {/* Body */}
      <View style={{ padding: 16 }}>
        {isMulti && (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            marginBottom: 10, padding: 8,
            backgroundColor: colors.warningLight, borderRadius: 8,
            borderWidth: 1, borderColor: colors.warningMid,
          }}>
            <Text style={{ fontSize: 13, color: colors.warning }}>⚠️</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.warning }}>Mehrere Antworten möglich</Text>
          </View>
        )}

        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 25, marginBottom: 16 }}>
          {t(q.question)}
        </Text>

        {q.answers.map((ans, i) => {
          const st = getStyle(i);
          const sel = selected.includes(i);
          const cConf = confirmed && ans.correct;
          return (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 10,
                padding: 13, borderRadius: 12, borderWidth: 1.5,
                marginBottom: 8, borderColor: st.border, backgroundColor: st.bg,
              }}
              onPress={() => toggle(i)}
              activeOpacity={0.8}
            >
              <View style={{
                width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
                borderColor: st.border,
                backgroundColor: sel || cConf ? st.cb : 'transparent',
              }}>
                {(sel || cConf) && (
                  <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff' }}>
                    {confirmed ? (ans.correct ? '✓' : sel ? '✗' : '') : '✓'}
                  </Text>
                )}
              </View>
              <Text style={{ flex: 1, fontSize: 13, lineHeight: 20, color: st.text }}>
                {t(ans.text)}
              </Text>
            </TouchableOpacity>
          );
        })}

        {confirmed && q.explanation && t(q.explanation) && (
          <View style={{
            marginTop: 10, padding: 12,
            backgroundColor: colors.primaryLight, borderRadius: 10,
            borderLeftWidth: 3, borderLeftColor: colors.primary,
          }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 4 }}>💡 Erklärung</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>{t(q.explanation)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4,
            backgroundColor: confirmed ? colors.elevated : selected.length ? colors.primary : 'transparent',
            borderWidth: confirmed || selected.length ? 0 : 1.5,
            borderColor: colors.border,
          }}
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
