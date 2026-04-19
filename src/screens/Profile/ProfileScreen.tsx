import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Text, SafeScreen } from '@/core/components';
import { authService } from '@/service/firebase';
import { Theme, useTheme } from '@/core/theme';
import { goBack, resetNavigation } from '@/navigation/navUtils';
import { RootStackScreens } from '@/navigation/types';
import { CommonConst, ProfileConst } from '@/utils/Constants';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = authService.currentUser;

  const handleLogout = () => {
    Alert.alert(ProfileConst.logoutAlertTitle, ProfileConst.logoutAlertMessage, [
      { text: ProfileConst.cancelButton, style: 'cancel' },
      {
        text: ProfileConst.logoutButton,
        style: 'destructive',
        onPress: async () => {
          const response = await authService.signOut();
          if (response.success) {
            resetNavigation(RootStackScreens.Login);
          }
        },
      },
    ]);
  };

  const menuItems = ProfileConst.menuItems;

  return (
    <SafeScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
             <Text style={styles.backText}>{CommonConst.backArrow}</Text>
          </TouchableOpacity>
          <Text size="xxl" style={styles.title}>{ProfileConst.title}</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={[styles.avatar, { borderColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || CommonConst.unknownUserInitial}
            </Text>
          </View>
          <Text size="xl" style={styles.name}>{user?.displayName || ProfileConst.fallbackName}</Text>
          <Text style={styles.email}>{user?.email || ProfileConst.fallbackEmail}</Text>
          
          <Card variant="glass" style={styles.proBadge} padding="sm">
            <Text style={styles.proText}>{ProfileConst.proAccountLabel}</Text>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{ProfileConst.totalScansValue}</Text>
            <Text style={styles.statLabel}>{ProfileConst.totalScansLabel}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{ProfileConst.accuracyValue}</Text>
            <Text style={styles.statLabel}>{ProfileConst.accuracyLabel}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
             <TouchableOpacity key={index} style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
                <View style={styles.menuLeft}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Text style={styles.menuArrow}>{CommonConst.nextArrow}</Text>
             </TouchableOpacity>
          ))}
        </View>

        <Button
          title={ProfileConst.signOutButton}
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={{ color: theme.colors.error }}
        />
        
        <Text style={styles.version}>{ProfileConst.version}</Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;

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
    profileInfo: {
      alignItems: 'center',
      marginBottom: 32,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    name: {
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    email: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      marginBottom: 16,
    },
    proBadge: {
      backgroundColor: theme.colors.primary + '20',
      borderColor: theme.colors.primary + '40',
      paddingHorizontal: 16,
    },
    proText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 12,
      letterSpacing: 1,
    },
    statsRow: {
      flexDirection: 'row',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 20,
      padding: 20,
      marginBottom: 32,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      color: theme.colors.text,
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 4,
    },
    statLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    statDivider: {
      width: 1,
      height: '100%',
      backgroundColor: theme.colors.border,
    },
    menuSection: {
      marginBottom: 40,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 18,
      borderBottomWidth: 1,
    },
    menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    menuIcon: {
      fontSize: 20,
    },
    menuLabel: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    menuArrow: {
      fontSize: 24,
      color: theme.colors.textDisabled,
    },
    logoutButton: {
      borderColor: theme.colors.error + '40',
    },
    version: {
      textAlign: 'center',
      color: theme.colors.textDisabled,
      fontSize: 12,
      marginTop: 32,
    },
  });
