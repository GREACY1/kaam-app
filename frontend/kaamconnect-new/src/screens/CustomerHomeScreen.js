import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = 'http://10.145.100.239:5000/api';

export default function CustomerHomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadUser();
    fetchMyJobs();
  }, []);

  const loadUser = async () => {
    const u = await AsyncStorage.getItem('user');
    setUser(JSON.parse(u));
  };

  const fetchMyJobs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API}/jobs/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Customer Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {user?.name || 'Customer'}!</Text>

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

      <Text style={styles.sectionTitle}>My Jobs</Text>
      {jobs.length === 0 && (
        <Text style={styles.noJobs}>No jobs yet</Text>
      )}
      {jobs.map(job => (
        <View key={job._id} style={styles.jobCard}>
          <Text style={styles.skill}>{job.skill}</Text>
          <Text style={styles.status}>Status: {job.status}</Text>
          {(job.status === 'accepted' || job.status === 'completed') && (
            <TouchableOpacity style={styles.chatBtn}
              onPress={() => navigation.navigate('Chat', { jobId: job._id })}>
              <Text style={styles.chatText}>💬 Open Chat</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
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
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  noJobs: { textAlign: 'center', color: '#999', fontSize: 16 },
  jobCard: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15 },
  skill: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  status: { fontSize: 14, color: '#666', marginVertical: 5 },
  chatBtn: { backgroundColor: '#E65100', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  chatText: { color: '#fff', fontWeight: 'bold' },
});