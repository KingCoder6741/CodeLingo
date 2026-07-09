import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';
const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (loading || !analytics) {
    return (
      <View style={styles.container}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  const lineChartData = {
    labels: analytics.weekly_activity.map(d => d.date.slice(5)),
    datasets: [
      {
        data: analytics.weekly_activity.map(d => d.activity_count),
        color: () => '#00f07a',
        strokeWidth: 2,
      },
    ],
  };

  const pieChartData = [
    {
      name: 'Passed',
      population: analytics.coding.passed,
      color: '#00f07a',
      legendFontColor: '#f5f9ff',
      legendFontSize: 12,
    },
    {
      name: 'Failed',
      population: analytics.coding.submissions - analytics.coding.passed,
      color: '#ff6b6b',
      legendFontColor: '#f5f9ff',
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Overview Cards */}
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.label}>Level</Text>
          <Text style={styles.value}>{analytics.user.level}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Total XP</Text>
          <Text style={styles.value}>{analytics.user.total_xp}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Streak</Text>
          <Text style={styles.value}>{analytics.user.streak} 🔥</Text>
        </View>
      </View>

      {/* Weekly Activity Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📈 Weekly Activity</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#0f2138',
            backgroundGradientFrom: '#0f2138',
            backgroundGradientTo: '#0a1a2f',
            color: () => '#2d8cff',
            strokeWidth: 2,
          }}
        />
      </View>

      {/* Code Submission Stats */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>💻 Code Submissions</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{analytics.coding.submissions}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Pass Rate</Text>
            <Text style={styles.statValue}>
              {Math.round(
                (analytics.coding.passed / analytics.coding.submissions) * 100
              )}%
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Avg Score</Text>
            <Text style={styles.statValue}>{analytics.coding.avg_score}/100</Text>
          </View>
        </View>
        <PieChart
          data={pieChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: () => '#2d8cff',
          }}
          accessor="population"
          backgroundColor="#0f2138"
        />
      </View>

      {/* Learning Progress */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📚 Learning Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Language</Text>
            <Text style={styles.statValue}>{analytics.learning.language_progress}%</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Code</Text>
            <Text style={styles.statValue}>{analytics.learning.code_progress}%</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Lessons</Text>
            <Text style={styles.statValue}>{analytics.learning.lessons_completed}</Text>
          </View>
        </View>
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
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#0f2138',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1c314d',
  },
  label: {
    fontSize: 12,
    color: '#5f6b80',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d8cff',
  },
  chartCard: {
    backgroundColor: '#0f2138',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1c314d',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f5f9ff',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6b80',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00f07a',
  },
});
