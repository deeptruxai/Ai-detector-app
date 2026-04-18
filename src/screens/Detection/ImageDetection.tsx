import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { ImageDetectionScreenProps } from '@/navigation/types';
import { CommonConst, DetectionConst } from '@/utils/Constants';

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
             <Text style={styles.backText}>{CommonConst.backArrow}</Text>
          </TouchableOpacity>
          <Text size="xxl" style={styles.title}>
            {DetectionConst.imageScreenTitle}
          </Text>
        </View>

        <View style={styles.uploadContainer}>
          <View style={[styles.uploadBox, { borderColor: theme.colors.primary, borderStyle: 'dashed' }]}>
            <Text style={styles.uploadIcon}>{DetectionConst.uploadIcon}</Text>
            <Text style={styles.uploadTitle}>{DetectionConst.uploadTitle}</Text>
            <Text style={styles.uploadSubtitle}>{DetectionConst.uploadSubtitle}</Text>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>{DetectionConst.guidelinesTitle}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.imageGuidelineOne}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.imageGuidelineTwo}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.imageGuidelineThree}</Text>
        </View>

        <Button
          title={DetectionConst.startAiScanButton}
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
