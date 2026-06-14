import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Linking, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';
import { useAuth } from '../context/AuthContext';
import pickupRequestService from '../services/pickupRequestService';
import profileService from '../services/profileService';

const FILTERS = ['all', 'pending', 'accepted', 'completed', 'rejected'];

const AVATAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#06B6D4'];

const getAvatarColor = (userId) => {
  if (!userId) return AVATAR_COLORS[0];
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const PickupRequestsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [requests, setRequests] = useState([]);
  const [requestUsers, setRequestUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!user?.id) {
      console.warn('[PickupRequestsScreen] No user ID found in session');
      return;
    }
    
    setLoading(true);
    console.log('[PickupRequestsScreen] Fetching requests for institution ID:', user.id, 'Filter:', activeFilter);
    try {
      const res = await pickupRequestService.listPickupRequestsByInstitution(user.id, activeFilter);
      if (res.error) {
        console.error('[PickupRequestsScreen] Error loading requests from database:', res.error);
      } else if (res.data) {
        console.log(`[PickupRequestsScreen] Loaded ${res.data.length} requests successfully`);
        setRequests(res.data);

        // Fetch user profiles for all requests
        const users = {};
        for (const req of res.data) {
          if (req.user_id && !users[req.user_id]) {
            console.log('[PickupRequestsScreen] Fetching donor profile for user ID:', req.user_id);
            const userRes = await profileService.getProfileById(req.user_id);
            if (userRes.error) {
              console.error(`[PickupRequestsScreen] Error loading profile for ${req.user_id}:`, userRes.error);
            } else if (userRes.data) {
              users[req.user_id] = userRes.data;
            }
          }
        }
        setRequestUsers(users);
      }
    } catch (err) {
      console.error('[PickupRequestsScreen] Exception caught in loadRequests:', err);
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

  const handleCall = (phone) => {
    if (!phone) return;
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Call functionality is not supported on this device.');
        }
      })
      .catch((err) => console.error('[PickupRequestsScreen] Error checking phone Link support:', err));
  };

  const handleEmail = (email, itemTitle) => {
    if (!email) return;
    const subject = encodeURIComponent(`EcoLink: Regarding E-Waste Pickup Request (${itemTitle || 'E-Waste Item'})`);
    const body = encodeURIComponent(`Hi, \n\nI'm contacting you regarding your pickup request for "${itemTitle}" on EcoLink.`);
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Email functionality is not supported on this device.');
        }
      })
      .catch((err) => console.error('[PickupRequestsScreen] Error checking email Link support:', err));
  };

  const listEmpty = useMemo(
    () => <Text style={styles.emptyText}>No pickup requests for this filter.</Text>,
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
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
        </ScrollView>
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
          const initials = userInfo?.full_name
            ? userInfo.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            : userInfo?.email?.slice(0, 2).toUpperCase() || '?';
          const avatarColor = getAvatarColor(item.user_id);
          const statusColor = getStatusColor(item.status);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })}
              activeOpacity={0.8}
            >
              {/* Card Header (User profile, status, timestamp) */}
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  {/* Profile Picture / Initials */}
                  <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View style={styles.headerTextWrap}>
                    <Text style={styles.profileName} numberOfLines={1}>
                      {userInfo?.full_name || 'Anonymous User'}
                    </Text>
                    <Text style={styles.dateText}>
                      Requested on {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                  <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                    {item.status?.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Image preview */}
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                  <MaterialCommunityIcons name="package-variant" size={40} color={colors.textLight} />
                  <Text style={styles.imagePlaceholderText}>No image provided</Text>
                </View>
              )}

              {/* Info Section */}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title || 'E-Waste Item'}
                </Text>

                {/* Category & Condition Tags */}
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

                {/* Contact Information (if userInfo exists) */}
                {userInfo && (
                  <View style={styles.contactContainer}>
                    <View style={styles.contactDividerRow}>
                      <View style={styles.contactDividerLine} />
                      <Text style={styles.contactDividerText}>CONTACT INFO</Text>
                      <View style={styles.contactDividerLine} />
                    </View>

                    <View style={styles.contactRowsWrap}>
                      {/* Phone Row */}
                      <View style={styles.contactItem}>
                        <View style={styles.contactItemLeft}>
                          <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textSecondary} />
                          <Text style={styles.contactValue} numberOfLines={1}>
                            {userInfo.phone || 'No phone number'}
                          </Text>
                        </View>
                        {userInfo.phone && (
                          <TouchableOpacity
                            style={styles.contactActionBtn}
                            onPress={() => handleCall(userInfo.phone)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <MaterialCommunityIcons name="phone" size={12} color={colors.primary} />
                            <Text style={styles.contactActionBtnText}>Call</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Email Row */}
                      <View style={styles.contactItem}>
                        <View style={styles.contactItemLeft}>
                          <MaterialCommunityIcons name="email-outline" size={16} color={colors.textSecondary} />
                          <Text style={styles.contactValue} numberOfLines={1}>
                            {userInfo.email || 'No email address'}
                          </Text>
                        </View>
                        {userInfo.email && (
                          <TouchableOpacity
                            style={styles.contactActionBtn}
                            onPress={() => handleEmail(userInfo.email, item.title)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <MaterialCommunityIcons name="email" size={12} color={colors.primary} />
                            <Text style={styles.contactActionBtnText}>Email</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                )}
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
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  filterContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterText: {
    fontSize: 12,
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
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  headerTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardImage: {
    width: '100%',
    height: 185,
    backgroundColor: '#F9FAFB',
  },
  cardImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  cardBody: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  detailTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    backgroundColor: colors.grayLight,
    borderRadius: 6,
  },
  detailTagText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  contactContainer: {
    marginTop: spacing.xs,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  contactDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  contactDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  contactDividerText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textLight,
    paddingHorizontal: spacing.sm,
    letterSpacing: 0.8,
  },
  contactRowsWrap: {
    gap: spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  contactValue: {
    fontSize: 13,
    color: colors.text,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  contactActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default PickupRequestsScreen;
