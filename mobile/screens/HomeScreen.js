import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api'; // Android emulator

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Not logged in', 'Please sign in first');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Load user profile
      const userRes = await axios.get(`${API_URL}/users/me`, { headers });
      setUser(userRes.data);

      // Load progress
      const progressRes = await axios.get(`${API_URL}/progress`, { headers });
      setProgress(progressRes.data);

      // Load streak
      const streakRes = await axios.get(`${API_URL}/streaks/streak`, { headers });
      setStreak(streakRes.data.current_streak);

      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, {user?.name}! 👋</Text>
        <Text style={styles.subtitle}>Keep learning to build your streak</Text>
      </View>

      {/* Streak Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Your Streak</Text>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.cardSubtitle}>days in a row</Text>
      </View>

      {/* Progress Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Progress</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Level</Text>
            <Text style={styles.progressValue}>{progress?.level || 0}</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>XP</Text>
            <Text style={styles.progressValue}>{progress?.total_xp || 0}</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Code</Text>
            <Text style={styles.progressValue}>{progress?.progress_code || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Quick Start */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 Quick Start</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start a Lesson</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>View Leaderboard</Text>
        </TouchableOpacity>
      </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f5f9ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f6b80',
  },
  card: {
    backgroundColor: '#0f2138',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1c314d',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f5f9ff',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#5f6b80',
    marginTop: 4,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00f07a',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#5f6b80',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d8cff',
  },
  button: {
    backgroundColor: 'linear-gradient(135deg, #2d8cff, #00f07a)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1c314d',
  },
  secondaryButtonText: {
    color: '#f5f9ff',
    fontWeight: '500',
  },
});
