import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';
import { useAuth } from '../context/AuthContext';
import pickupRequestService from '../services/pickupRequestService';
import profileService from '../services/profileService';

const FILTERS = ['all', 'pending', 'accepted', 'completed', 'rejected'];

const PickupRequestsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestUsers, setRequestUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      if (!user?.id) return;
      const res = await pickupRequestService.listPickupRequestsByInstitution(user.id, activeFilter);
      if (!res.error && res.data) {
        setRequests(res.data);

        // Fetch user profiles for all requests
        const users = {};
        for (const req of res.data) {
          if (req.user_id && !users[req.user_id]) {
            const userRes = await profileService.getProfileById(req.user_id);
            if (!userRes.error && userRes.data) {
              users[req.user_id] = userRes.data;
            }
          }
        }
        setRequestUsers(users);
      }
    } catch (err) {
      console.warn('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user?.id, activeFilter]);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [user?.id, activeFilter])
  );

  const listEmpty = useMemo(
    () => <Text style={styles.emptyText}>No pickup requests for this filter.</Text>,
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={listEmpty}
        onRefresh={loadRequests}
        refreshing={loading}
        renderItem={({ item }) => {
          const userInfo = requestUsers[item.user_id];
          const statusColor = getStatusColor(item.status);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })}
              activeOpacity={0.75}
            >
              {/* Image Preview */}
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                  <Text style={styles.imagePlaceholderText}>📦</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                {/* Title and Status */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title || 'E-Waste Item'}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                      {item.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Category and Condition */}
                <View style={styles.detailsRow}>
                  {item.category && (
                    <View style={styles.detailTag}>
                      <Text style={styles.detailTagText}>📦 {item.category}</Text>
                    </View>
                  )}
                  {item.condition && (
                    <View style={styles.detailTag}>
                      <Text style={styles.detailTagText}>🔍 {item.condition}</Text>
                    </View>
                  )}
                </View>

                {/* User Information */}
                {userInfo && (
                  <View style={styles.userInfo}>
                    <View style={styles.userRow}>
                      <MaterialCommunityIcons name="account-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.userText} numberOfLines={1}>
                        {userInfo.full_name}
                      </Text>
                    </View>
                    {userInfo.phone && (
                      <View style={styles.userRow}>
                        <MaterialCommunityIcons name="phone-outline" size={14} color={colors.textSecondary} />
                        <Text style={styles.userText}>{userInfo.phone}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Date */}
                <Text style={styles.dateText}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return colors.success || colors.primary;
    case 'accepted':
      return colors.primary;
    case 'pending':
      return colors.warning || colors.secondary;
    case 'rejected':
      return colors.danger;
    default:
      return colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.primaryDark,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: colors.backgroundAlt,
  },
  cardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 40,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  detailTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 4,
  },
  detailTagText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  userInfo: {
    marginBottom: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  userText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default PickupRequestsScreen;
