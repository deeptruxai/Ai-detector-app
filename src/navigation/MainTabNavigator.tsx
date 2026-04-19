import React, { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/core/theme';
import type { MainTabParamList } from './types';
import HomeScreen from '@/screens/Home/HomeScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';
import SettingsScreen from '@/screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

function tabBarIconName(routeName: keyof MainTabParamList): string {
  switch (routeName) {
    case 'Home':
      return 'home-outline';
    case 'Profile':
      return 'account-outline';
    case 'Settings':
      return 'cog-outline';
    default: {
      const _exhaustive: never = routeName;
      return _exhaustive;
    }
  }
}

const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  const screenOptions = useMemo(
    () => ({
      headerShown: false as const,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderTopColor: 'rgba(255,255,255,0.06)',
        height: Platform.OS === 'ios' ? 88 : 64,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        paddingTop: 8,
      },
      tabBarLabelStyle: styles.tabLabel,
    }),
    [
      theme.colors.backgroundSecondary,
      theme.colors.primary,
      theme.colors.textSecondary,
    ],
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        ...screenOptions,
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={tabBarIconName(route.name as keyof MainTabParamList)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default MainTabNavigator;
