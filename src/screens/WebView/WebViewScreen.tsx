import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppBar, SafeScreen, LoadingState, ErrorState } from '@/core/components';
import type { WebViewScreenProps } from '@/navigation/types';
import { isAllowlistedLegalUrl } from '@/utils/legalUrls';

const WebViewScreen: React.FC = () => {
  const navigation = useNavigation<WebViewScreenProps['navigation']>();
  const { params } = useRoute<WebViewScreenProps['route']>();
  const { title, uri } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const allowed = useMemo(() => isAllowlistedLegalUrl(uri), [uri]);

  const onLoadEnd = useCallback(() => {
    setLoading(false);
  }, []);

  const onError = useCallback(() => {
    setLoading(false);
    setError('This page could not be loaded. Check your connection and try again.');
  }, []);

  const onShouldStart = useCallback((request: WebViewNavigation) => {
    return isAllowlistedLegalUrl(request.url);
  }, []);

  const onRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryKey(k => k + 1);
  }, []);

  if (!allowed) {
    return (
      <SafeScreen style={styles.flex}>
        <AppBar
          title={title}
          showBack
          onBackPress={() => navigation.goBack()}
          absolute={false}
        />
        <ErrorState
          title="Unable to open link"
          message="This address is not allowed in the app."
          onRetry={() => navigation.goBack()}
          retryLabel="Go back"
        />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.flex}>
      <AppBar
        title={title}
        showBack
        onBackPress={() => navigation.goBack()}
        absolute={false}
      />
      {error ? (
        <ErrorState title="Something went wrong" message={error} onRetry={onRetry} />
      ) : (
        <View style={styles.flex}>
          {loading ? (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <LoadingState message="Loading…" />
            </View>
          ) : null}
          <WebView
            key={retryKey}
            style={styles.flex}
            source={{ uri }}
            onLoadEnd={onLoadEnd}
            onError={onError}
            onShouldStartLoadWithRequest={onShouldStart}
            startInLoadingState
            setSupportMultipleWindows={false}
            originWhitelist={['https://*']}
          />
        </View>
      )}
    </SafeScreen>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: 'rgba(5,5,5,0.85)',
    justifyContent: 'center',
  },
});
