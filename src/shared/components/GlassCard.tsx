/**
 * GlassCard Component
 *
 * A card component with glassmorphism effect
 */

import React from 'react';
import { View, ViewStyle, StyleProp, Pressable } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { glassStyles, glassBlur, spacing } from '@/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  blurAmount?: keyof typeof glassBlur;
  blurType?: 'light' | 'dark' | 'xlight' | 'prominent';
  onPress?: () => void;
  padding?: keyof typeof spacing;
}

export const GlassCard: React.FC<GlassCardProps> = React.memo(({
  children,
  style,
  blurAmount = 'medium',
  blurType = 'light',
  onPress,
  padding = 'lg',
}) => {
  const content = (
    <View style={[glassStyles.card, style]}>
      <BlurView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        blurType={blurType}
        blurAmount={glassBlur[blurAmount]}
      />
      <View style={{ zIndex: 1, padding: spacing[padding] }}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
});
