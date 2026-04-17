import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Text, SafeScreen } from '@/core/components';
import { useTheme } from '@/core/theme';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleExportData = () => {
    Alert.alert('Export Data', 'CSV export will be available soon!');
  };

  return (
    <SafeScreen style={{ backgroundColor: theme.colors.background }}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <Text size="xxl" style={[styles.title, { color: theme.colors.text }]}>
            Settings
          </Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text size="sm" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Notifications
          </Text>

          <View style={[styles.settingRow, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.borderLight }]}>
            <View style={{ flex: 1 }}>
              <Text size="md" style={{ color: theme.colors.text }}>
                Push Notifications
              </Text>
              <Text size="xs" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                Receive alerts for analysis completion
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text size="sm" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Data
          </Text>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.borderLight }]}
            onPress={handleExportData}>
            <View>
              <Text size="md" style={{ color: theme.colors.text }}>
                Export History
              </Text>
              <Text size="xs" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                Download your analysis history as CSV
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: theme.colors.textDisabled }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.borderLight }]}
            onPress={() => Alert.alert('Clear History', 'History cleared!')}>
            <View>
              <Text size="md" style={{ color: theme.colors.error }}>
                Clear History
              </Text>
              <Text size="xs" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                Delete all past analyses
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: theme.colors.textDisabled }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text size="sm" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            About
          </Text>

          <View style={[styles.settingRow, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.borderLight }]}>
            <Text size="md" style={{ color: theme.colors.text }}>
              Version
            </Text>
            <Text size="md" style={{ color: theme.colors.textSecondary }}>
              1.0.0
            </Text>
          </View>

          <View style={[styles.settingRow, { backgroundColor: theme.colors.surface }]}>
            <Text size="md" style={{ color: theme.colors.text }}>
              Made with
            </Text>
            <Text size="md" style={{ color: theme.colors.textSecondary }}>
              ❤️ AI Detector
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeScreen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: '700',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});
