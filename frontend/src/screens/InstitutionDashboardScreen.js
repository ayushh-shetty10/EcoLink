import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';
import { useAuth } from '../context/AuthContext';
import institutionService from '../services/institutionService';
import pickupRequestService from '../services/pickupRequestService';

const StatCard = ({ label, value, icon }) => (
  <View style={styles.statCard}>
    <MaterialCommunityIcons name={icon} size={22} color={colors.primaryDark} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InstitutionDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [institution, setInstitution] = useState(null);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);

  const loadData = async () => {
    if (!user?.id) return;

    const [institutionRes, requestsRes] = await Promise.all([
      institutionService.getInstitutionById(user.id),
      pickupRequestService.listPickupRequestsByInstitution(user.id),
    ]);

    if (!institutionRes?.error) {
      setInstitution(institutionRes.data || null);
    }
    if (!requestsRes?.error) {
      setRequests(requestsRes.data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'pending').length;
    const completed = requests.filter((r) => r.status === 'completed').length;
    return { total, pending, completed };
  }, [requests]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleAvailability = async () => {
    if (!institution?.id) return;
    setTogglingAvailability(true);
    const next = !institution.is_available;
    const res = await institutionService.setInstitutionAvailability(institution.id, next);
    setTogglingAvailability(false);
    if (!res.error) {
      setInstitution((prev) => ({ ...prev, is_available: next }));
    }
  };

  const toggleActiveStatus = async () => {
    if (!institution?.id) return;
    setTogglingActive(true);
    const next = !institution.is_active;
    const res = await institutionService.setInstitutionActiveStatus(institution.id, next);
    setTogglingActive(false);
    if (!res.error) {
      setInstitution((prev) => ({ ...prev, is_active: next }));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>🏢 Institution Dashboard</Text>
        <Text style={styles.heroSubtitle}>{institution?.name || 'Your institution'}</Text>
        <Text style={styles.heroMeta}>{institution?.address || 'Location not set'}</Text>
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Status Management</Text>
        
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>💚 Pickup Available</Text>
            <Text style={styles.toggleStatus}>
              {institution?.is_available ? 'Users can submit requests' : 'Currently unavailable'}
            </Text>
          </View>
          <Switch
            value={!!institution?.is_available}
            onValueChange={toggleAvailability}
            disabled={togglingAvailability}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={institution?.is_available ? colors.primary : colors.gray}
          />
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleLabel}>📱 Active Status</Text>
            <Text style={styles.toggleStatus}>
              {institution?.is_active ? 'Visible to all users' : 'Hidden from search'}
            </Text>
          </View>
          <Switch
            value={!!institution?.is_active}
            onValueChange={toggleActiveStatus}
            disabled={togglingActive}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={institution?.is_active ? colors.primary : colors.gray}
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Request Statistics</Text>
        <View style={styles.statsRow}>
          <StatCard label="Total" value={stats.total} icon="inbox-multiple-outline" />
          <StatCard label="Pending" value={stats.pending} icon="clock-outline" />
          <StatCard label="Completed" value={stats.completed} icon="check-circle-outline" />
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('PickupRequests')}>
          <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={colors.primary} />
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>📦 View Requests</Text>
            <Text style={styles.actionSubtitle}>Manage incoming pickup requests</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('InstitutionProfile')}>
          <MaterialCommunityIcons name="office-building-cog-outline" size={24} color={colors.primary} />
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>⚙️ Edit Profile</Text>
            <Text style={styles.actionSubtitle}>Update institution details</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  hero: {
    borderRadius: 18,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '700' },
  heroSubtitle: { color: 'rgba(255,255,255,0.95)', marginTop: spacing.sm, fontSize: 16, fontWeight: '600' },
  heroMeta: { color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs, fontSize: 13 },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  
  statusSection: { marginBottom: spacing.lg },
  toggleCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLeft: { flex: 1, marginRight: spacing.md },
  toggleLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  toggleStatus: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },

  statsSection: { marginBottom: spacing.lg },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  statValue: { marginTop: spacing.sm, fontSize: 24, fontWeight: '700', color: colors.primary },
  statLabel: { marginTop: spacing.xs, fontSize: 12, color: colors.textSecondary, fontWeight: '600' },

  actionsSection: {},
  actionCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  actionSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
});

export default InstitutionDashboardScreen;
