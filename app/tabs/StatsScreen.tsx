import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAmpel } from '../../hooks/useAmpel';
import { useXP, LEVEL_NAMES } from '../../hooks/useXP';
import { useActivity } from '../../hooks/useActivity';

const { width } = Dimensions.get('window');
const TOTAL = 2413;

const TOPICS = [
  { id: 'gefahrenlehre', label: 'Gefahrenlehre', icon: '⚠️', total: 519 },
  { id: 'verhalten',     label: 'Verhalten',      icon: '🚦', total: 804 },
  { id: 'vorfahrt',      label: 'Vorfahrt',        icon: '↗️', total: 54  },
  { id: 'verkehrszeichen',label:'Verkehrszeichen', icon: '🚧', total: 231 },
  { id: 'umwelt',        label: 'Umwelt',          icon: '🌿', total: 99  },
  { id: 'technik',       label: 'Technik',         icon: '⚙️', total: 689 },
  { id: 'eignung',       label: 'Eignung',         icon: '👤', total: 17  },
];

const SHADOW = {
  shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
};

const DAY_LABELS = ['Mo','Di','Mi','Do','Fr','Sa','So'];
function getDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  return DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
}

export default function StatsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { getGlobalStats } = useAmpel();
  const { xp } = useXP();
  const { data, getLast7Days, getTodayActivity, getSuccessRate } = useActivity();

  const amp = getGlobalStats();
  const last7 = getLast7Days();
  const today = getTodayActivity();
  const rate = getSuccessRate();
  const level = LEVEL_NAMES[xp.level] || LEVEL_NAMES[0];

  // Readiness score
  const score = Math.round(((amp.gruen * 1.0 + amp.gelb * 0.5) / TOTAL) * 100);
  const readiness = score >= 85
    ? { label: 'Prüfungsbereit ✓', color: colors.success, bg: colors.successLight, border: colors.successMid }
    : score >= 60
    ? { label: 'Fast bereit',       color: colors.warning, bg: colors.warningLight, border: colors.warningMid }
    : score >= 20
    ? { label: 'In Bearbeitung',    color: '#2563EB',      bg: '#EFF6FF',           border: '#BFDBFE' }
    : { label: 'Gerade gestartet',  color: colors.textSecondary, bg: colors.elevated, border: colors.border };

  const maxBar = Math.max(...last7.map(d => d.answered), 1);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20 },
    title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
    sub: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
    card: {
      backgroundColor: colors.surface, borderRadius: 20,
      borderWidth: 1, borderColor: colors.border,
      padding: 18, marginBottom: 14, ...SHADOW,
    },
    cardTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 14 },
    row3: { flexDirection: 'row', gap: 10 },
    box: {
      flex: 1, backgroundColor: colors.elevated, borderRadius: 14,
      padding: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    },
    boxVal: { fontSize: 22, fontWeight: '900', marginBottom: 3 },
    boxLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  });

  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>📊 Statistik</Text>
        <Text style={s.sub}>Dein Lernfortschritt</Text>

        {/* Level */}
        <View style={[s.card, { backgroundColor: colors.primary, borderColor: 'transparent' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Text style={{ fontSize: 34 }}>{level?.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>LEVEL {xp.level}</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>{level?.de}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>{xp.total}</Text>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Gesamt XP</Text>
            </View>
          </View>
          <View style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ width: `${(xp.xpInLevel / Math.max(xp.xpForNextLevel, 1)) * 100}%` as any, height: '100%', backgroundColor: '#fff', borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 5 }}>
            Noch {xp.xpForNextLevel - xp.xpInLevel} XP bis Level {xp.level + 1}
          </Text>
        </View>

        {/* Today */}
        <View style={s.card}>
          <Text style={s.cardTitle}>HEUTE</Text>
          <View style={s.row3}>
            {[
              { v: today.answered, l: 'Beantwortet', c: colors.primary },
              { v: today.correct,  l: 'Richtig',     c: colors.success },
              { v: today.xp,       l: 'XP ⚡',       c: '#F59E0B' },
            ].map(item => (
              <View key={item.l} style={s.box}>
                <Text style={[s.boxVal, { color: item.c }]}>{item.v}</Text>
                <Text style={s.boxLabel}>{item.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7-day chart */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={s.cardTitle}>LETZTE 7 TAGE</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
              {last7.reduce((s, d) => s + d.answered, 0)} Fragen
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {last7.map((day, i) => {
              const pct = day.answered / maxBar;
              const isToday = i === last7.length - 1;
              const active = day.answered > 0;
              return (
                <View key={day.date} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <View style={{
                    width: '100%', borderRadius: 4,
                    backgroundColor: active ? (isToday ? colors.primary : colors.primary + '55') : colors.border,
                    height: Math.max(pct * 56, active ? 4 : 2),
                  }} />
                  <Text style={{ fontSize: 9, fontWeight: isToday ? '700' : '400', color: isToday ? colors.primary : colors.textMuted }}>
                    {getDayLabel(day.date)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Prüfungsbereitschaft */}
        <View style={s.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <View>
              <Text style={s.cardTitle}>PRÜFUNGSBEREITSCHAFT</Text>
              <Text style={{ fontSize: 40, fontWeight: '900', color: readiness.color, lineHeight: 44 }}>{score}%</Text>
            </View>
            <View style={{ backgroundColor: readiness.bg, borderWidth: 1, borderColor: readiness.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: readiness.color }}>{readiness.label}</Text>
            </View>
          </View>
          {/* Tri bar */}
          <View style={{ height: 8, borderRadius: 4, overflow: 'hidden', flexDirection: 'row', gap: 1, marginBottom: 12 }}>
            {(amp.gruen / TOTAL * 100) > 0 && <View style={{ width: `${amp.gruen / TOTAL * 100}%` as any, backgroundColor: colors.success, borderRadius: 4 }} />}
            {(amp.gelb / TOTAL * 100) > 0 && <View style={{ width: `${amp.gelb / TOTAL * 100}%` as any, backgroundColor: colors.warning }} />}
            {(amp.rot / TOTAL * 100) > 0 && <View style={{ width: `${amp.rot / TOTAL * 100}%` as any, backgroundColor: colors.danger }} />}
            <View style={{ flex: 1, backgroundColor: colors.border }} />
          </View>
          <View style={s.row3}>
            <View style={s.box}>
              <Text style={[s.boxVal, { color: colors.success }]}>{amp.gruen}</Text>
              <Text style={s.boxLabel}>🟢 Grün</Text>
            </View>
            <View style={s.box}>
              <Text style={[s.boxVal, { color: colors.warning }]}>{amp.gelb}</Text>
              <Text style={s.boxLabel}>🟡 Gelb</Text>
            </View>
            <View style={s.box}>
              <Text style={[s.boxVal, { color: colors.textSecondary }]}>{TOTAL - amp.gruen - amp.gelb - amp.rot}</Text>
              <Text style={s.boxLabel}>⬜ Neu</Text>
            </View>
          </View>
        </View>

        {/* Overall */}
        <View style={s.card}>
          <Text style={s.cardTitle}>GESAMT</Text>
          <View style={s.row3}>
            <View style={s.box}>
              <Text style={[s.boxVal, { color: colors.primary }]}>{data.totalAnswered}</Text>
              <Text style={s.boxLabel}>Gesamt beantwortet</Text>
            </View>
            <View style={s.box}>
              <Text style={[s.boxVal, { color: rate >= 70 ? colors.success : colors.warning }]}>{rate}%</Text>
              <Text style={s.boxLabel}>Erfolgsrate</Text>
            </View>
            <View style={s.box}>
              <Text style={[s.boxVal, { color: '#F59E0B' }]}>{xp.streak}</Text>
              <Text style={s.boxLabel}>🔥 Streak</Text>
            </View>
          </View>
        </View>

        {/* Topics */}
        <View style={s.card}>
          <Text style={s.cardTitle}>THEMEN</Text>
          {TOPICS.map((tp, i) => {
            const gP = (amp.gruen / TOTAL) * 100; // simplified
            const yP = (amp.gelb / TOTAL) * 100;
            return (
              <View key={tp.id} style={{
                flexDirection: 'row', alignItems: 'center', gap: 10,
                paddingVertical: 11,
                borderBottomWidth: i < TOPICS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}>
                <Text style={{ fontSize: 18, width: 26 }}>{tp.icon}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{tp.label}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.success }}>{Math.round(gP)}%</Text>
                  </View>
                  <View style={{ height: 4, borderRadius: 2, overflow: 'hidden', flexDirection: 'row' }}>
                    <View style={{ width: `${gP}%` as any, backgroundColor: colors.success, borderRadius: 2 }} />
                    <View style={{ width: `${yP}%` as any, backgroundColor: colors.warning }} />
                    <View style={{ flex: 1, backgroundColor: colors.danger, opacity: 0.3 }} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
