import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, LANGUAGE_NAMES } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import type { Language } from '../../data/questions';

const LANGUAGES: Language[] = ['de', 'tr', 'en', 'ar', 'ru'];

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { resetProgress } = useProgress();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20 },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 24 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 10 },
    card: {
      backgroundColor: colors.card, borderRadius: 16,
      borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    },
    row: {
      flexDirection: 'row', alignItems: 'center',
      padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    rowLast: { borderBottomWidth: 0 },
    rowIcon: { fontSize: 20, marginRight: 12 },
    rowText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
    rowValue: { fontSize: 14, color: colors.textSecondary },
    toggle: {
      width: 48, height: 28, borderRadius: 14,
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
    langBtn: {
      padding: 12, borderRadius: 10, marginBottom: 8,
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 2,
    },
    langText: { fontSize: 15, fontWeight: '600', marginLeft: 8 },
    dangerBtn: {
      backgroundColor: 'rgba(248,81,73,0.1)', borderRadius: 12,
      padding: 16, borderWidth: 1, borderColor: colors.danger,
      alignItems: 'center',
    },
    version: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: 16 },
  });

  const handleReset = () => {
    Alert.alert(
      'Fortschritt zurücksetzen',
      'Alle Lernfortschritte werden gelöscht. Fortfahren?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zurücksetzen', style: 'destructive', onPress: resetProgress },
      ]
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView style={s.scroll}>
        <Text style={s.title}>⚙️ Einstellungen</Text>

        {/* Appearance */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>DARSTELLUNG</Text>
          <View style={s.card}>
            <View style={s.row}>
              <Text style={s.rowIcon}>{isDark ? '🌙' : '☀️'}</Text>
              <Text style={s.rowText}>Dark Mode</Text>
              <TouchableOpacity
                style={[s.toggle, { backgroundColor: isDark ? colors.primary : colors.border }]}
                onPress={toggleTheme}
              >
                <View style={[s.toggleThumb, { alignSelf: isDark ? 'flex-end' : 'flex-start' }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>SPRACHE / DİL / ЯЗЫК</Text>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[s.langBtn, {
                borderColor: language === lang ? colors.primary : colors.border,
                backgroundColor: language === lang ? colors.primary + '15' : colors.card,
              }]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={{ fontSize: 20 }}>{LANGUAGE_NAMES[lang].split(' ')[0]}</Text>
              <Text style={[s.langText, { color: language === lang ? colors.primary : colors.text }]}>
                {LANGUAGE_NAMES[lang].split(' ').slice(1).join(' ')}
              </Text>
              {language === lang && <Text style={{ marginLeft: 'auto', color: colors.primary, fontWeight: '900' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>ÜBER DIE APP</Text>
          <View style={s.card}>
            {[
              { icon: '🚗', label: 'App Name', value: 'FahrProfi' },
              { icon: '📦', label: 'Version', value: '1.0.0 MVP' },
              { icon: '📚', label: 'Fragen', value: '5 (1300+ coming)' },
              { icon: '🌍', label: 'Sprachen', value: '5' },
            ].map((item, i, arr) => (
              <View key={item.label} style={[s.row, i === arr.length - 1 && s.rowLast]}>
                <Text style={s.rowIcon}>{item.icon}</Text>
                <Text style={s.rowText}>{item.label}</Text>
                <Text style={s.rowValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>DATEN</Text>
          <TouchableOpacity style={s.dangerBtn} onPress={handleReset}>
            <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>
              🗑️ Fortschritt zurücksetzen
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>FahrProfi v1.0 · Made by Hasi Elektronic 🚗</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
