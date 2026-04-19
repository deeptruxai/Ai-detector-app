import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button } from '@/components/Button';
import { Text, SafeScreen, HeaderBackButton } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { useNavigation } from '@react-navigation/native';
import { goBack, navigateTo, type RootStackNavigation } from '@/navigation/navUtils';
import { DetectionConst } from '@/utils/Constants';
import { AiDetectionError, DetectionInput, pickMedia } from '@/service/aiDetection';

const formatSize = (bytes?: number): string | null => {
  if (typeof bytes !== 'number' || bytes <= 0) {
    return null;
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const VideoDetectionScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [selected, setSelected] = useState<DetectionInput | null>(null);
  const [picking, setPicking] = useState(false);

  const handlePick = useCallback(async () => {
    if (picking) return;
    setPicking(true);
    try {
      const asset = await pickMedia({ kind: 'video' });
      if (asset) {
        setSelected(asset);
      }
    } catch (err) {
      const message =
        err instanceof AiDetectionError ? err.message : DetectionConst.pickerErrorTitle;
      Alert.alert(DetectionConst.pickerErrorTitle, message);
    } finally {
      setPicking(false);
    }
  }, [picking]);

  const handleScan = useCallback(() => {
    if (!selected) {
      Alert.alert(DetectionConst.videoScreenTitle, DetectionConst.noVideoError);
      return;
    }
    navigateTo(navigation, 'ScanningStatus', { mode: 'video', media: selected });
  }, [navigation, selected]);

  const sizeLabel = formatSize(selected?.sizeBytes);

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <HeaderBackButton onPress={() => goBack(navigation)} />
          <Text size="xxl" style={styles.title}>
            {DetectionConst.videoScreenTitle}
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
            ) : selected ? (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.uploadIcon}>{DetectionConst.videoUploadIcon}</Text>
                <Text style={styles.uploadTitle}>{DetectionConst.videoReadyTitle}</Text>
                <Text style={styles.videoMeta}>{selected.mimeType}</Text>
                {sizeLabel ? (
                  <Text style={styles.videoMetaSecondary}>{sizeLabel}</Text>
                ) : null}
              </View>
            ) : (
              <>
                <Text style={styles.uploadIcon}>{DetectionConst.videoUploadIcon}</Text>
                <Text style={styles.uploadTitle}>{DetectionConst.videoUploadTitle}</Text>
                <Text style={styles.uploadSubtitle}>{DetectionConst.videoUploadSubtitle}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {selected ? (
          <Text style={styles.selectedSubtitle}>{DetectionConst.videoSelectedSubtitle}</Text>
        ) : null}

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>{DetectionConst.guidelinesTitle}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.videoGuidelineOne}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.videoGuidelineTwo}</Text>
          <Text style={styles.instructionItem}>{DetectionConst.videoGuidelineThree}</Text>
        </View>

        <Button
          title={selected ? DetectionConst.changeVideoButton : DetectionConst.selectVideoButton}
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

export default VideoDetectionScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
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
      paddingHorizontal: 16,
    },
    videoPlaceholder: {
      alignItems: 'center',
    },
    videoMeta: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
    videoMetaSecondary: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 4,
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
      textAlign: 'center',
    },
    uploadSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
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
