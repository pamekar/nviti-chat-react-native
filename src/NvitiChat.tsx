import React, {useMemo, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  WebView,
  type WebViewMessageEvent,
  type WebViewProps,
} from 'react-native-webview';
import {parseNativeRequest, validateChatConfig} from './protocol';
import type {NvitiChatProps, NvitiNativeResponse} from './types';

export function NvitiChat({
  launchUrl,
  allowedOrigin,
  allowedActions = [],
  onNativeAction,
  onExternalNavigation,
  onReady,
  loadingView,
  errorView,
}: NvitiChatProps) {
  const webView = useRef<WebView<{}>>(null);
  const config = useMemo(
    () => validateChatConfig(launchUrl, allowedOrigin),
    [launchUrl, allowedOrigin],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const respond = (response: NvitiNativeResponse) => {
    const json = JSON.stringify(response);
    webView.current?.injectJavaScript(
      `window.postMessage(${JSON.stringify(json)}, window.location.origin); true;`,
    );
  };

  const handleMessage = async (event: WebViewMessageEvent) => {
    if (new URL(event.nativeEvent.url).origin !== config.allowedOrigin) return;
    const request = parseNativeRequest(event.nativeEvent.data);
    if (!request) return;
    if (!allowedActions.includes(request.action)) {
      respond({
        version: 1,
        type: 'nviti.native.response',
        request_id: request.request_id,
        ok: false,
        error: 'This native action is not allowed by the host app.',
      });
      return;
    }
    try {
      respond({
        version: 1,
        type: 'nviti.native.response',
        request_id: request.request_id,
        ok: true,
        result: await onNativeAction(request),
      });
    } catch (caught) {
      respond({
        version: 1,
        type: 'nviti.native.response',
        request_id: request.request_id,
        ok: false,
        error: caught instanceof Error ? caught.message : 'Native action failed.',
      });
    }
  };

  const reload = () => {
    setError(null);
    setLoading(true);
    webView.current?.reload();
  };

  return (
    <View style={styles.container}>
      <SecureWebView
        ref={webView}
        source={{uri: config.launchUrl}}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mixedContentMode="never"
        originWhitelist={[config.allowedOrigin]}
        onShouldStartLoadWithRequest={(request: {url: string}) => {
          const permitted = new URL(request.url).origin === config.allowedOrigin;
          if (!permitted) onExternalNavigation?.(request.url);
          return permitted;
        }}
        onLoadStart={() => {
          setLoading(true);
          setError(null);
        }}
        onLoadEnd={() => {
          setLoading(false);
          onReady?.();
        }}
        onError={(event: {nativeEvent: {description: string}}) => {
          setLoading(false);
          setError(event.nativeEvent.description || 'Chat could not be loaded.');
        }}
      />
      {loading ? (
        <View style={styles.overlay}>
          {loadingView ?? <ActivityIndicator size="large" color="#EE542F" />}
        </View>
      ) : null}
      {error ? (
        <View style={styles.overlay}>
          {errorView?.(error, reload) ?? (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Chat is temporarily unavailable</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity accessibilityRole="button" onPress={reload} style={styles.retry}>
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const SecureWebView = WebView as unknown as React.ForwardRefExoticComponent<
  WebViewProps & React.RefAttributes<WebView<{}>>
>;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F6F8FB'},
  webview: {flex: 1, backgroundColor: '#F6F8FB'},
  overlay: {...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F8FB'},
  errorCard: {maxWidth: 320, padding: 24, alignItems: 'center'},
  errorTitle: {fontSize: 18, fontWeight: '700', color: '#14213D', marginBottom: 8},
  errorText: {fontSize: 14, textAlign: 'center', color: '#5F6B7A', marginBottom: 20},
  retry: {backgroundColor: '#EE542F', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 12},
  retryText: {color: '#FFFFFF', fontWeight: '700'},
});
