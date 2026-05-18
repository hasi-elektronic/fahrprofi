import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useXP, LEVEL_NAMES } from '../../hooks/useXP';
import { useAmpel } from '../../hooks/useAmpel';
import { useActivity } from '../../hooks/useActivity';

const { width } = Dimensions.get('window');

const SHADOW = {
  shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
};

const FEATURES = [
  { icon: '🚦', title: 'Prüfungsampel',   desc: 'Siehst du auf einen Blick: was du kannst, was noch fehlt' },
  { icon: '⚡', title: 'Turbomodus',       desc: 'Nur die Fragen, die du noch nicht kannst' },
  { icon: '🖼️', title: 'Bilder & Grafiken',desc: 'Alle Verkehrssituationen mit echten Fotos' },
  { icon: '🌍', title: '5 Sprachen',       desc: 'Deutsch, Türkisch, Arabisch, Englisch, Russisch' },
  { icon: '🃏', title: 'Lernspiele',       desc: 'Speed Round, Memory Match, Karteikarten' },
  { icon: '📊', title: 'Statistik',        desc: 'Verfolge deinen Fortschritt täglich' },
];

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { xp } = useXP();
  const { getGlobalStats } = useAmpel();
  const { getTodayActivity } = useActivity();

  const amp = getGlobalStats();
  const today = getTodayActivity();
  const level = LEVEL_NAMES[xp.level] || LEVEL_NAMES[0];
  const hasStarted = xp.total > 0 || amp.studied > 0;

  // Readiness %
  const readiness = Math.round(((amp.gruen * 1 + amp.gelb * 0.5) / 2413) * 100);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // Hero
    hero: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24, paddingTop: 40, paddingBottom: 36,
    },
    heroEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 10 },
    heroTitle: { fontSize: 34, fontWeight: '900', color: '#fff', lineHeight: 40, marginBottom: 10 },
    heroTitle2: { color: 'rgba(255,255,255,0.7)' },
    heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 22, marginBottom: 28 },
    heroStats: { flexDirection: 'row', gap: 16 },
    heroStat: { alignItems: 'center' },
    heroStatVal: { fontSize: 22, fontWeight: '900', color: '#fff' },
    heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
    heroDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', height: 36, alignSelf: 'center' },

    // CTA
    ctaWrap: { padding: 20 },
    ctaPrimary: {
      backgroundColor: colors.primary, borderRadius: 16,
      padding: 17, alignItems: 'center', marginBottom: 10,
      ...SHADOW, shadowColor: colors.primary, shadowOpacity: 0.3,
    },
    ctaSecondary: {
      backgroundColor: colors.surface, borderRadius: 16,
      padding: 15, alignItems: 'center',
      borderWidth: 1.5, borderColor: colors.border,
    },

    // Progress card (shown after first use)
    progressCard: {
      margin: 20, marginTop: 0,
      backgroundColor: colors.surface, borderRadius: 20,
      borderWidth: 1, borderColor: colors.border,
      padding: 18, ...SHADOW,
    },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
    progressTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
    progressScore: { fontSize: 32, fontWeight: '900', color: colors.primary, lineHeight: 36 },
    triBar: { height: 8, borderRadius: 4, overflow: 'hidden', flexDirection: 'row', gap: 1, marginBottom: 12 },
    ampelRow: { flexDirection: 'row', gap: 8 },
    ampelChip: {
      flex: 1, backgroundColor: colors.elevated, borderRadius: 10,
      padding: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    },

    // Section
    sectionLabel: {
      fontSize: 11, fontWeight: '700', color: colors.textMuted,
      letterSpacing: 1.3, paddingHorizontal: 20, marginBottom: 12,
    },

    // Feature grid
    featureGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 10, marginBottom: 24 },
    featureCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.surface, borderRadius: 16,
      borderWidth: 1, borderColor: colors.border,
      padding: 16, ...SHADOW,
    },
    featureIcon: { fontSize: 26, marginBottom: 10 },
    featureTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4 },
    featureDesc: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },

    // Quick modes
    modeCard: {
      backgroundColor: colors.surface, borderRadius: 14,
      borderWidth: 1, borderColor: colors.border,
      padding: 14, marginBottom: 8,
      flexDirection: 'row', alignItems: 'center', gap: 12,
      ...SHADOW,
    },
    modeIcon: {
      width: 42, height: 42, borderRadius: 11,
      backgroundColor: colors.elevated,
      alignItems: 'center', justifyContent: 'center',
    },

    // Footer note
    footer: {
      margin: 20, marginTop: 4,
      padding: 16, backgroundColor: colors.elevated,
      borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    },
  });

  const gPct = (amp.gruen / 2413) * 100;
  const yPct = (amp.gelb / 2413) * 100;
  const rPct = ((amp.rot || 0) / 2413) * 100;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <View style={s.hero}>
          <Text style={s.heroEyebrow}>FÜHRERSCHEIN THEORIE</Text>
          <Text style={s.heroTitle}>
            Lern smarter.{'\n'}
            <Text style={s.heroTitle2}>Besteh sicher.</Text>
          </Text>
          <Text style={s.heroSub}>
            2.413 offizielle Fragen · 5 Sprachen · echte Verkehrsfotos · Prüfungssimulation
          </Text>
          <View style={s.heroStats}>
            <View style={s.heroStat}>
              <Text style={s.heroStatVal}>2.413</Text>
              <Text style={s.heroStatLabel}>Fragen</Text>
            </View>
            <View style={s.heroDivider} />
            <View style={s.heroStat}>
              <Text style={s.heroStatVal}>769</Text>
              <Text style={s.heroStatLabel}>Fotos</Text>
            </View>
            <View style={s.heroDivider} />
            <View style={s.heroStat}>
              <Text style={s.heroStatVal}>5</Text>
              <Text style={s.heroStatLabel}>Sprachen</Text>
            </View>
            <View style={s.heroDivider} />
            <View style={s.heroStat}>
              <Text style={s.heroStatVal}>Klasse B</Text>
              <Text style={s.heroStatLabel}>& A</Text>
            </View>
          </View>
        </View>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <View style={s.ctaWrap}>
          <TouchableOpacity
            style={s.ctaPrimary}
            onPress={() => navigation.navigate('MultipleChoice', {})}
            activeOpacity={0.88}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.2 }}>
              {hasStarted ? 'Weiterlernen →' : 'Jetzt starten →'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.ctaSecondary}
            onPress={() => navigation.navigate('ExamSession')}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
              Prüfungssimulation starten
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── PROGRESS (nur wenn bereits gelernt wurde) ─────────────────── */}
        {hasStarted && (
          <>
            <Text style={s.sectionLabel}>DEIN FORTSCHRITT</Text>
            <View style={s.progressCard}>
              <View style={s.progressHeader}>
                <View>
                  <Text style={s.progressTitle}>Prüfungsbereitschaft</Text>
                  <Text style={s.progressScore}>{readiness}%</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>Level {xp.level} {level?.icon}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 3 }}>
                    {xp.total} XP
                  </Text>
                  {xp.streak > 0 && (
                    <Text style={{ fontSize: 12, color: '#F59E0B', marginTop: 3 }}>
                      🔥 {xp.streak} Tage
                    </Text>
                  )}
                </View>
              </View>

              <View style={s.triBar}>
                {gPct > 0 && <View style={{ width: `${gPct}%` as any, backgroundColor: colors.success, borderRadius: 4 }} />}
                {yPct > 0 && <View style={{ width: `${yPct}%` as any, backgroundColor: colors.warning }} />}
                {rPct > 0 && <View style={{ width: `${rPct}%` as any, backgroundColor: colors.danger, opacity: 0.5 }} />}
                <View style={{ flex: 1, backgroundColor: colors.border }} />
              </View>

              <View style={s.ampelRow}>
                {[
                  { val: amp.gruen, label: '🟢 Grün',   col: colors.success },
                  { val: amp.gelb,  label: '🟡 Gelb',   col: colors.warning },
                  { val: today.answered, label: '📅 Heute', col: colors.primary },
                ].map(item => (
                  <View key={item.label} style={s.ampelChip}>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: item.col }}>{item.val}</Text>
                    <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>WAS DICH ERWARTET</Text>
        <View style={s.featureGrid}>
          {FEATURES.map(f => (
            <View key={f.title} style={s.featureCard}>
              <Text style={s.featureIcon}>{f.icon}</Text>
              <Text style={s.featureTitle}>{f.title}</Text>
              <Text style={s.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── QUICK MODES ──────────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>LERNMODI</Text>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          {[
            { icon: '⚡', title: 'Turbomodus',      sub: 'Nur nicht gelernte Fragen',    screen: 'MultipleChoice', badge: 'Empfohlen', badgeCol: colors.success },
            { icon: '🎯', title: 'Multiple Choice', sub: 'Alle Fragen mit Bildern',      screen: 'MultipleChoice' },
            { icon: '⏱️', title: 'Speed Round',     sub: '60 Sekunden · so viele wie möglich', screen: 'SpeedRound' },
            { icon: '🃏', title: 'Memory Match',    sub: 'Begriffe und Antworten paaren', screen: 'MemoryMatch' },
          ].map(m => (
            <TouchableOpacity
              key={m.title}
              style={s.modeCard}
              onPress={() => navigation.navigate(m.screen, {})}
              activeOpacity={0.8}
            >
              <View style={s.modeIcon}>
                <Text style={{ fontSize: 20 }}>{m.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{m.title}</Text>
                  {m.badge && (
                    <View style={{ backgroundColor: (m.badgeCol || colors.primary) + '18', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 9, fontWeight: '800', color: m.badgeCol || colors.primary }}>
                        {m.badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>{m.sub}</Text>
              </View>
              <Text style={{ fontSize: 16, color: colors.textLight }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── FOOTER NOTE ──────────────────────────────────────────────── */}
        <View style={s.footer}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 4 }}>
            📌 Hinweis
          </Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, lineHeight: 18 }}>
            FahrProfi verwendet öffentlich zugängliche Übungsfragen. Für die offizielle Prüfung werden TÜV/DEKRA-lizenzierte Fragen empfohlen.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
