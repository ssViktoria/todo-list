import { Platform } from 'react-native';
import type { Todo } from '../types';

// IP-адреса для локального сервера
// Android Емулятор використовує 10.0.2.2, iOS — localhost
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${BASE_URL}/todos`);
  if (!response.ok) throw new Error('Не вдалося завантажити список');
  return response.json();
}

export async function addTodo(text: string): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      completed: false,
      createdAt: Date.now(),
    }),
  });
  if (!response.ok) throw new Error('Не вдалося створити завдання');
  return response.json();
}

export async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error('Не вдалося оновити статус');
  return response.json();
}

export async function updateTodoText(id: string, text: string): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Не вдалося оновити текст');
  return response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Не вдалося видалити завдання');
}