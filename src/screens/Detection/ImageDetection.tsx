import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { ImageDetectionScreenProps } from '@/navigation/types';

const ImageDetectionScreen: React.FC<ImageDetectionScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleScan = () => {
    navigation.navigate('ScanningStatus', { mode: 'image' });
  };

  return (
    <SafeScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
             <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text size="xxl" style={styles.title}>
            Image Detection
          </Text>
        </View>

        <View style={styles.uploadContainer}>
          <View style={[styles.uploadBox, { borderColor: theme.colors.primary, borderStyle: 'dashed' }]}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadTitle}>Upload Image</Text>
            <Text style={styles.uploadSubtitle}>Supports JGP, PNG, HEIC</Text>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Guidelines</Text>
          <Text style={styles.instructionItem}>1. Ensure clear resolution</Text>
          <Text style={styles.instructionItem}>2. No heavy filters</Text>
          <Text style={styles.instructionItem}>3. Maximum size 10MB</Text>
        </View>

        <Button
          title="Start AI Scan"
          variant="primary"
          onPress={handleScan}
          style={styles.scanButton}
        />
      </ScrollView>
    </SafeScreen>
  );
};

export default ImageDetectionScreen;

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
    uploadContainer: {
      width: '100%',
      aspectRatio: 1,
      marginBottom: 40,
    },
    uploadBox: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    uploadTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    uploadSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
