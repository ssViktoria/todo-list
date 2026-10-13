import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.users.currentUser);

  // <Unauthenticated> лише міняє стек, але адреса лишається /settings,
  // тому після виходу переходимо на екран входу вручну.
  const doSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in' as any);
    } catch (e) {
      console.error('Sign out failed', e);
    }
  };

  const handleSignOut = () => {
    // На вебі Alert.alert не показує діалог, тому використовуємо window.confirm
    if (Platform.OS === 'web') {
      if (window.confirm('Ви впевнені, що хочете вийти з додатку?')) {
        doSignOut();
      }
      return;
    }

    Alert.alert('Вихід з акаунта', 'Ви впевнені, що хочете вийти з додатку?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Вийти', style: 'destructive', onPress: doSignOut },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Налаштування ⚙️
        </Text>

        {/* Блок профілю користувача та виходу */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
          Профіль користувача
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <View style={styles.userRow}>
            <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name ?? 'Користувач'}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>
                {user?.email ?? 'Завантаження...'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.5}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Вийти з акаунта"
            >
              <MaterialIcons name="logout" size={24} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Блок зміни теми */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
          Зовнішній вигляд
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name={isDarkMode ? 'moon-outline' : 'sunny-outline'}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.rowText, { color: colors.text }]}>
                {isDarkMode ? 'Темна тема' : 'Світла тема'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Блок інформації про додаток */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>
          Про додаток
        </Text>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowText, { color: colors.text }]}>Версія</Text>
            <Text style={{ color: colors.textMuted, fontWeight: '600' }}>
              v3.0.0 (Auth)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowText: { fontSize: 16, marginLeft: 12, fontWeight: '500' },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
  },
  signOutButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
});