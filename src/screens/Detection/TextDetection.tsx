import React, { useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { TextDetectionScreenProps } from '@/navigation/types';

const TextDetectionScreen: React.FC<TextDetectionScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [inputText, setInputText] = useState('');

  const handleScan = () => {
    navigation.navigate('ScanningStatus', { mode: 'text' });
  };

  return (
    <SafeScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text size="xxl" style={styles.title}>
            Text Detection
          </Text>
        </View>

        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputBox,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                borderColor: theme.colors.border,
                borderRadius: 24,
              },
            ]}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Paste or type content here..."
              placeholderTextColor={theme.colors.textDisabled}
              multiline
              textAlignVertical="top"
              value={inputText}
              onChangeText={setInputText}
            />
            <View style={styles.infoRow}>
              <Text style={styles.charCount}>{inputText.length} Characters</Text>
              <TouchableOpacity onPress={() => setInputText('')}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Guidelines</Text>
          <Text style={styles.instructionItem}>1. Minimum 25 words for accuracy</Text>
          <Text style={styles.instructionItem}>2. Avoid overly technical jargon</Text>
          <Text style={styles.instructionItem}>3. AI models work best on prose</Text>
        </View>

        <Button
          title="Analyze Text"
          variant="primary"
          onPress={handleScan}
          disabled={inputText.length < 50}
          style={styles.scanButton}
        />
      </ScrollView>
    </SafeScreen>
  );
};

export default TextDetectionScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
    },
    backButton: {
      marginRight: 16,
    },
    backText: {
      color: theme.colors.text,
      fontSize: 24,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    inputWrapper: {
      width: '100%',
      marginBottom: 40,
    },
    inputBox: {
      height: 300,
      borderWidth: 1,
      padding: 16,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
    },
    charCount: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    clearText: {
      fontSize: 12,
      color: theme.colors.error,
      fontWeight: '600',
    },
    instructions: {
      marginBottom: 40,
    },
    instructionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 12,
    },
    instructionItem: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    scanButton: {
      marginTop: 'auto',
    },
  });
