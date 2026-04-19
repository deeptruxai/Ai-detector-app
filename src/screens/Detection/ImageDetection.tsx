import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { goBack, navigateTo } from '@/navigation/navUtils';
import { CommonConst, DetectionConst } from '@/utils/Constants';
import { AiDetectionError, DetectionInput, pickMedia } from '@/service/aiDetection';

const ImageDetectionScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selected, setSelected] = useState<DetectionInput | null>(null);
  const [picking, setPicking] = useState(false);

  const handlePick = useCallback(async () => {
    if (picking) return;
    setPicking(true);
    try {
      const asset = await pickMedia({ kind: 'image' });
      if (asset) {
        setSelected(asset);
      }
    } catch (err) {
      const message =
        err instanceof AiDetectionError
          ? err.message
          : DetectionConst.pickerErrorTitle;
      Alert.alert(DetectionConst.pickerErrorTitle, message);
    } finally {
      setPicking(false);
    }
  }, [picking]);

  const handleScan = useCallback(() => {
    if (!selected) {
      Alert.alert(DetectionConst.imageScreenTitle, DetectionConst.noMediaError);
      return;
    }
    navigateTo('ScanningStatus', { mode: 'image', media: selected });
  }, [selected]);

  const previewUri = selected
    ? `data:${selected.mimeType};base64,${selected.base64}`
    : null;

  return (
    <SafeScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
            <Text style={styles.backText}>{CommonConst.backArrow}</Text>
          </TouchableOpacity>
          <Text size="xxl" style={styles.title}>
            {DetectionConst.imageScreenTitle}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.uploadContainer}
          activeOpacity={0.85}
          onPress={handlePick}
          disabled={picking}>
          <View
            style={[
              styles.uploadBox,
              { borderColor: theme.colors.primary, borderStyle: 'dashed' },
            ]}>
            {picking ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="cover" />
            ) : (
              <>
                <Text style={styles.uploadIcon}>{DetectionConst.uploadIcon}</Text>
                <Text style={styles.uploadTitle}>{DetectionConst.uploadTitle}</Text>
                <Text style={styles.uploadSubtitle}>{DetectionConst.uploadSubtitle}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {selected && (
          <Text style={styles.selectedSubtitle}>
            {DetectionConst.imageSelectedSubtitle}
          </Text>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>{DetectionConst.guidelinesTitle}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.imageGuidelineOne}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.imageGuidelineTwo}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.imageGuidelineThree}</Text>
        </View>

        <Button
          title={selected ? DetectionConst.changeImageButton : DetectionConst.selectImageButton}
          variant="outline"
          onPress={handlePick}
          loading={picking}
          style={styles.secondaryButton}
        />

        <Button
          title={DetectionConst.startAiScanButton}
          variant="primary"
          onPress={handleScan}
          disabled={!selected || picking}
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
      marginBottom: 16,
    },
    uploadBox: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    preview: {
      width: '100%',
      height: '100%',
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
    selectedSubtitle: {
      fontSize: 13,
      color: theme.colors.primary,
      marginBottom: 24,
      textAlign: 'center',
    },
    instructions: {
      marginBottom: 24,
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
    secondaryButton: {
      marginBottom: 12,
    },
    scanButton: {
      marginTop: 'auto',
    },
  });
