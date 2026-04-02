import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const u = await AsyncStorage.getItem('user');
    setUser(JSON.parse(u));
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 My Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user?.phone}</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role}</Text>
        {user?.skill && <>
          <Text style={styles.label}>Skill</Text>
          <Text style={styles.value}>{user?.skill}</Text>
        </>}
        <Text style={styles.label}>Rating</Text>
        <Text style={styles.value}>⭐ {user?.rating || 0} / 5</Text>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E65100', marginTop: 50, marginBottom: 20 },
  card: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 10 },
  label: { fontSize: 12, color: '#999', marginTop: 10 },
  value: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#333', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});