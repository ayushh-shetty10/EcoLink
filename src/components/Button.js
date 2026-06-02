import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing } from '../constants';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const baseStyle = [styles.button];

    if (variant === 'primary') {
      baseStyle.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineButton);
    } else if (variant === 'danger') {
      baseStyle.push(styles.dangerButton);
    }

    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyles = () => {
    const baseStyle = [styles.buttonText];

    if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    }

    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dangerButton: {
    backgroundColor: colors.danger,
  },
  smallButton: {
    minHeight: 40,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  largeButton: {
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
  },
  secondaryText: {
    color: colors.white,
  },
});

export const CustomButton = Button;
export default Button;
