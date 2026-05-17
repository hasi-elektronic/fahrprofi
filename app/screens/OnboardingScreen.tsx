import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { completeOnboarding } from '../../utils/onboarding';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const KLASSEN = [
  { id: 'B',   icon: '🚗', title: 'Klasse B',   sub: 'PKW · Auto' },
  { id: 'B+A', icon: '🏍️', title: 'Klasse B+A', sub: 'Auto + Motorrad' },
  { id: 'A',   icon: '🏍️', title: 'Klasse A',   sub: 'Motorrad' },
] as const;

const LANGUAGES = [
  { id: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { id: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'ar', flag: '🇸🇦', label: 'العربية' },
  { id: 'ru', flag: '🇷🇺', label: 'Русский' },
] as const;

const GOALS = [
  { value: 5,  label: '5 Fragen',  sub: 'Entspannt · ~5 Min',  icon: '🌱' },
  { value: 10, label: '10 Fragen', sub: 'Solide · ~10 Min',    icon: '📖' },
  { value: 20, label: '20 Fragen', sub: 'Aktiv · ~20 Min',     icon: '🎯' },
  { value: 30, label: '30 Fragen', sub: 'Intensiv · ~30 Min',  icon: '🚀' },
];

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const { colors } = useTheme();
  const { setLanguage } = useLanguage();

  const [step, setStep] = useState(0);
  const [klasse, setKlasse] = useState<'B' | 'B+A' | 'A'>('B');
  const [lang, setLang] = useState<'de' | 'tr' | 'en' | 'ar' | 'ru'>('de');
  const [goal, setGoal] = useState(20);

  const finish = async () => {
    await completeOnboarding({ klasse, language: lang, dailyGoal: goal });
    setLanguage(lang);
    onComplete();
  };

  const SHADOW = {
    shadowColor: '#1E3A5F', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inner: { flex: 1, padding: 24 },
    progress: { flexDirection: 'row', gap: 6, marginBottom: 32 },
    dot: { height: 4, borderRadius: 2, flex: 1 },
    stepLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, lineHeight: 32, marginBottom: 6 },
    subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 28, lineHeight: 22 },
    optionCard: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: colors.surface, borderRadius: 16,
      borderWidth: 1.5, padding: 16, marginBottom: 10, ...SHADOW,
    },
    optionCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
    optionIcon: { fontSize: 28, width: 44, textAlign: 'center' },
    optionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    optionSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    checkCircle: {
      width: 22, height: 22, borderRadius: 11,
      borderWidth: 1.5, borderColor: colors.border,
      marginLeft: 'auto' as any, alignItems: 'center', justifyContent: 'center',
    },
    checkCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    bottom: {
      padding: 20, borderTopWidth: 1, borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    nextBtn: {
      backgroundColor: colors.primary, borderRadius: 14,
      padding: 16, alignItems: 'center',
    },
    nextText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    langCard: {
      width: (width - 68) / 2, padding: 14,
      backgroundColor: colors.surface, borderRadius: 14,
      borderWidth: 1.5, borderColor: colors.border,
      alignItems: 'center', gap: 6, ...SHADOW,
    },
    langCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  });

  const STEPS = [
    {
      label: 'SCHRITT 1 VON 3',
      title: 'Welche Klasse?',
      subtitle: 'Wähle deinen Führerschein',
      content: (
        <View>
          {KLASSEN.map((k) => (
            <TouchableOpacity
              key={k.id}
              style={[s.optionCard, klasse === k.id && s.optionCardActive]}
              onPress={() => setKlasse(k.id)}
              activeOpacity={0.8}
            >
              <Text style={s.optionIcon}>{k.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.optionTitle}>{k.title}</Text>
                <Text style={s.optionSub}>{k.sub}</Text>
              </View>
              <View style={[s.checkCircle, klasse === k.id && s.checkCircleActive]}>
                {klasse === k.id && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      label: 'SCHRITT 2 VON 3',
      title: 'Deine Sprache',
      subtitle: 'Alle Fragen werden übersetzt',
      content: (
        <View style={s.langGrid}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.id}
              style={[s.langCard, lang === l.id && s.langCardActive]}
              onPress={() => setLang(l.id)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 32 }}>{l.flag}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: lang === l.id ? colors.primary : colors.text }}>
                {l.label}
              </Text>
              {lang === l.id && (
                <View style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.primary }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      label: 'SCHRITT 3 VON 3',
      title: 'Tägliches Ziel',
      subtitle: 'Wie viele Fragen pro Tag?',
      content: (
        <View>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[s.optionCard, goal === g.value && s.optionCardActive]}
              onPress={() => setGoal(g.value)}
              activeOpacity={0.8}
            >
              <Text style={s.optionIcon}>{g.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.optionTitle}>{g.label}</Text>
                <Text style={s.optionSub}>{g.sub}</Text>
              </View>
              <View style={[s.checkCircle, goal === g.value && s.checkCircleActive]}>
                {goal === g.value && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
  ];

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <View style={s.container}>
      {/* Progress dots */}
      <View style={[s.progress, { paddingHorizontal: 24, paddingTop: 60 }]}>
        {STEPS.map((_, i) => (
          <View key={i} style={[s.dot, {
            backgroundColor: i <= step ? colors.primary : colors.border,
          }]} />
        ))}
      </View>

      <ScrollView style={s.inner} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Text style={{ fontSize: 28, marginBottom: 24 }}>🚗</Text>

        <Text style={s.stepLabel}>{current.label}</Text>
        <Text style={s.title}>{current.title}</Text>
        <Text style={s.subtitle}>{current.subtitle}</Text>

        {current.content}

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.nextBtn}
          onPress={isLast ? finish : () => setStep(s => s + 1)}
          activeOpacity={0.9}
        >
          <Text style={s.nextText}>
            {isLast ? 'Jetzt loslegen 🚀' : 'Weiter →'}
          </Text>
        </TouchableOpacity>

        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep(s => s - 1)}
            style={{ alignItems: 'center', marginTop: 12 }}
          >
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>← Zurück</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
