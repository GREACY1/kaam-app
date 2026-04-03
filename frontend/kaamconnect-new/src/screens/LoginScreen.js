import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://10.145.100.239:5000/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [skill, setSkill] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOTP = async () => {
    if (!email) return Alert.alert('Error', 'Please Enter The Email!');
    try {
      await axios.post(`${API}/auth/send-otp`, { email });
      setOtpSent(true);
      Alert.alert('Success', 'OTP Sent!');
    } catch (err) {
      Alert.alert('Error', 'Please, Re-Try!');
    }
  };

  const verifyOTP = async () => {
    if (!otp || !name) return Alert.alert('Error', 'please fill all fields!');
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        email, otp, name, role, skill
      });
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      if (role === 'worker') {
        navigation.replace('WorkerHome');
      } else {
        navigation.replace('CustomerHome');
      }
    } catch (err) {
      Alert.alert('Error', 'Wrong OTP!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 KaamConnect</Text>

      <TextInput style={styles.input} placeholder="Email Address"
        value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      {!otpSent ? (
        <TouchableOpacity style={styles.btn} onPress={sendOTP}>
          <Text style={styles.btnText}>Send OTP</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="OTP (6 digit)"
            value={otp} onChangeText={setOtp} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Your Name"
            value={name} onChangeText={setName} />
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'customer' && styles.activeBtn]}
              onPress={() => setRole('customer')}>
              <Text style={styles.roleText}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'worker' && styles.activeBtn]}
              onPress={() => setRole('worker')}>
              <Text style={styles.roleText}>Worker</Text>
            </TouchableOpacity>
          </View>
          {role === 'worker' && (
            <TextInput style={styles.input} placeholder="Your Skill (e.g. Electrician)"
              value={skill} onChangeText={setSkill} />
          )}
          <TouchableOpacity style={styles.btn} onPress={verifyOTP}>
            <Text style={styles.btnText}>Verify OTP & Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#E65100' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  roleContainer: { flexDirection: 'row', marginBottom: 15 },
  roleBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', borderRadius: 8, marginHorizontal: 5 },
  activeBtn: { backgroundColor: '#E65100' },
  roleText: { fontSize: 16, color: '#333' },
  btn: { backgroundColor: '#E65100', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});