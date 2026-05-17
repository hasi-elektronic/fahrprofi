import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function ExamScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const modes = [
    { icon: '📝', title: 'Prüfungssimulation', desc: '30 Fragen · TÜV/DEKRA Format · Zeitlimit', screen: 'ExamSession', color: colors.primary },
    { icon: '🎯', title: 'Schnelltest', desc: '10 Zufallsfragen · kein Zeitlimit', screen: 'ExamSession', color: colors.success },
    { icon: '❌', title: 'Fehlerfragen', desc: 'Nur falsch beantwortete Fragen wiederholen', screen: 'ExamSession', color: colors.danger },
  ];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 20 },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 10, marginBottom: 6 },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 28 },
    card: {
      backgroundColor: colors.card, borderRadius: 20,
      borderWidth: 1, borderColor: colors.border,
      padding: 20, marginBottom: 16,
      flexDirection: 'row', alignItems: 'center',
    },
    cardIcon: { fontSize: 36, marginRight: 16 },
    cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
    cardDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
    badge: {
      position: 'absolute', right: 16, top: 16,
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={s.container}>
        <Text style={s.title}>📝 Prüfung</Text>
        <Text style={s.subtitle}>Teste dein Wissen</Text>
        {modes.map((mode, i) => (
          <TouchableOpacity
            key={i}
            style={s.card}
            onPress={() => navigation.navigate(mode.screen)}
            activeOpacity={0.8}
          >
            <Text style={s.cardIcon}>{mode.icon}</Text>
            <View>
              <Text style={s.cardTitle}>{mode.title}</Text>
              <Text style={s.cardDesc}>{mode.desc}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: mode.color + '22' }]}>
              <Text style={{ fontSize: 16, color: mode.color }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ marginTop: 20, padding: 16, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 }}>ℹ️ Prüfungsformat (TÜV/DEKRA)</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
            • 30 Fragen aus allen Themen{'\n'}
            • Max. 10 Fehlerpunkte erlaubt{'\n'}
            • Mehrfachauswahl möglich{'\n'}
            • Klasse B: 2, 3, 4 oder 5 Punkte pro Frage
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
