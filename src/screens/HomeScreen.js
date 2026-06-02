import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { Container, Spacer } from '../components/Layout';
import { Icon } from '../components/Icon';
import { colors, spacing } from '../constants';

const HomeScreen = ({ navigation }) => {
  const { currentUser } = useUser();

  const quickActions = [
    {
      id: 'add',
      icon: '📱',
      title: 'Add E-Waste',
      subtitle: 'Post an item for donate, sell, or recycle.',
      onPress: () => navigation.navigate('AddWaste'),
    },
    {
      id: 'vendor',
      icon: '🏢',
      title: 'Find Vendors',
      subtitle: 'Browse trusted collection centers near you.',
      onPress: () => navigation.navigate('VendorDirectory'),
    },
    {
      id: 'leaderboard',
      icon: '🏆',
      title: 'Leaderboard',
      subtitle: 'Track top contributors in your city.',
      onPress: () => navigation.navigate('LeaderboardTab'),
    },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting} numberOfLines={2}>
            Hello, {currentUser.name}
          </Text>
          <Text style={styles.subGreeting} numberOfLines={2}>
            {currentUser.userType === 'individual'
              ? 'Manage your e-waste responsibly across India.'
              : 'Manage your organization’s e-waste responsibly across India.'}
          </Text>
        </View>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Points</Text>
          <Text style={styles.pointsValue}>{currentUser.points}</Text>
        </View>
      </View>

      <Container padded>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎁</Text>
            <Text style={styles.statLabel}>Donated</Text>
            <Text style={styles.statValue}>{currentUser.itemsDonated}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>♻️</Text>
            <Text style={styles.statLabel}>Recycled</Text>
            <Text style={styles.statValue}>{currentUser.itemsRecycled}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏅</Text>
            <Text style={styles.statLabel}>Badges</Text>
            <Text style={styles.statValue}>{currentUser.badges.length}</Text>
          </View>
        </View>

        <Spacer size="xl" />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={action.onPress}
            activeOpacity={0.75}
          >
            <View style={styles.actionLeft}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle} numberOfLines={1}>
                  {action.title}
                </Text>
                <Text style={styles.actionSubtitle} numberOfLines={2}>
                  {action.subtitle}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={22} color={colors.primary} />
          </TouchableOpacity>
        ))}

        <Spacer size="xl" />

        <Text style={styles.sectionTitle}>Eco Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Prepare Before Pickup</Text>
            <Text style={styles.tipText}>
              Keep chargers and accessories together to improve sorting and
              donation potential.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>🌱</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Earn More Rewards</Text>
            <Text style={styles.tipText}>
              Donate working devices to earn higher points and unlock badges
              faster.
            </Text>
          </View>
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  subGreeting: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    flexShrink: 1,
  },
  pointsCard: {
    minWidth: 88,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  pointsValue: {
    marginTop: spacing.xs,
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  statsGrid: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minHeight: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statValue: {
    marginTop: spacing.xs,
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionCard: {
    minHeight: 74,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  actionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  tipCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  tipEmoji: {
    fontSize: 22,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
    minWidth: 0,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    flexShrink: 1,
  },
});

export default HomeScreen;
