/**
 * Root Navigator
 *
 * Main app navigation stack
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CanvasGalleryScreen } from '@/screens/CanvasGalleryScreen';
import { CanvasScreen } from '@/screens/CanvasScreen';
import { colors, typography } from '@/theme';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CanvasGallery"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            ...typography.h2,
            fontWeight: '600',
          },
          cardStyle: {
            backgroundColor: colors.background,
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
