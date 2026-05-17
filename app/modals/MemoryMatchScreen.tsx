import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useXP } from '../../hooks/useXP';

const { width } = Dimensions.get('window');
const CARD_W = (width - 52) / 3;

const PAIRS = [
  { id: 1, q: 'ABS', a: 'Blockierschutz' },
  { id: 2, q: 'Rechts vor Links', a: 'Vorfahrt ohne Zeichen' },
  { id: 3, q: 'Bremsweg × 2', a: 'Bei Regen' },
  { id: 4, q: 'Winterreifen', a: 'Eis & Schneeglätte' },
  { id: 5, q: 'Defensiv fahren', a: 'Mit Fehlern rechnen' },
  { id: 6, q: 'Rundes Schild rot', a: 'Verbotszeichen' },
  { id: 7, q: 'Blaues Schild', a: 'Gebotszeichen' },
  { id: 8, q: 'Gelbes Dreieck', a: 'Warnzeichen' },
  { id: 9, q: 'Tempomat', a: 'Geschw. halten' },
];

interface Card {
  key: string;
  id: number;
  type: 'q' | 'a';
  text: string;
}

export default function MemoryMatchScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { addXP } = useXP();

  const deck = useMemo<Card[]>(() => {
    const cards: Card[] = [
      ...PAIRS.map((p) => ({ key: `q${p.id}`, id: p.id, type: 'q' as const, text: p.q })),
      ...PAIRS.map((p) => ({ key: `a${p.id}`, id: p.id, type: 'a' as const, text: p.a })),
    ];
    return cards.sort(() => Math.random() - 0.5);
  }, []);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const flip = (key: string) => {
    if (flipped.length >= 2 || matched.includes(key) || flipped.includes(key) || shaking.length > 0) return;
    const newFlipped = [...flipped, key];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped.map((k) => deck.find((c) => c.key === k)!);
      if (a.id === b.id && a.type !== b.type) {
        // Match!
        setTimeout(() => {
          const newMatched = [...matched, ...newFlipped];
          setMatched(newMatched);
          setFlipped([]);
          if (newMatched.length === deck.length) {
            setDone(true);
            const xpEarned = Math.max(20, 80 - moves * 2);
            addXP(xpEarned, 'memory_match');
          }
        }, 400);
      } else {
        setShaking(newFlipped);
        setTimeout(() => { setFlipped([]); setShaking([]); }, 700);
      }
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center' },
    closeBtn: { fontSize: 22, color: colors.primary },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: colors.text },
    statsText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
    content: { padding: 16 },
    legend: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    legendItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    card: { width: CARD_W, height: CARD_W, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 8, borderWidth: 2 },
    cardText: { fontSize: 11, fontWeight: '700', textAlign: 'center', lineHeight: 15 },
    cardBack: { fontSize: 22 },
    resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  });

  if (done) {
    const xpEarned = Math.max(20, 80 - moves * 2);
    return (
      <SafeAreaView style={s.container}>
        <View style={s.resultContainer}>
          <Text style={{ fontSize: 72, marginBottom: 16 }}>🃏</Text>
          <Text style={{ fontSize: 26, fontWeight: '900', color: colors.text, marginBottom: 8 }}>Alle gefunden!</Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 6 }}>{moves} Züge</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.primary, marginBottom: 32 }}>+{xpEarned} XP 🃏</Text>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, width: '100%', alignItems: 'center', marginBottom: 12 }} onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>Fertig ✓</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
        <Text style={s.headerTitle}>🃏 Memory Match</Text>
        <Text style={s.statsText}>{matched.length / 2}/{PAIRS.length} · {moves} Züge</Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={s.content}>
          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={s.legendText}>❓ = Frage</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#6366f1' }]} />
              <Text style={s.legendText}>💡 = Antwort</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: colors.success }]} />
              <Text style={s.legendText}>✓ = Gefunden</Text>
            </View>
          </View>

          <View style={s.grid}>
            {deck.map((card) => {
              const isFlipped = flipped.includes(card.key) || matched.includes(card.key);
              const isMatched = matched.includes(card.key);
              const isShaking = shaking.includes(card.key);

              const borderColor = isMatched ? colors.success : isFlipped ? (card.type === 'q' ? colors.primary : '#6366f1') : colors.border;
              const bgColor = isMatched ? colors.success + '22' : isFlipped ? (card.type === 'q' ? colors.primary + '22' : '#6366f122') : colors.card;

              return (
                <TouchableOpacity
                  key={card.key}
                  style={[s.card, { borderColor, backgroundColor: bgColor, opacity: isShaking ? 0.5 : 1 }]}
                  onPress={() => flip(card.key)}
                  activeOpacity={0.8}
                >
                  {isFlipped ? (
                    <>
                      <Text style={{ fontSize: 10, color: isMatched ? colors.success : card.type === 'q' ? colors.primary : '#818cf8', fontWeight: '800', marginBottom: 3 }}>
                        {card.type === 'q' ? '❓' : '💡'}
                      </Text>
                      <Text style={[s.cardText, { color: colors.text }]}>{card.text}</Text>
                    </>
                  ) : (
                    <Text style={s.cardBack}>🃏</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
