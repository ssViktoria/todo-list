import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTodos } from '../../context/TodoContext';

export default function StatsScreen() {
  const { colors } = useTheme();
  const { todos } = useTodos();

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Аналітика Продуктивності 📊
        </Text>

        <View style={styles.grid}>
          {/* Всього завдань */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="list-outline" size={32} color={colors.primary} />
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {total}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Всього завдань
            </Text>
          </View>

          {/* В процесі */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="time-outline" size={32} color="#f59e0b" />
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {pending}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              В процесі
            </Text>
          </View>

          {/* Виконано */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={32}
              color={colors.success}
            />
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {completed}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Виконано
            </Text>
          </View>

          {/* Прогрес */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="analytics-outline"
              size={32}
              color={colors.primary}
            />
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {progressPercent}%
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Прогрес
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardValue: { fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  cardLabel: { fontSize: 14, textAlign: 'center' },
});