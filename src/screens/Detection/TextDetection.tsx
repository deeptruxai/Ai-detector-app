import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen, HeaderBackButton } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { useNavigation } from '@react-navigation/native';
import { goBack, navigateTo, type RootStackNavigation } from '@/navigation/navUtils';
import { DetectionConst } from '@/utils/Constants';
import { MIN_TEXT_LENGTH } from '@/service/aiDetection';

const TextDetectionScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [inputText, setInputText] = useState('');

  const trimmedLength = inputText.trim().length;
  const canAnalyze = trimmedLength >= MIN_TEXT_LENGTH;

  const handleScan = useCallback(() => {
    if (!canAnalyze) {
      Alert.alert(DetectionConst.textInvalidTitle, DetectionConst.textTooShortError);
      return;
    }
    navigateTo(navigation, 'ScanningStatus', { mode: 'text', text: inputText.trim() });
  }, [canAnalyze, inputText, navigation]);

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <HeaderBackButton onPress={() => goBack(navigation)} />
            <Text size="xxl" style={styles.title}>
              {DetectionConst.textScreenTitle}
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
                placeholder={DetectionConst.textPlaceholder}
                placeholderTextColor={theme.colors.textDisabled}
                multiline
                textAlignVertical="top"
                value={inputText}
                onChangeText={setInputText}
                maxLength={50000}
              />
              <View style={styles.infoRow}>
                <Text style={styles.charCount}>
                  {trimmedLength} {DetectionConst.charCountSuffix}
                </Text>
                <TouchableOpacity onPress={() => setInputText('')}>
                  <Text style={styles.clearText}>{DetectionConst.clearButton}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>{DetectionConst.guidelinesTitle}</Text>
            <Text style={styles.instructionItem}>{DetectionConst.textGuidelineOne}</Text>
            <Text style={styles.instructionItem}>{DetectionConst.textGuidelineTwo}</Text>
            <Text style={styles.instructionItem}>{DetectionConst.textGuidelineThree}</Text>
          </View>

          <Button
            title={DetectionConst.analyzeTextButton}
            variant="primary"
            onPress={handleScan}
            disabled={!canAnalyze}
            style={styles.scanButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default TextDetectionScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    keyboardAvoid: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
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
