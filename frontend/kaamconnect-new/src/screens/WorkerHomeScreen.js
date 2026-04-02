import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://10.145.100.239:5000/api';

export default function WorkerHomeScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    fetchJobs();
  }, []);

  const loadUser = async () => {
    const u = await AsyncStorage.getItem('user');
    setUser(JSON.parse(u));
  };

  const fetchJobs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API}/jobs/nearby`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const acceptJob = async (jobId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API}/jobs/${jobId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Job accepted!');
      navigation.navigate('Chat', { jobId });
    } catch (err) {
      Alert.alert('Error', 'Could not accept job');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👷 Worker Dashboard</Text>
      <Text style={styles.subtitle}>Available Jobs Near You</Text>
      {jobs.length === 0 && (
        <Text style={styles.noJobs}>No jobs available right now</Text>
      )}
      {jobs.map(job => (
        <View key={job._id} style={styles.card}>
          <Text style={styles.skill}>{job.skill}</Text>
          <Text style={styles.desc}>{job.description}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => acceptJob(job._id)}>
            <Text style={styles.btnText}>Accept Job</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.profileBtn}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.profileText}>My Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E65100', marginTop: 50 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  noJobs: { textAlign: 'center', color: '#999', marginTop: 50, fontSize: 16 },
  card: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15 },
  skill: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  desc: { fontSize: 14, color: '#666', marginVertical: 8 },
  btn: { backgroundColor: '#E65100', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  profileBtn: { backgroundColor: '#333', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  profileText: { color: '#fff', fontWeight: 'bold' },
});