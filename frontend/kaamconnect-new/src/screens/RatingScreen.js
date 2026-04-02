import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://10.145.100.239:5000/api';

export default function RatingScreen({ route, navigation }) {
  const { jobId } = route.params;
  const [rating, setRating] = useState(0);

  const submitRating = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API}/jobs/${jobId}/rate`, { rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Thank you!', 'Rating submitted!');
      navigation.replace('CustomerHome');
    } catch (err) {
      Alert.alert('Error', 'Could not submit rating');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Rate the Worker</Text>
      <Text style={styles.subtitle}>How was your experience?</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star && styles.activeStar]}>⭐</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={submitRating}>
        <Text style={styles.btnText}>Submit Rating</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E65100', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  star: { fontSize: 40, opacity: 0.3, marginHorizontal: 5 },
  activeStar: { opacity: 1 },
  btn: { backgroundColor: '#E65100', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});