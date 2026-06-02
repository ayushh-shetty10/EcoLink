import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../components/Input';
import Button from '../components/Button';
import { Container, Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants';

const LoginScreen = ({ navigation }) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Please enter email and password');
    const res = await signIn(email.trim(), password);
    if (res?.error) {
      Alert.alert('Login failed', res.error.message || 'Unknown error');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
      <Container padded style={styles.containerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back 👋</Text>
          <Text style={styles.subtitle}>Sign in to continue to EcoLink</Text>
        </View>

        <Spacer size="lg" />

        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Spacer size="sm" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <Spacer size="lg" />

        <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} disabled={loading} />

        <Spacer size="md" />

        <View style={styles.row}>
          <Text style={styles.small}>New here?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  screenContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  containerCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  row: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  small: {
    color: colors.textSecondary,
  },
  link: {
    marginLeft: spacing.sm,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
