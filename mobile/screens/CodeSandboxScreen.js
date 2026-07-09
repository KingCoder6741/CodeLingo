import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

export default function CodeSandboxScreen() {
  const [code, setCode] = useState('console.log("Hello, World!");');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const runCode = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Please write some code');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(`${API_URL}/sandbox/run`, 
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutput(response.data.output);
    } catch (error) {
      setOutput(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💻 Code Sandbox</Text>
        <Text style={styles.subtitle}>Write and run JavaScript code</Text>
      </View>

      {/* Code Editor */}
      <View style={styles.editorContainer}>
        <Text style={styles.label}>Code Editor</Text>
        <TextInput
          style={styles.editor}
          value={code}
          onChangeText={setCode}
          multiline
          placeholder="Write your code here..."
          placeholderTextColor="#5f6b80"
          scrollEnabled
          editable
        />
      </View>

      {/* Run Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={runCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Running...' : '▶️ Run Code'}
        </Text>
      </TouchableOpacity>

      {/* Output */}
      {output && (
        <View style={styles.outputContainer}>
          <Text style={styles.label}>Output</Text>
          <View style={styles.outputBox}>
            <Text style={styles.output}>{output}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a2f',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f5f9ff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f6b80',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6b80',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  editorContainer: {
    marginBottom: 16,
  },
  editor: {
    backgroundColor: '#0f2138',
    borderColor: '#1c314d',
    borderWidth: 1,
    borderRadius: 8,
    color: '#f5f9ff',
    padding: 12,
    fontFamily: 'monospace',
    fontSize: 12,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'linear-gradient(135deg, #2d8cff, #00f07a)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  outputContainer: {
    marginBottom: 20,
  },
  outputBox: {
    backgroundColor: '#0f2138',
    borderColor: '#00f07a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
  },
  output: {
    color: '#00f07a',
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
