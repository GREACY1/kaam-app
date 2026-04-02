import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomerHomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const u = await AsyncStorage.getItem('user');
    setUser(JSON.parse(u));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Customer Dashboard</Text>
      <Text style={styles.subtitle}>
        Welcome, {user?.name || 'Customer'}!
      </Text>

      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate('PostJob')}>
        <Text style={styles.cardIcon}>🔧</Text>
        <Text style={styles.cardTitle}>Post a Job</Text>
        <Text style={styles.cardDesc}>Find a worker near you</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.cardIcon}>👤</Text>
        <Text style={styles.cardTitle}>My Profile</Text>
        <Text style={styles.cardDesc}>View your profile and ratings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E65100', marginTop: 50 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  card: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  cardIcon: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 5 },
});