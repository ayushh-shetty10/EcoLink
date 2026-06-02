import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '../components/Input';
import Button from '../components/Button';
import { Container, Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants';

const SignupScreen = ({ navigation, route }) => {
  const { signUp, loading, signupRole, setSignupRole } = useAuth();
  const [role, setRole] = useState(route?.params?.role || signupRole || 'individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignup = async () => {
    if (!email || !password) return Alert.alert('Please provide email and password');
    if (password !== confirm) return Alert.alert('Passwords do not match');
    setSignupRole(role);
    const res = await signUp(email.trim(), password, role);
    if (res?.error) {
      Alert.alert('Signup failed', res.error.message || 'Unknown error');
    } else {
      Alert.alert('Check your email', 'A confirmation link may have been sent.');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} keyboardShouldPersistTaps="handled">
      <Container padded style={styles.containerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>Create an account 🌱</Text>
          <Text style={styles.subtitle}>Join EcoLink to track e-waste contributions</Text>
        </View>

        <Spacer size="lg" />

        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Spacer size="sm" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Spacer size="sm" />
        <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry />

        <Spacer size="sm" />
        <Text style={styles.roleLabel}>Account Role</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleChip, role === 'individual' && styles.roleChipActive]}
            onPress={() => setRole('individual')}
          >
            <Text style={[styles.roleChipText, role === 'individual' && styles.roleChipTextActive]}>👤 Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleChip, role === 'institution' && styles.roleChipActive]}
            onPress={() => setRole('institution')}
          >
            <Text style={[styles.roleChipText, role === 'institution' && styles.roleChipTextActive]}>🏢 Institution</Text>
          </TouchableOpacity>
        </View>

        <Spacer size="lg" />

        <Button title={loading ? 'Creating...' : 'Create Account'} onPress={handleSignup} disabled={loading} />

        <Spacer size="md" />

        <View style={styles.row}>
          <Text style={styles.small}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign in</Text>
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
    marginTop: spacing.xl,
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
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleChip: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  roleChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleChipText: {
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 13,
  },
  roleChipTextActive: {
    color: colors.primaryDark,
  },
});

export default SignupScreen;
