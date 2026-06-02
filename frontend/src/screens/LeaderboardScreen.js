import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LeaderboardItem } from '../components/Cards';
import { useUser } from '../context/UserContext';
import { mockLeaderboard } from '../mockData/vendors';
import { colors, spacing } from '../constants';

const LeaderboardScreen = () => {
  const { currentUser } = useUser();

  const sortedData = useMemo(
    () => [...mockLeaderboard].sort((a, b) => a.rank - b.rank),
    []
  );

  const userPosition = useMemo(
    () => sortedData.find((entry) => entry.id === currentUser.id),
    [currentUser.id, sortedData]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.subheader}>Top eco-warriors across India</Text>
      </View>

      {userPosition ? (
        <View style={styles.yourRankSection}>
          <Text style={styles.yourRankLabel}>Your Position</Text>
          <LeaderboardItem user={userPosition} isCurrentUser />
        </View>
      ) : null}

      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <LeaderboardItem user={item} isCurrentUser={item.id === currentUser.id} />
          </View>
        )}
        ListHeaderComponent={<Text style={styles.topText}>Top Performers</Text>}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  subheader: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  yourRankSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  yourRankLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  topText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  listItem: {
    marginBottom: spacing.sm,
  },
});

export default LeaderboardScreen;
