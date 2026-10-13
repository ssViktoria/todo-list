import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    if (editText !== todo.text) {
      await onEdit(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
        onPress={() => onToggle(todo.id, !todo.completed)}
      >
        {todo.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleSaveEdit}
          onSubmitEditing={handleSaveEdit}
          autoFocus
        />
      ) : (
        <Text
          style={[styles.text, todo.completed && styles.textCompleted]}
          onPress={() => setIsEditing(true)}
        >
          {todo.text}
        </Text>
      )}

      <View style={styles.actions}>
        {!isEditing && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editBtnText}>✎</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onDelete(todo.id)}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#6366f1",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  textCompleted: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#6366f1",
    paddingVertical: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
  },
  editBtnText: {
    color: "#64748b",
    fontSize: 16,
  },
  deleteBtnText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "bold",
  },
});