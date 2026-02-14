/**
 * Root Navigator
 *
 * Main app navigation stack
 */

import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CanvasGalleryScreen } from '@/screens/CanvasGalleryScreen';
import { CanvasScreen } from '@/screens/CanvasScreen';
import { typography, useAppTheme } from '@/theme';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isDark, themeColors } = useAppTheme();

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: themeColors.background,
          card: themeColors.background,
          text: themeColors.text,
          border: themeColors.border,
          primary: themeColors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: themeColors.background,
          card: themeColors.background,
          text: themeColors.text,
          border: themeColors.border,
          primary: themeColors.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="CanvasGallery"
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          headerTitleStyle: {
            ...typography.h2,
            fontWeight: '600',
          },
          cardStyle: {
            backgroundColor: themeColors.background,
          },
        }}
      >
        <Stack.Screen
          name="CanvasGallery"
          component={CanvasGalleryScreen}
          options={{
            title: 'My Canvases',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Canvas"
          component={CanvasScreen}
          options={{
            title: 'Canvas',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
