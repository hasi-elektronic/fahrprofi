import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, TextInput, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAmpel, type AmpelStatus } from '../../hooks/useAmpel';
import { useQuestions } from '../../hooks/useQuestions';

const FILTERS = [
  { id: 'all', label: 'Alle', icon: '📋' },
  { id: 'rot', label: 'Rot', icon: '🔴' },
  { id: 'gelb', label: 'Gelb', icon: '🟡' },
  { id: 'gruen', label: 'Grün', icon: '🟢' },
  { id: 'merkliste', label: 'Merkliste', icon: '📌' },
  { id: 'zahlen', label: 'Zahlen', icon: '🔢' },
] as const;

type FilterId = typeof FILTERS[number]['id'];

function AmpelDot({ ampel }: { ampel: AmpelStatus }) {
  const colors: { [key: number]: string } = { 0: '#ef4444', 1: '#f59e0b', 2: '#22c55e' };
  return (
    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors[ampel], marginTop: 4, flexShrink: 0 }} />
  );
}

export default function FragenlisteScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getAmpel, isBookmarked } = useAmpel();
  const { questions, loading } = useQuestions({ limit: 100 });

  const [filter, setFilter] = useState<FilterId>('all');
  const [search, setSearch] = useState('');

  const filtered = questions.filter((q) => {
    const ampel = getAmpel(q.id);
    const bookmarked = isBookmarked(q.id);
    if (filter === 'rot' && ampel !== 0) return false;
    if (filter === 'gelb' && ampel !== 1) return false;
    if (filter === 'gruen' && ampel !== 2) return false;
    if (filter === 'merkliste' && !bookmarked) return false;
    if (filter === 'zahlen') {
      const qText = t(q.question);
      if (!qText.match(/km\/h|Meter|Promille|Sekunde|Abstand|\d+%/i)) return false;
    }
    if (search) {
      const qText = t(q.question).toLowerCase();
      if (!qText.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      padding: 16, flexDirection: 'row', alignItems: 'center',
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { fontSize: 22, color: colors.primary, marginRight: 12 },
    headerTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.text },
    countText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
    searchBox: {
      margin: 16, marginBottom: 8,
      backgroundColor: colors.card, borderRadius: 12,
      borderWidth: 1, borderColor: colors.border,
      flexDirection: 'row', alignItems: 'center', padding: 12,
    },
    searchInput: { flex: 1, fontSize: 14, color: colors.text, marginLeft: 8 },
    filterRow: { paddingHorizontal: 16, paddingBottom: 12 },
    filterPill: {
      paddingHorizontal: 12, paddingVertical: 7,
      borderRadius: 20, borderWidth: 1,
      marginRight: 8, flexDirection: 'row', alignItems: 'center', gap: 4,
    },
    filterText: { fontSize: 12, fontWeight: '700' },
    startBtn: {
      margin: 16, marginTop: 4, padding: 14,
      backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center',
    },
    item: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
      paddingVertical: 14, paddingHorizontal: 16,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    itemText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 },
    itemMeta: { flexDirection: 'row', gap: 8, marginTop: 5 },
    metaText: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>📋 Fragenliste</Text>
        <Text style={s.countText}>{filtered.length} Fragen</Text>
      </View>

      {/* Search */}
      <View style={s.searchBox}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Suchen..."
          placeholderTextColor={colors.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: colors.textMuted, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter pills */}
      <View>
        <FlatList
          horizontal
          data={[...FILTERS]}
          contentContainerStyle={s.filterRow}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = filter === item.id;
            return (
              <TouchableOpacity
                style={[s.filterPill, {
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: isActive ? colors.primary + '22' : colors.card,
                }]}
                onPress={() => setFilter(item.id)}
              >
                <Text style={{ fontSize: 12 }}>{item.icon}</Text>
                <Text style={[s.filterText, { color: isActive ? colors.primary : colors.textSecondary }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Start button */}
      {filtered.length > 0 && (
        <TouchableOpacity
          style={s.startBtn}
          onPress={() => navigation.navigate('MultipleChoice', { preloadedQuestions: filtered })}
        >
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#000' }}>
            ▶ {filtered.length} Fragen lernen
          </Text>
        </TouchableOpacity>
      )}

      {/* Question list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const ampel = getAmpel(item.id) as AmpelStatus;
          const bookmarked = isBookmarked(item.id);
          return (
            <View style={s.item}>
              <AmpelDot ampel={ampel} />
              <View style={{ flex: 1 }}>
                <Text style={s.itemText} numberOfLines={2}>{t(item.question)}</Text>
                <View style={s.itemMeta}>
                  <Text style={s.metaText}>{item.id}</Text>
                  <Text style={[s.metaText, { color: colors.primary }]}>{item.points} Pkt</Text>
                  <Text style={s.metaText}>{item.topic}</Text>
                  {bookmarked && <Text style={{ fontSize: 10 }}>📌</Text>}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>📭</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
              Keine Fragen gefunden
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
