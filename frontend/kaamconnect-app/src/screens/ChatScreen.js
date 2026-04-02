import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://10.145.100.239:5000';

export default function ChatScreen({ route }) {
  const { jobId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    setupChat();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const setupChat = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    setUserId(user._id);
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinRoom', jobId);
    socketRef.current.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit('sendMessage', {
      room: jobId,
      sender: userId,
      text: message
    });
    setMessage('');
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>💬 Chat</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.sender === userId ? styles.myMsg : styles.otherMsg]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E65100', marginTop: 50, marginBottom: 20 },
  msg: { padding: 10, borderRadius: 8, marginBottom: 10, maxWidth: '70%' },
  myMsg: { backgroundColor: '#E65100', alignSelf: 'flex-end' },
  otherMsg: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start' },
  msgText: { color: '#fff', fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
  sendBtn: { backgroundColor: '#E65100', padding: 12, borderRadius: 8, marginLeft: 10 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});