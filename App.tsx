import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import HomeScreen from './app/tabs/HomeScreen';
import LearnScreen from './app/tabs/LearnScreen';
import ExamScreen from './app/tabs/ExamScreen';
import StatsScreen from './app/tabs/StatsScreen';
import SettingsScreen from './app/tabs/SettingsScreen';
import FlashcardScreen from './app/modals/FlashcardScreen';
import SwipeScreen from './app/modals/SwipeScreen';
import TopicScreen from './app/modals/TopicScreen';
import ExamSessionScreen from './app/modals/ExamSessionScreen';
import MultipleChoiceScreen from './app/modals/MultipleChoiceScreen';
import SpeedRoundScreen from './app/modals/SpeedRoundScreen';
import MemoryMatchScreen from './app/modals/MemoryMatchScreen';
import PruefungsampelScreen from './app/modals/PruefungsampelScreen';
import FragenlisteScreen from './app/modals/FragenlisteScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: 8, paddingTop: 6, height: 70 },
      tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      tabBarIcon: ({ focused }) => {
        const icons: { [key: string]: string } = { Home: '🏠', Learn: '📚', Exam: '📝', Stats: '📊', Settings: '⚙️' };
        return <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6 }}>{icons[route.name]}</Text>;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Start' }} />
      <Tab.Screen name="Learn" component={LearnScreen} options={{ tabBarLabel: 'Lernen' }} />
      <Tab.Screen name="Exam" component={ExamScreen} options={{ tabBarLabel: 'Prüfung' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: 'Statistik' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Einstellung' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { colors, isDark } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Swipe" component={SwipeScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Topic" component={TopicScreen} />
        <Stack.Screen name="ExamSession" component={ExamSessionScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="MultipleChoice" component={MultipleChoiceScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="SpeedRound" component={SpeedRoundScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="MemoryMatch" component={MemoryMatchScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Pruefungsampel" component={PruefungsampelScreen} />
        <Stack.Screen name="Fragenliste" component={FragenlisteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider><LanguageProvider><AppNavigator /></LanguageProvider></ThemeProvider>
    </SafeAreaProvider>
  );
}
