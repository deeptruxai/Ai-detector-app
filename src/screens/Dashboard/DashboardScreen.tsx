/**
 * Dashboard Screen
 * Main AI Detector screen — paste text and detect if it's AI-generated
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, SafeScreen } from '@/core/components';
import { PrimaryButton } from '@/core/components/button';
import { useAIDetectorStore } from '@/store';
import { authService } from '@/service/firebase';
import { useTheme } from '@/core/theme';
import type { HomeScreenProps } from '@/navigation/types';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');

  const { status, currentResult, history, setStatus, setResult, setError, reset } =
    useAIDetectorStore();

  const user = authService.currentUser;

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setStatus('analyzing');

    // TODO: Replace with real AI detection API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock result — wire up your real detection service here
    const aiScore = Math.random() * 100;
    const result = {
      id: Date.now().toString(),
      text: inputText,
      aiProbability: Math.round(aiScore),
      humanProbability: Math.round(100 - aiScore),
      label: (aiScore > 60 ? 'AI' : aiScore > 40 ? 'Mixed' : 'Human') as 'AI' | 'Human' | 'Mixed',
      confidence: (aiScore > 80 || aiScore < 20 ? 'High' : aiScore > 65 || aiScore < 35 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      analyzedAt: new Date(),
    };

    setResult(result);
  };

  const handleClear = () => {
    setInputText('');
    reset();
  };

  const getResultColor = () => {
    if (!currentResult) return theme.colors.primary;
    if (currentResult.label === 'AI') return theme.colors.error;
    if (currentResult.label === 'Human') return theme.colors.success;
    return theme.colors.warning;
  };

  return (
    <SafeScreen style={{ backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text size="xxl" style={[styles.title, { color: theme.colors.text }]}>
              AI Detector
            </Text>
            <Text size="sm" style={{ color: theme.colors.textSecondary }}>
              {user?.email || 'Guest'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Input Area */}
        <View style={[styles.inputCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text size="sm" style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
            Paste text to analyze
          </Text>
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            multiline
            numberOfLines={8}
            placeholder="Enter or paste the text you want to check..."
            placeholderTextColor={theme.colors.textDisabled}
            value={inputText}
            onChangeText={setInputText}
            textAlignVertical="top"
          />
          <Text size="xs" style={{ color: theme.colors.textDisabled, textAlign: 'right', marginTop: 4 }}>
            {inputText.length} characters
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <PrimaryButton
            title={status === 'analyzing' ? 'Analyzing...' : 'Analyze Text'}
            onPress={handleAnalyze}
            loading={status === 'analyzing'}
            disabled={!inputText.trim() || status === 'analyzing'}
            fullWidth
            size="large"
          />
          {(inputText || currentResult) && (
            <PrimaryButton
              title="Clear"
              onPress={handleClear}
              variant="ghost"
              fullWidth
              size="medium"
              buttonStyle={{ marginTop: 8 }}
            />
          )}
        </View>

        {/* Result Card */}
        {currentResult && (
          <View style={[styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: getResultColor(), borderWidth: 2 }]}>
            <View style={styles.resultHeader}>
              <View style={[styles.labelBadge, { backgroundColor: getResultColor() }]}>
                <Text size="sm" style={{ color: '#FFF', fontWeight: 'bold' }}>
                  {currentResult.label} Content
                </Text>
              </View>
              <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                {currentResult.confidence} Confidence
              </Text>
            </View>

            <View style={styles.probabilityRow}>
              <View style={styles.probabilityItem}>
                <Text size="xxxl" style={[styles.probabilityValue, { color: theme.colors.error }]}>
                  {currentResult.aiProbability}%
                </Text>
                <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                  AI Generated
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.probabilityItem}>
                <Text size="xxxl" style={[styles.probabilityValue, { color: theme.colors.success }]}>
                  {currentResult.humanProbability}%
                </Text>
                <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                  Human Written
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.borderLight }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${currentResult.aiProbability}%`,
                    backgroundColor: getResultColor(),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* History */}
        {history.length > 1 && (
          <View style={styles.historySection}>
            <Text size="lg" style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Analyses
            </Text>
            {history.slice(1, 4).map(item => (
              <View key={item.id} style={[styles.historyItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderLight }]}>
                <Text size="sm" style={{ color: theme.colors.text }} numberOfLines={2}>
                  {item.text.substring(0, 80)}...
                </Text>
                <View style={[styles.historyBadge, { backgroundColor: item.label === 'AI' ? theme.colors.error : item.label === 'Human' ? theme.colors.success : theme.colors.warning }]}>
                  <Text size="xs" style={{ color: '#FFF' }}>
                    {item.label} · {item.aiProbability}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  textInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 150,
  },
  actions: {
    marginBottom: 20,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  probabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  probabilityItem: {
    alignItems: 'center',
    flex: 1,
  },
  probabilityValue: {
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#E5E7EB',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  historySection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  historyItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  historyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
