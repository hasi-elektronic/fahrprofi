import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAmpel } from '../../hooks/useAmpel';
import { TOPICS } from '../../data/questions';

const { width } = Dimensions.get('window');
const TOTAL_QUESTIONS = 2413;

const TOPIC_META = [
  { id: 'gefahrenlehre', total: 519 },
  { id: 'verhalten', total: 804 },
  { id: 'vorfahrt', total: 54 },
  { id: 'verkehrszeichen', total: 231 },
  { id: 'umwelt', total: 99 },
  { id: 'technik', total: 689 },
  { id: 'eignung', total: 17 },
];

export default function PruefungsampelScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getGlobalStats } = useAmpel();
  const stats = getGlobalStats();

  const gruen = stats.gruen;
  const gelb = stats.gelb;
  const rot = stats.rot;
  const unseen = TOTAL_QUESTIONS - stats.studied;

  const gruenPct = (gruen / TOTAL_QUESTIONS) * 100;
  const gelbPct = (gelb / TOTAL_QUESTIONS) * 100;
  const rotPct = (rot / TOTAL_QUESTIONS) * 100;
  const unseenPct = (unseen / TOTAL_QUESTIONS) * 100;

  const isReady = gruenPct >= 80;

  const TOPIC_INFO: { [key: string]: { icon: string; color: string } } = {
    gefahrenlehre: { icon: '⚠️', color: '#ef4444' },
    verhalten: { icon: '🚦', color: '#10b981' },
    vorfahrt: { icon: '➡️', color: '#f59e0b' },
    verkehrszeichen: { icon: '🚧', color: '#3b82f6' },
    umwelt: { icon: '🌱', color: '#10b981' },
    technik: { icon: '🔧', color: '#6b7280' },
    eignung: { icon: '👤', color: '#8b5cf6' },
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      padding: 20, flexDirection: 'row', alignItems: 'center',
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { fontSize: 22, color: colors.primary, marginRight: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
    scroll: { padding: 20 },
    ampelCard: {
      backgroundColor: colors.card, borderRadius: 20,
      borderWidth: 1, borderColor: colors.border, padding: 20, marginBottom: 20,
    },
    readinessBadge: {
      alignSelf: 'flex-start', borderRadius: 20,
      paddingHorizontal: 14, paddingVertical: 6,
      borderWidth: 1, marginBottom: 16,
    },
    progressBar: {
      height: 14, borderRadius: 7, overflow: 'hidden',
      flexDirection: 'row', marginBottom: 16,
    },
    statsGrid: { flexDirection: 'row', gap: 10 },
    statBox: {
      flex: 1, backgroundColor: colors.surface, borderRadius: 12,
      borderWidth: 1, borderColor: colors.border,
      padding: 12, alignItems: 'center',
    },
    statValue: { fontSize: 22, fontWeight: '900' },
    statLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 12 },
    topicCard: {
      backgroundColor: colors.card, borderRadius: 14,
      borderWidth: 1, borderColor: colors.border,
      padding: 14, marginBottom: 10,
    },
    topicHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    topicIcon: {
      width: 36, height: 36, borderRadius: 8,
      alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    topicName: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.text },
    topicPct: { fontSize: 13, fontWeight: '800', color: '#22c55e' },
    topicBar: { height: 5, borderRadius: 3, overflow: 'hidden', flexDirection: 'row' },
    infoCard: {
      backgroundColor: colors.border + '44',
      borderRadius: 14, padding: 14, marginBottom: 20,
    },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>🚦 Prüfungsampel</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Ampel Card */}
        <View style={s.ampelCard}>
          <View style={[s.readinessBadge, {
            backgroundColor: isReady ? '#22c55e22' : '#f59e0b22',
            borderColor: isReady ? '#22c55e' : '#f59e0b',
          }]}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: isReady ? '#22c55e' : '#f59e0b' }}>
              {isReady ? '✓ Prüfungsbereit!' : '📊 In Bearbeitung'}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={s.progressBar}>
            {gruenPct > 0 && <View style={{ width: `${gruenPct}%`, backgroundColor: '#22c55e' }} />}
            {gelbPct > 0 && <View style={{ width: `${gelbPct}%`, backgroundColor: '#f59e0b' }} />}
            {rotPct > 0 && <View style={{ width: `${rotPct}%`, backgroundColor: '#ef4444' }} />}
            {unseenPct > 0 && <View style={{ width: `${unseenPct}%`, backgroundColor: colors.border }} />}
          </View>

          {/* Stats grid */}
          <View style={s.statsGrid}>
            {[
              { color: '#22c55e', icon: '🟢', val: gruen, label: 'Grün\nPrüfungsreif' },
              { color: '#f59e0b', icon: '🟡', val: gelb, label: 'Gelb\n1× richtig' },
              { color: '#ef4444', icon: '🔴', val: rot, label: 'Rot\nFalsch' },
              { color: colors.textMuted, icon: '⬜', val: unseen, label: 'Neu\nNicht gesehen' },
            ].map((item) => (
              <View key={item.label} style={s.statBox}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text style={[s.statValue, { color: item.color }]}>{item.val}</Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={s.infoCard}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 6 }}>💡 So funktioniert die Ampel</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 19 }}>
            🔴 Rot — Noch nicht gelernt oder falsch beantwortet{'\n'}
            🟡 Gelb — 1× richtig beantwortet (einmal noch!){'\n'}
            🟢 Grün — 2× richtig = Prüfungsreif ✓{'\n\n'}
            Wenn alle Fragen grün sind, bist du bereit!
          </Text>
        </View>

        {/* Topics */}
        <Text style={s.sectionTitle}>Themenübersicht</Text>
        {TOPIC_META.map((tp) => {
          const info = TOPIC_INFO[tp.id];
          const topicData = TOPICS.find((t) => t.id === tp.id);
          // Demo values
          const g = Math.floor(tp.total * 0.08);
          const y = Math.floor(tp.total * 0.04);
          const r = tp.total - g - y;
          const gPct = (g / tp.total) * 100;
          const yPct = (y / tp.total) * 100;
          const rPct = (r / tp.total) * 100;

          return (
            <TouchableOpacity
              key={tp.id}
              style={s.topicCard}
              onPress={() => navigation.navigate('MultipleChoice', { topic: tp.id })}
              activeOpacity={0.8}
            >
              <View style={s.topicHeader}>
                <View style={[s.topicIcon, { backgroundColor: info.color + '22' }]}>
                  <Text style={{ fontSize: 18 }}>{info.icon}</Text>
                </View>
                <Text style={s.topicName} numberOfLines={1}>
                  {topicData ? t(topicData.label) : tp.id}
                </Text>
                <Text style={[s.topicPct, { color: g > 0 ? '#22c55e' : colors.textMuted }]}>
                  {Math.round(gPct)}%
                </Text>
              </View>
              <View style={s.topicBar}>
                {gPct > 0 && <View style={{ width: `${gPct}%`, backgroundColor: '#22c55e' }} />}
                {yPct > 0 && <View style={{ width: `${yPct}%`, backgroundColor: '#f59e0b' }} />}
                <View style={{ flex: 1, backgroundColor: '#ef4444' }} />
              </View>
              <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 5 }}>
                {g} grün · {y} gelb · {r} rot · {tp.total} gesamt
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
