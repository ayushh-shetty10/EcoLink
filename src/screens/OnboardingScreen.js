import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { Container, Spacer } from '../components/Layout';
import { useUser } from '../context/UserContext';
import { colors, spacing } from '../constants';

const OnboardingScreen = ({ navigation }) => {
  const { updateUserType } = useUser();

  const handleSelectUserType = (userType) => {
    updateUserType(userType);
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Container padded>
        <Spacer size="xl" />

        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>♻️</Text>
          <Text style={styles.heroTitle}>EcoLink</Text>
          <Text style={styles.heroSubtitle}>
            Smart e-waste collection for homes and institutions.
          </Text>
        </View>

        <Spacer size="xl" />

        <Text style={styles.sectionTitle}>Choose your account type</Text>
        <Text style={styles.sectionSubtitle}>
          You can switch this later from profile settings.
        </Text>

        <Spacer size="lg" />

        <View style={styles.typeCard}>
          <Text style={styles.typeEmoji}>👤</Text>
          <Text style={styles.typeName}>Individual</Text>
          <Text style={styles.typeDescription}>
            Track personal e-waste and earn rewards for donations and recycling.
          </Text>
          <Spacer size="md" />
          <Button
            title="Continue as Individual"
            onPress={() => handleSelectUserType('individual')}
            size="large"
          />
        </View>

        <Spacer size="md" />

        <View style={styles.typeCard}>
          <Text style={styles.typeEmoji}>🏢</Text>
          <Text style={styles.typeName}>Institutional</Text>
          <Text style={styles.typeDescription}>
            Manage e-waste drives for schools, offices, and organizations.
          </Text>
          <Spacer size="md" />
          <Button
            title="Continue as Institutional"
            onPress={() => handleSelectUserType('institutional')}
            size="large"
          />
        </View>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  heroEmoji: {
    fontSize: 62,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
  },
  typeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  typeEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  typeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  typeDescription: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default OnboardingScreen;
