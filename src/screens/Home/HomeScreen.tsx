import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Text, SafeScreen } from '@/core/components';
import { Theme, useTheme } from '@/core/theme';
import { authService } from '@/service/firebase';
import type { HomeScreenProps } from '@/navigation/types';
import { HomeConst, CommonConst } from '@/utils/Constants';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = authService.currentUser;

  const modes = [
    {
      id: 'text',
      title: HomeConst.textModeTitle,
      description: HomeConst.textModeDescription,
      icon: HomeConst.textModeIcon,
      route: 'TextDetection',
      accent: theme.colors.primary,
    },
    {
      id: 'image',
      title: HomeConst.imageModeTitle,
      description: HomeConst.imageModeDescription,
      icon: HomeConst.imageModeIcon,
      route: 'ImageDetection',
      accent: theme.colors.secondary,
    },
    {
      id: 'video',
      title: HomeConst.videoModeTitle,
      description: HomeConst.videoModeDescription,
      icon: HomeConst.videoModeIcon,
      route: 'ScanningStatus',
      params: { mode: 'video' },
      accent: '#8B5CF6',
    },
    {
      id: 'news',
      title: HomeConst.newsModeTitle,
      description: HomeConst.newsModeDescription,
      icon: HomeConst.newsModeIcon,
      route: 'ScanningStatus',
      params: { mode: 'news' },
      accent: '#3B82F6',
    },
  ];

  return (
    <SafeScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text size="xxl" style={styles.greeting}>
              Hello, {user?.displayName || HomeConst.fallbackUserName}
            </Text>
            <Text style={styles.headerSubtitle}>{HomeConst.headerSubtitle}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileToggle}>
            <View style={[styles.avatar, { borderColor: theme.colors.primary }]}>
               <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() || CommonConst.unknownUserInitial}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.badgeContainer}>
          <Card variant="glass" style={styles.badgeCard} padding="sm">
            <View style={styles.badgeContent}>
              <View style={[styles.badgeIcon, { backgroundColor: theme.colors.primary }]}>
                <Text>{HomeConst.badgeIcon}</Text>
              </View>
              <View>
                <Text style={styles.badgeTitle}>{HomeConst.badgeTitle}</Text>
                <Text style={styles.badgeSubtitle}>{HomeConst.badgeSubtitle}</Text>
              </View>
            </View>
          </Card>
        </View>

        <Text size="lg" style={styles.sectionTitle}>{HomeConst.sectionTitle}</Text>
        
        <View style={styles.modesGrid}>
          {modes.map((mode) => (
            <Card
              key={mode.id}
              variant="default"
              style={styles.modeCard}
              onPress={() => {
                if (mode.route === 'ScanningStatus') {
                   navigation.navigate('ScanningStatus', { mode: mode.id as any });
                } else {
                   navigation.navigate(mode.route as any);
                }
              }}>
              <View style={[styles.modeIconContainer, { backgroundColor: mode.accent + '20' }]}>
                <Text style={styles.modeEmoji}>{mode.icon}</Text>
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default HomeScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    greeting: {
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    headerSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    profileToggle: {
      padding: 4,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
    },
    avatarText: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 18,
    },
    badgeContainer: {
      marginBottom: 32,
    },
    badgeCard: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    badgeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    badgeIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeTitle: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 14,
    },
    badgeSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
    sectionTitle: {
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    modesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 16,
    },
    modeCard: {
      width: '47%',
      minHeight: 180,
    },
    modeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    modeEmoji: {
      fontSize: 20,
    },
    modeTitle: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 8,
    },
    modeDescription: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
  });
