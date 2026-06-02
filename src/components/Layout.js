import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants';

const Header = ({
  title,
  subtitle,
  children,
  backgroundColor = colors.white,
  style,
}) => {
  return (
    <View style={[styles.header, { backgroundColor }, style]}>
      {children}
    </View>
  );
};

const Container = ({ children, style, padded = true, fill = false }) => {
  return (
    <View
      style={[
        styles.container,
        fill && styles.fill,
        padded && styles.paddedContainer,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const Row = ({ children, style, centered = false, spaceBetween = false }) => {
  return (
    <View
      style={[
        styles.row,
        centered && styles.centeredRow,
        spaceBetween && styles.spaceBetweenRow,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const Spacer = ({ size = 'md' }) => {
  const sizeMap = {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    '2xl': spacing['2xl'],
    '3xl': spacing['3xl'],
  };

  return <View style={{ height: sizeMap[size] }} />;
};

const Divider = ({ style }) => (
  <View style={[styles.divider, style]} />
);

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  container: {
    width: '100%',
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  paddedContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  centeredRow: {
    justifyContent: 'center',
  },
  spaceBetweenRow: {
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});

export { Header, Container, Row, Spacer, Divider };
