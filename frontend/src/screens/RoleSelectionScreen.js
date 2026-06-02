import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants';

const RoleCard = ({ emoji, icon, title, subtitle, selected, onPress, delay = 0 }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, fade]);

  const onPressIn = () => {
    Animated.timing(pressScale, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(pressScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity: fade, transform: [{ scale: pressScale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.card, selected && styles.cardActive]}
      >
        <Text style={styles.cardEmoji}>{emoji}</Text>
        <Text style={styles.cardTitle}>{icon} {title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </Pressable>
    </Animated.View>
  );
};

const RoleSelectionScreen = ({ navigation }) => {
  const { setSignupRole } = useAuth();
  const [role, setRole] = useState('individual');

  const continueFlow = () => {
    setSignupRole(role);
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose your role</Text>
      <Spacer size="xs" />
      <Text style={styles.subheading}>How would you like to use EcoLink?</Text>

      <Spacer size="lg" />

      <RoleCard
        emoji="👤"
        icon="👤"
        title="Individual"
        subtitle="Track and recycle your e-waste with impact points."
        selected={role === 'individual'}
        onPress={() => setRole('individual')}
        delay={0}
      />

      <Spacer size="sm" />

      <RoleCard
        emoji="🏢"
        icon="🏢"
        title="Institution"
        subtitle="Manage pickup requests as a verified NGO or vendor."
        selected={role === 'institution'}
        onPress={() => setRole('institution')}
        delay={120}
      />

      <Spacer size="lg" />
      <Button title="Continue" size="large" onPress={continueFlow} />
      <Spacer size="sm" />
      <Button title="Back" variant="outline" size="large" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.lg,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cardEmoji: {
    fontSize: 34,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default RoleSelectionScreen;
