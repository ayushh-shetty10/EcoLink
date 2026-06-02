import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { BadgeCard } from '../components/Cards';
import { Container, Divider, Spacer } from '../components/Layout';
import { useUser } from '../context/UserContext';
import { badges, colors, spacing } from '../constants';

const ProfileScreen = () => {
  const { currentUser, updateUserType } = useUser();
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);

  const allBadges = useMemo(() => Object.values(badges), []);
  const unlockedBadges = useMemo(
    () => allBadges.filter((badge) => currentUser.badges.includes(badge.id)),
    [allBadges, currentUser.badges]
  );
  const lockedBadges = useMemo(
    () => allBadges.filter((badge) => !currentUser.badges.includes(badge.id)),
    [allBadges, currentUser.badges]
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{currentUser.avatarInitials || currentUser.name.slice(0, 2).toUpperCase()}</Text>
        </View>

        <Text style={styles.profileName} numberOfLines={1}>
          {currentUser.name}
        </Text>
        <Text style={styles.profileEmail} numberOfLines={1}>
          {currentUser.email}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.userTypeTag}>
            {currentUser.userType === 'individual' ? 'Individual' : 'Institutional'}
          </Text>
          <Text style={styles.userCity}>{currentUser.city || 'India'}</Text>
        </View>
      </View>

      <Container padded>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser.itemsDonated}</Text>
            <Text style={styles.statLabel}>Donated</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser.itemsRecycled}</Text>
            <Text style={styles.statLabel}>Recycled</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser.badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        <Spacer size="lg" />

        <Text style={styles.sectionTitle}>Your Badges</Text>
        {unlockedBadges.length ? (
          <View style={styles.badgesContainer}>
            {unlockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Complete actions to unlock your first badge.</Text>
          </View>
        )}

        {lockedBadges.length ? (
          <>
            <Spacer size="md" />
            <Text style={styles.sectionTitle}>Locked Badges</Text>
            <View style={styles.badgesContainer}>
              {lockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} locked />
              ))}
            </View>
          </>
        ) : null}

        <Spacer size="lg" />

        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setShowUserTypeModal(true)}
          activeOpacity={0.75}
        >
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="account-switch" size={20} color={colors.primary} />
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>User Type</Text>
              <Text style={styles.settingValue}>
                {currentUser.userType === 'individual' ? 'Individual' : 'Institutional'}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

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

        <Button title="Logout" onPress={() => alert('Logout is coming with Supabase auth.')} variant="outline" size="large" />

        <Spacer size="sm" />

        <Button
          title="Delete Account"
          onPress={() => alert('Account deletion will be enabled after authentication integration.')}
          variant="danger"
          size="large"
        />
      </Container>

      <Modal
        visible={showUserTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change User Type</Text>
              <TouchableOpacity onPress={() => setShowUserTypeModal(false)}>
                <MaterialCommunityIcons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Divider />

            <TouchableOpacity
              style={[
                styles.userTypeOption,
                currentUser.userType === 'individual' && styles.userTypeOptionSelected,
              ]}
              onPress={() => {
                updateUserType('individual');
                setShowUserTypeModal(false);
              }}
            >
              <Text style={styles.userTypeEmoji}>👤</Text>
              <View style={styles.userTypeTextWrap}>
                <Text style={styles.userTypeOptionTitle}>Individual</Text>
                <Text style={styles.userTypeOptionDesc}>Personal e-waste management</Text>
              </View>
            </TouchableOpacity>

            <Spacer size="sm" />

            <TouchableOpacity
              style={[
                styles.userTypeOption,
                currentUser.userType === 'institutional' && styles.userTypeOptionSelected,
              ]}
              onPress={() => {
                updateUserType('institutional');
                setShowUserTypeModal(false);
              }}
            >
              <Text style={styles.userTypeEmoji}>🏢</Text>
              <View style={styles.userTypeTextWrap}>
                <Text style={styles.userTypeOptionTitle}>Institutional</Text>
                <Text style={styles.userTypeOptionDesc}>Organization e-waste management</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    maxWidth: '90%',
  },
  profileEmail: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: '95%',
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userTypeTag: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  userCity: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.9,
  },
  statsGrid: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statBox: {
    width: '48%',
    minHeight: 78,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  settingItem: {
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  settingTextWrap: {
    marginLeft: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  settingValue: {
    marginTop: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  userTypeOption: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTypeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  userTypeEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  userTypeTextWrap: {
    flex: 1,
  },
  userTypeOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  userTypeOptionDesc: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
