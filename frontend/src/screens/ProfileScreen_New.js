import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { BadgeCard } from '../components/Cards';
import { Container, Divider, Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { badges, colors, spacing } from '../constants';

const ProfileScreen = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const allBadges = useMemo(() => Object.values(badges), []);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          setSigningOut(true);
          await signOut();
          setSigningOut(false);
        },
        style: 'destructive',
      },
    ]);
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || '?';

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.profileName} numberOfLines={2}>
          {profile?.full_name || 'User'}
        </Text>
        <Text style={styles.profileEmail} numberOfLines={1}>
          {user?.email}
        </Text>

        {profile?.phone && (
          <Text style={styles.profilePhone}>📞 {profile.phone}</Text>
        )}

        {profile?.address && (
          <Text style={styles.profileAddress} numberOfLines={2}>
            📍 {profile.address}
          </Text>
        )}
      </View>

      <Container padded>
        <Spacer size="md" />

        <Button
          title="Edit Profile ✏️"
          onPress={() => navigation.navigate('UpdateUserProfile')}
          variant="outline"
        />

        <Spacer size="lg" />

        <Text style={styles.sectionTitle}>Account Information</Text>

        <TouchableOpacity style={styles.infoItem} activeOpacity={0.75}>
          <View style={styles.infoLeft}>
            <MaterialCommunityIcons name="email-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoItem} activeOpacity={0.75}>
          <View style={styles.infoLeft}>
            <MaterialCommunityIcons name="phone-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoItem} activeOpacity={0.75}>
          <View style={styles.infoLeft}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.primary} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{profile?.address || 'Not set'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Spacer size="lg" />

        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.75}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="bell-outline" size={20} color={colors.primary} />
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.75}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="shield-lock-outline" size={20} color={colors.primary} />
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingValue}>Profile visible</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <Spacer size="xl" />

        <Button
          title={signingOut ? 'Signing Out...' : 'Sign Out'}
          onPress={handleLogout}
          disabled={signingOut}
          variant="outline"
          size="large"
        />

        <Spacer size="sm" />
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: colors.backgroundAlt },
  contentContainer: { paddingBottom: spacing.xl },
  profileHeader: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.white },
  profileName: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  profileEmail: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  profilePhone: { fontSize: 13, color: colors.text, marginBottom: spacing.xs },
  profileAddress: { fontSize: 13, color: colors.text, marginTop: spacing.xs, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  infoTextWrap: { marginLeft: spacing.md, flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.xs },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  settingTextWrap: { marginLeft: spacing.md },
  settingTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  settingValue: { fontSize: 12, color: colors.textSecondary },
});

export default ProfileScreen;
