import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { Spacer } from '../components/Layout';
import { colors, spacing } from '../constants';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🌱</Text>
        <Spacer size="sm" />
        <Text style={styles.title}>Welcome to EcoLink 🌱</Text>
        <Spacer size="xs" />
        <Text style={styles.subtitle}>Recycle smart. Earn impact.</Text>
        <Spacer size="xl" />
        <Button title="Get Started" size="large" onPress={() => navigation.navigate('RoleSelection')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
