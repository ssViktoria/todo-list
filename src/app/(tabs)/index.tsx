import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

export default function TasksScreen() {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState('');

  // Завдання з Convex: оновлюються в реальному часі, прив'язані до користувача
  const todos = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const showError = (message: string, err: unknown) => {
    console.error(err);
    // Alert.alert не працює на вебі
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Помилка', message);
    }
  };

  const handleAdd = async () => {
    const text = inputText.trim();
    if (!text) return;
    try {
      await createTodo({ text });
      setInputText('');
    } catch (err) {
      showError('Не вдалося створити завдання.', err);
    }
  };

  const handleToggle = async (id: Id<'todos'>) => {
    try {
      await toggleTodo({ id });
    } catch (err) {
      showError('Не вдалося оновити завдання.', err);
    }
  };

  const handleDelete = async (id: Id<'todos'>) => {
    try {
      await deleteTodo({ id });
    } catch (err) {
      showError('Не вдалося видалити завдання.', err);
    }
  };

  const isLoading = todos === undefined;
  const completedCount = todos?.filter((t) => t.isCompleted).length ?? 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Мої Завдання 📝
          </Text>
          {!isLoading && todos.length > 0 && (
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Виконано {completedCount} з {todos.length}
            </Text>
          )}
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Що потрібно зробити?"
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={handleAdd}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  Список завдань порожній. Додайте перше завдання!
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.todoCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleToggle(item._id)}
                  style={styles.todoContent}
                >
                  <Ionicons
                    name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={item.isCompleted ? colors.success : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.todoText,
                      { color: item.isCompleted ? colors.textMuted : colors.text },
                      item.isCompleted && styles.completedText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item._id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={22} color={colors.danger} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  form: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    fontSize: 16,
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 20 },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  todoContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  todoText: { fontSize: 16, marginLeft: 12, flex: 1 },
  completedText: { textDecorationLine: 'line-through' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, textAlign: 'center' },
});