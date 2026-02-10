/**
 * GlassContainer Component
 *
 * A reusable container with glassmorphism effect
 */

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { glassStyles, glassBlur } from '@/theme';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  blurAmount?: keyof typeof glassBlur;
  blurType?: 'light' | 'dark' | 'xlight' | 'prominent';
  variant?: 'container' | 'card' | 'toolbar' | 'modal';
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  style,
  blurAmount = 'medium',
  blurType = 'light',
  variant = 'container',
}) => {
  const baseStyle = glassStyles[variant];

  return (
    <View style={[baseStyle, style]}>
      <BlurView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        blurType={blurType}
        blurAmount={glassBlur[blurAmount]}
      />
      <View style={{ zIndex: 1 }}>{children}</View>
    </View>
  );
};
