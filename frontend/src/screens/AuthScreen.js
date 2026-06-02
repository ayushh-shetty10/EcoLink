import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { Spacer } from '../components/Layout';
import { colors, spacing } from '../constants';

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Continue to EcoLink</Text>
        <Spacer size="xs" />
        <Text style={styles.subtitle}>Login or create your account to start recycling.</Text>

        <Spacer size="xl" />

        <Button title="Login" size="large" onPress={() => navigation.navigate('Login')} />
        <Spacer size="sm" />
        <Button title="Signup" variant="secondary" size="large" onPress={() => navigation.navigate('Signup')} />
        <Spacer size="sm" />
        <Button title="Back" variant="outline" size="large" onPress={() => navigation.goBack()} />
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
  content: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AuthScreen;
