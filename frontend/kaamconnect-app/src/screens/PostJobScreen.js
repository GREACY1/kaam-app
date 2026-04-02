import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const API = 'http://10.145.100.239:5000/api';

export default function PostJobScreen({ navigation }) {
  const [skill, setSkill] = useState('');
  const [description, setDescription] = useState('');

  const postJob = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission needed');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      await axios.post(`${API}/jobs`, {
        skill,
        description,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Job posted! Workers notified.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not post job');
    }
  };

  const skills = ['Electrician', 'Plumber', 'Carpenter', 'Delivery Helper', 'Labourer'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 Post a Job</Text>
      <Text style={styles.label}>Select Skill Needed:</Text>
      <View style={styles.skillContainer}>
        {skills.map(s => (
          <TouchableOpacity key={s}
            style={[styles.skillBtn, skill === s && styles.activeSkill]}
            onPress={() => setSkill(s)}>
            <Text style={styles.skillText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Job Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your problem..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.btn} onPress={postJob}>
        <Text style={styles.btnText}>Post Job 🚀</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E65100', marginTop: 50, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  skillContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  skillBtn: { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, margin: 5 },
  activeSkill: { backgroundColor: '#E65100', borderColor: '#E65100' },
  skillText: { fontSize: 14, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16, height: 100, textAlignVertical: 'top' },
  btn: { backgroundColor: '#E65100', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});