/**
 * GlassButton Component
 *
 * A button component with glassmorphism effect
 */

import React from 'react';
import { Text, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { glassStyles, glassBlur, colors, typography } from '@/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  blurAmount?: keyof typeof glassBlur;
  blurType?: 'light' | 'dark' | 'xlight' | 'prominent';
  disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  blurAmount = 'medium',
  blurType = 'light',
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        glassStyles.button,
        style,
        {
          opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
        },
      ]}
    >
      <BlurView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        blurType={blurType}
        blurAmount={glassBlur[blurAmount]}
      />
      <Text
        style={[
          {
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semiBold,
            fontFamily: typography.fontFamily.semiBold,
            color: disabled ? colors.disabledText : colors.text,
            textAlign: 'center',
            zIndex: 1,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};
