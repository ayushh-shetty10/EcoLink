import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Container, Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants';

const OnboardingScreen = ({ navigation }) => {
  const { setSignupRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState('individual');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim, floatAnim]);

  const moveY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const continueFlow = () => {
    setSignupRole(selectedRole);
    navigation.navigate('Signup', { role: selectedRole });
  };

  return (
    <Container padded style={styles.containerAlt}>
      <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: moveY }] }]}>
        <View style={styles.earthBadge}>
          <MaterialCommunityIcons name="earth" size={28} color={colors.primaryDark} />
        </View>
        <Text style={styles.title}>Choose Your EcoLink Role</Text>
        <Text style={styles.subtitle}>Set up your path as an individual or institution.</Text>

        <Spacer size="lg" />

        <TouchableOpacity
          style={[styles.roleCard, selectedRole === 'individual' && styles.roleCardActive]}
          activeOpacity={0.85}
          onPress={() => setSelectedRole('individual')}
        >
          <MaterialCommunityIcons
            name="account-heart-outline"
            size={24}
            color={selectedRole === 'individual' ? colors.primaryDark : colors.textSecondary}
          />
          <View style={styles.roleTextWrap}>
            <Text style={styles.roleTitle}>Individual</Text>
            <Text style={styles.roleDesc}>Recycle personal devices and track impact points.</Text>
          </View>
          {selectedRole === 'individual' ? (
            <MaterialCommunityIcons name="check-circle" size={22} color={colors.primaryDark} />
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, selectedRole === 'institution' && styles.roleCardActive]}
          activeOpacity={0.85}
          onPress={() => setSelectedRole('institution')}
        >
          <MaterialCommunityIcons
            name="office-building-outline"
            size={24}
            color={selectedRole === 'institution' ? colors.primaryDark : colors.textSecondary}
          />
          <View style={styles.roleTextWrap}>
            <Text style={styles.roleTitle}>Institution</Text>
            <Text style={styles.roleDesc}>Manage pickup requests as NGO or vendor partner.</Text>
          </View>
          {selectedRole === 'institution' ? (
            <MaterialCommunityIcons name="check-circle" size={22} color={colors.primaryDark} />
          ) : null}
        </TouchableOpacity>

        <Spacer size="xl" />

        <Button title="Continue" onPress={continueFlow} size="large" />
        <Spacer size="sm" />
        <Button title="Already have an account" variant="outline" onPress={() => navigation.navigate('Login')} />
      </Animated.View>
    </Container>
  );
};

const styles = StyleSheet.create({
  containerAlt: {
    backgroundColor: '#F1F8F4',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  earthBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: 14,
  },
  roleCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  roleCardActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    transform: [{ scale: 1.01 }],
  },
  roleTextWrap: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  roleDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default OnboardingScreen;
