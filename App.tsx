/**
 * Visual Notes App
 *
 * Main application entry point
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MigrationService } from '@/core/storage/migrations/index';
import { colors } from '@/theme';
import { AutoSaveManager } from '@/features/canvas/components/AutoSaveManager';
import { RootNavigator } from '@/navigation';

/**
 * App Component
 */
function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  /**
   * Initialize the app
   * - Run data migrations
   * - Load initial state
   */
  useEffect(() => {
    let isMounted = true;

    const initialize = async (): Promise<void> => {
      try {
        if (MigrationService.needsMigration()) {
          console.info('Running data migrations...');
          await MigrationService.runMigrations();
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('App initialization failed:', err);
        if (isMounted) {
          setError('Failed to initialize app. Please restart.');
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Error screen
  if (error) {
    return (
      <SafeAreaProvider style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Main app
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider style={styles.container}>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <AutoSaveManager />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});

export default App;
