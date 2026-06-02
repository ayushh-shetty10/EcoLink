import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';

const Card = ({ children, style, onPress, testID, elevated = true }) => {
  const content = <View style={[styles.card, elevated && styles.elevated, style]}>{children}</View>;

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={onPress}
      activeOpacity={0.8}
      testID={testID}
    >
      {content}
    </TouchableOpacity>
  );
};

const VendorCard = ({ vendor, onPress, onCall }) => (
  <Card onPress={onPress} elevated style={styles.vendorCard}>
    <View style={styles.vendorTopRow}>
      <View style={styles.vendorImage}>
        <Text style={styles.vendorEmoji}>{vendor.image}</Text>
      </View>
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName} numberOfLines={2}>
          {vendor.name}
        </Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="map-marker" size={14} color={colors.textSecondary} />
          <Text style={styles.vendorLocation} numberOfLines={1}>
            {vendor.location}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="star" size={14} color={colors.warning} />
          <Text style={styles.rating}>{vendor.rating} ({vendor.reviews})</Text>
        </View>
      </View>
    </View>

    <View style={styles.vendorBottomRow}>
      <View style={styles.pickupBadge}>
        <MaterialCommunityIcons
          name={vendor.pickupAvailable ? 'truck-fast' : 'truck-off'}
          size={14}
          color={vendor.pickupAvailable ? colors.primary : colors.textSecondary}
        />
        <Text style={styles.pickupText}>
          {vendor.pickupAvailable ? 'Pickup Available' : 'No Pickup'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={onCall}
        disabled={!onCall}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="phone" size={14} color={colors.primary} />
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
    </View>
  </Card>
);

const WasteItemCard = ({ item, onPress }) => (
  <Card onPress={onPress} elevated>
    <View style={styles.wasteHeader}>
      <Text style={styles.wasteEmoji}>{item.image}</Text>
      <View style={styles.wasteInfo}>
        <Text style={styles.wasteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.wasteCategory} numberOfLines={1}>
          {item.category}
        </Text>
      </View>
      <View
        style={[
          styles.conditionBadge,
          item.condition === 'working' ? styles.workingBadge : styles.notWorkingBadge,
        ]}
      >
        <Text style={styles.conditionText}>{item.condition === 'working' ? 'W' : 'NW'}</Text>
      </View>
    </View>

    {item.description ? (
      <Text style={styles.wasteDescription} numberOfLines={2}>
        {item.description}
      </Text>
    ) : null}

    <View style={styles.pointsRow}>
      <Text style={styles.pointsLabel}>+{item.points} points</Text>
      <Text style={styles.statusBadge} numberOfLines={1}>
        {item.status}
      </Text>
    </View>
  </Card>
);

const BadgeCard = ({ badge, locked = false }) => (
  <View style={[styles.badgeCard, locked && styles.badgeCardLocked]}>
    <View style={styles.badgeIconWrap}>
      <Text style={styles.badgeIcon}>{locked ? '🔒' : badge.icon || '🏅'}</Text>
    </View>
    <Text style={styles.badgeName} numberOfLines={2}>
      {badge.name}
    </Text>
    <Text style={styles.badgeDescription} numberOfLines={2}>
      {badge.description}
    </Text>
  </View>
);

const LeaderboardItem = ({ user, isCurrentUser = false }) => (
  <View style={[styles.leaderboardCard, isCurrentUser && styles.highlightedCard]}>
    <Text style={styles.rankNumber}>#{user.rank}</Text>

    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>{user.avatar || user.name.slice(0, 2).toUpperCase()}</Text>
    </View>

    <View style={styles.userSection}>
      <Text style={styles.userName} numberOfLines={1}>
        {user.name}
      </Text>
      <Text style={styles.userStats} numberOfLines={1}>
        {user.itemsDonated} donated • {user.itemsRecycled} recycled
      </Text>
    </View>

    <View style={styles.pointsSection}>
      {user.badge ? <Text style={styles.badgeEmoji}>{user.badge}</Text> : null}
      <Text style={styles.points}>{user.points} pts</Text>
    </View>
  </View>
);

const LeaderboardCard = LeaderboardItem;

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  vendorCard: {
    gap: spacing.md,
  },
  vendorTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vendorImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  vendorEmoji: {
    fontSize: 26,
  },
  vendorInfo: {
    flex: 1,
    minWidth: 0,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  vendorLocation: {
    marginLeft: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  rating: {
    marginLeft: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  vendorBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pickupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    flexShrink: 1,
  },
  pickupText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  callButton: {
    minHeight: 32,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  callText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },

  wasteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  wasteEmoji: {
    fontSize: 34,
    marginRight: spacing.md,
  },
  wasteInfo: {
    flex: 1,
    minWidth: 0,
  },
  wasteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  wasteCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  conditionBadge: {
    minWidth: 38,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  workingBadge: {
    backgroundColor: '#D1FAE5',
  },
  notWorkingBadge: {
    backgroundColor: '#FEE2E2',
  },
  conditionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  wasteDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  pointsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  statusBadge: {
    maxWidth: '45%',
    fontSize: 11,
    color: colors.textSecondary,
    backgroundColor: colors.grayLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    textTransform: 'capitalize',
    overflow: 'hidden',
  },

  badgeCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeIcon: {
    fontSize: 22,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  badgeDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },

  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightedCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  rankNumber: {
    width: 42,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  userSection: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.sm,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pointsSection: {
    alignItems: 'flex-end',
  },
  badgeEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  points: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export { Card, VendorCard, WasteItemCard, BadgeCard, LeaderboardCard, LeaderboardItem };
