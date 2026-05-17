import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { TOPICS, SAMPLE_QUESTIONS } from '../../data/questions';
import { useLanguage } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function LearnScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, paddingBottom: 8 },
    title: { fontSize: 26, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    scroll: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
    topicCard: {
      backgroundColor: colors.card, borderRadius: 16,
      borderWidth: 1, borderColor: colors.border,
      padding: 18, marginBottom: 12,
      flexDirection: 'row', alignItems: 'center',
    },
    topicLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    topicIcon: {
      width: 48, height: 48, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.border, marginRight: 14,
    },
    topicEmoji: { fontSize: 24 },
    topicName: { fontSize: 16, fontWeight: '700', color: colors.text },
    topicCount: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    topicArrow: { fontSize: 18, color: colors.textMuted },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>📚 Lernen</Text>
        <Text style={s.subtitle}>Wähle ein Thema</Text>
      </View>
      <ScrollView style={s.scroll}>
        {TOPICS.map((topic) => {
          const count = SAMPLE_QUESTIONS.filter((q) => q.topic === topic.id).length;
          return (
            <TouchableOpacity
              key={topic.id}
              style={s.topicCard}
              onPress={() => navigation.navigate('Topic', { topicId: topic.id })}
              activeOpacity={0.8}
            >
              <View style={s.topicLeft}>
                <View style={[s.topicIcon, { backgroundColor: topic.color + '22' }]}>
                  <Text style={s.topicEmoji}>{topic.icon}</Text>
                </View>
                <View>
                  <Text style={s.topicName}>{t(topic.label)}</Text>
                  <Text style={s.topicCount}>{count} Fragen</Text>
                </View>
              </View>
              <Text style={s.topicArrow}>›</Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
