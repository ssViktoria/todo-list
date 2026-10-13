import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from 'convex/react';

import { Header } from '../components/Header';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { useTheme } from '../context/ThemeContext';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export default function Index() {
  const { colors } = useTheme();

  // Підписка на дані Convex у реальному часі
  const rawTodos = useQuery(api.todos.getTodos);

  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  // _id -> id, isCompleted -> completed
  const todos = useMemo(() => {
    if (!rawTodos) return [];
    return rawTodos.map((item) => ({
      id: item._id,
      text: item.text,
      completed: item.isCompleted,
      createdAt: item.createdAt,
    }));
  }, [rawTodos]);

  const showError = (message: string, err: unknown) => {
    console.error(err);
    // Alert.alert не працює на вебі, тому там використовуємо window.alert
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Помилка', message);
    }
  };

  const handleAdd = async (text: string) => {
    try {
      await createTodo({ text });
    } catch (err) {
      showError('Не вдалося створити завдання.', err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo({ id: id as Id<'todos'> });
    } catch (err) {
      showError('Не вдалося оновити статус завдання.', err);
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      await updateTodo({ id: id as Id<'todos'>, text });
    } catch (err) {
      showError('Не вдалося оновити текст завдання.', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({ id: id as Id<'todos'> });
    } catch (err) {
      showError('Не вдалося видалити завдання.', err);
    }
  };

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  const isLoading = rawTodos === undefined;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Header totalCount={todos.length} completedCount={completedCount} />

          <TodoForm onAdd={handleAdd} loading={isLoading} />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                Завантаження...
              </Text>
            </View>
          ) : (
            <View style={styles.listWrapper}>
              <TodoList
                todos={todos}
                refreshing={false}
                onRefresh={async () => {}}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  card: { flex: 1, padding: 20 },
  listWrapper: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});