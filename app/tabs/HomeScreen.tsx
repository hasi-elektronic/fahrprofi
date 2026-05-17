import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProgress } from '../../hooks/useProgress';
import { useXP, LEVEL_NAMES } from '../../hooks/useXP';
import { SAMPLE_QUESTIONS } from '../../data/questions';

const { width } = Dimensions.get('window');

const TOPIC_META = [
  {id:'gefahrenlehre',icon:'⚠️',total:519,gruen:40,gelb:80},
  {id:'verhalten',    icon:'🚦',total:804,gruen:104,gelb:200},
  {id:'vorfahrt',     icon:'↗️',total:54, gruen:20, gelb:14},
  {id:'verkehrszeichen',icon:'🚧',total:231,gruen:51,gelb:80},
  {id:'umwelt',       icon:'🌿',total:99, gruen:29, gelb:30},
  {id:'technik',      icon:'⚙️',total:689,gruen:100,gelb:189},
];

const SHADOW = {
  shadowColor:'#1E3A5F', shadowOffset:{width:0,height:2},
  shadowOpacity:0.08, shadowRadius:8, elevation:3,
};

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getStats } = useProgress();
  const { xp } = useXP();
  const stats = getStats();
  const streak = xp.streak;

  const s = StyleSheet.create({
    container: { flex:1, backgroundColor: colors.background },
    scroll: { paddingBottom: 32 },
    header: { paddingHorizontal:20, paddingTop:8, paddingBottom:20 },
    greeting: { fontSize:26, fontWeight:'700', color:colors.text, lineHeight:32, marginBottom:4 },
    subtitle: { fontSize:14, color:colors.textSecondary },
    statusRow: { flexDirection:'row', gap:10, marginBottom:20, paddingHorizontal:20 },
    xpCard: {
      flex:1, backgroundColor:colors.surface,
      borderRadius:16, padding:14, borderWidth:1, borderColor:colors.border, ...SHADOW
    },
    streakCard: {
      backgroundColor:colors.surface, borderRadius:16,
      padding:14, alignItems:'center', minWidth:76,
      borderWidth:1, borderColor:streak>0?colors.warningMid:colors.border, ...SHADOW
    },
    xpRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
    xpLabel: { fontSize:12, color:colors.textSecondary },
    xpVal: { fontSize:12, fontWeight:'700', color:colors.primary },
    xpBar: { height:4, backgroundColor:colors.border, borderRadius:2, overflow:'hidden' },
    xpFill: { height:'100%', backgroundColor:colors.primary, borderRadius:2 },
    xpHint: { fontSize:11, color:colors.textMuted, marginTop:5 },
    ampelCard: {
      backgroundColor:colors.surface, borderRadius:20,
      padding:20, marginHorizontal:20, marginBottom:20,
      borderWidth:1, borderColor:colors.border, ...SHADOW
    },
    ampelHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 },
    ampelTitle: { fontSize:18, fontWeight:'700', color:colors.text },
    ampelSub: { fontSize:12, color:colors.textSecondary, marginTop:2 },
    readyBadge: { borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
    ampelBar: { height:8, borderRadius:4, overflow:'hidden', flexDirection:'row', gap:2, marginBottom:16 },
    ampelGrid: { flexDirection:'row' },
    ampelCell: { flex:1, alignItems:'center', paddingVertical:10 },
    ampelVal: { fontSize:18, fontWeight:'700', marginTop:6 },
    ampelLabel: { fontSize:11, fontWeight:'600', color:colors.text, marginTop:2 },
    ampelNote: { fontSize:10, color:colors.textMuted, marginTop:1 },
    sectionLabel: {
      fontSize:11, fontWeight:'700', color:colors.textMuted,
      letterSpacing:1.3, textTransform:'uppercase',
      paddingHorizontal:20, marginBottom:12,
    },
    modesWrap: { paddingHorizontal:20, marginBottom:20 },
    featuredCard: {
      backgroundColor:colors.primary, borderRadius:18,
      padding:18, marginBottom:10, ...SHADOW,
      shadowColor:'#1E3A5F', shadowOpacity:0.2,
    },
    modeCard: {
      backgroundColor:colors.surface, borderRadius:14,
      padding:13, marginBottom:8,
      borderWidth:1, borderColor:colors.border, ...SHADOW,
      flexDirection:'row', alignItems:'center', gap:12,
    },
    modeIcon: { width:40, height:40, borderRadius:10, backgroundColor:colors.elevated, alignItems:'center', justifyContent:'center' },
    modeTitle: { fontSize:14, fontWeight:'600', color:colors.text },
    modeSub: { fontSize:12, color:colors.textSecondary, marginTop:2 },
    badge: { borderRadius:10, paddingHorizontal:8, paddingVertical:2, marginTop:2, alignSelf:'flex-start' },
    topicsWrap: { paddingHorizontal:20 },
    topicCard: {
      backgroundColor:colors.surface, borderRadius:14,
      padding:14, marginBottom:10,
      borderWidth:1, borderColor:colors.border, ...SHADOW,
    },
    topicRow: { flexDirection:'row', alignItems:'center', gap:12, marginBottom:8 },
    topicIcon: { width:38, height:38, borderRadius:10, backgroundColor:colors.elevated, alignItems:'center', justifyContent:'center' },
    topicBar: { height:4, borderRadius:2, overflow:'hidden', flexDirection:'row', gap:1 },
  });

  const total = 2413;
  const gruen = stats.learned, gelb = Math.floor(stats.correct * 0.3), rot = stats.wrong;
  const gruenP = (gruen/total)*100, gelbP = (gelb/total)*100, rotP = (rot/total)*100;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Greeting */}
        <View style={s.header}>
          <Text style={s.greeting}>Guten Morgen. 👋</Text>
          <Text style={s.subtitle}>Weiter Richtung Führerschein</Text>
        </View>

        {/* XP + Streak */}
        <View style={s.statusRow}>
          <View style={s.xpCard}>
            <View style={s.xpRow}>
              <Text style={s.xpLabel}>Level {xp.level} · {LEVEL_NAMES[xp.level]?.de}</Text>
              <Text style={s.xpVal}>{xp.xpInLevel} XP</Text>
            </View>
            <View style={s.xpBar}>
              <View style={[s.xpFill, { width: `${(xp.xpInLevel/xp.xpForNextLevel)*100}%` as any }]} />
            </View>
            <Text style={s.xpHint}>{xp.xpForNextLevel - xp.xpInLevel} XP bis Level {xp.level+1}</Text>
          </View>
          <View style={[s.streakCard, streak>0&&{backgroundColor:colors.warningLight}]}>
            <Text style={{ fontSize:22 }}>{streak>0?'🔥':'💤'}</Text>
            <Text style={{ fontSize:20, fontWeight:'700', color:streak>0?colors.warning:colors.textMuted }}>{streak}</Text>
            <Text style={{ fontSize:10, color:colors.textMuted }}>Tage</Text>
          </View>
        </View>

        {/* Prüfungsampel */}
        <View style={s.ampelCard}>
          <View style={s.ampelHeader}>
            <View>
              <Text style={s.ampelTitle}>Prüfungsampel</Text>
              <Text style={s.ampelSub}>Deine Prüfungsbereitschaft</Text>
            </View>
            <View style={[s.readyBadge, {backgroundColor:colors.successLight, borderWidth:1, borderColor:colors.successMid}]}>
              <Text style={{ fontSize:12, fontWeight:'600', color:colors.success }}>In Bearbeitung</Text>
            </View>
          </View>

          <View style={s.ampelBar}>
            {gruenP > 0 && <View style={{ width:`${gruenP}%` as any, backgroundColor:colors.success, borderRadius:4 }}/>}
            {gelbP > 0 && <View style={{ width:`${gelbP}%` as any, backgroundColor:colors.warning, borderRadius:4 }}/>}
            {rotP > 0  && <View style={{ width:`${rotP}%` as any, backgroundColor:colors.danger, borderRadius:4 }}/>}
            <View style={{ flex:1, backgroundColor:colors.border, borderRadius:4 }}/>
          </View>

          <View style={s.ampelGrid}>
            {[
              {emoji:'🟢',val:gruen||0,label:'Grün',note:'Prüfungsreif',col:colors.success},
              {emoji:'🟡',val:gelb||0, label:'Gelb', note:'1× richtig',  col:colors.warning},
              {emoji:'🔴',val:rot||0,  label:'Rot',  note:'Nicht gekonnt',col:colors.danger},
              {emoji:'⬜',val:total-(gruen+gelb+rot), label:'Neu', note:'Unbearbeitet', col:colors.textMuted},
            ].map((item, i) => (
              <View key={item.label} style={[s.ampelCell, i>0&&{borderLeftWidth:1,borderLeftColor:colors.border}]}>
                <Text style={{ fontSize:16 }}>{item.emoji}</Text>
                <Text style={[s.ampelVal, {color:item.col}]}>{item.val}</Text>
                <Text style={s.ampelLabel}>{item.label}</Text>
                <Text style={s.ampelNote}>{item.note}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Modes */}
        <Text style={s.sectionLabel}>Lernmodi</Text>
        <View style={s.modesWrap}>
          {/* Featured */}
          <TouchableOpacity style={s.featuredCard} onPress={() => navigation.navigate('MultipleChoice', {})} activeOpacity={0.9}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:14 }}>
              <View style={{ width:46, height:46, borderRadius:14, backgroundColor:'rgba(255,255,255,0.15)', alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontSize:22 }}>⚡</Text>
              </View>
              <View style={{ flex:1 }}>
                <View style={{ flexDirection:'row', gap:8, alignItems:'center', marginBottom:3 }}>
                  <Text style={{ fontSize:15, fontWeight:'700', color:'#fff' }}>Turbomodus</Text>
                  <View style={{ backgroundColor:'rgba(255,255,255,0.2)', borderRadius:10, paddingHorizontal:8, paddingVertical:2 }}>
                    <Text style={{ fontSize:9, fontWeight:'700', color:'#fff', letterSpacing:0.5 }}>EMPFOHLEN</Text>
                  </View>
                </View>
                <Text style={{ fontSize:12, color:'rgba(255,255,255,0.65)' }}>Nur nicht gelernte Fragen · schnellster Weg</Text>
              </View>
              <Text style={{ fontSize:18, color:'rgba(255,255,255,0.4)' }}>›</Text>
            </View>
          </TouchableOpacity>

          {[
            {icon:'🎯',title:'Multiple Choice',sub:'Mit Bildern · Erklärungen · XP verdienen', screen:'MultipleChoice'},
            {icon:'🃏',title:'Karteikarten',sub:'Spaced Repetition · SM-2 Algorithmus', screen:'Flashcard', params:{questions:SAMPLE_QUESTIONS}},
            {icon:'⏱️',title:'Speed Round',sub:'60 Sekunden · so viele wie möglich', screen:'SpeedRound', badge:'Neu'},
            {icon:'🃏',title:'Memory Match',sub:'Begriffe und Antworten paaren', screen:'MemoryMatch'},
          ].map(m => (
            <TouchableOpacity key={m.title} style={s.modeCard}
              onPress={() => navigation.navigate(m.screen, m.params||{})} activeOpacity={0.8}>
              <View style={s.modeIcon}><Text style={{ fontSize:20 }}>{m.icon}</Text></View>
              <View style={{ flex:1 }}>
                <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                  <Text style={s.modeTitle}>{m.title}</Text>
                  {m.badge && (
                    <View style={[s.badge, {backgroundColor:colors.primaryLight}]}>
                      <Text style={{ fontSize:9, fontWeight:'700', color:colors.primary }}>{m.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={s.modeSub}>{m.sub}</Text>
              </View>
              <Text style={{ fontSize:16, color:colors.textLight }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Topics */}
        <Text style={s.sectionLabel}>Nach Thema</Text>
        <View style={s.topicsWrap}>
          {TOPIC_META.map(tp => {
            const gP = (tp.gruen/tp.total)*100;
            const yP = (tp.gelb/tp.total)*100;
            return (
              <TouchableOpacity key={tp.id} style={s.topicCard}
                onPress={() => navigation.navigate('MultipleChoice', { topic: tp.id })} activeOpacity={0.8}>
                <View style={s.topicRow}>
                  <View style={s.topicIcon}><Text style={{ fontSize:18 }}>{tp.icon}</Text></View>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:14, fontWeight:'600', color:colors.text }}>{tp.id}</Text>
                    <Text style={{ fontSize:11, color:colors.textMuted }}>{tp.total} Fragen</Text>
                  </View>
                  <Text style={{ fontSize:15, fontWeight:'700', color:gP>30?colors.success:gP>10?colors.warning:colors.danger }}>
                    {Math.round(gP)}%
                  </Text>
                </View>
                <View style={s.topicBar}>
                  {gP>0&&<View style={{ width:`${gP}%` as any, backgroundColor:colors.success, borderRadius:2 }}/>}
                  {yP>0&&<View style={{ width:`${yP}%` as any, backgroundColor:colors.warning, borderRadius:2 }}/>}
                  <View style={{ flex:1, backgroundColor:colors.danger, opacity:0.4, borderRadius:2 }}/>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
