import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../constants';
import { useAuth } from '../context/AuthContext';
import pickupRequestService from '../services/pickupRequestService';

const FILTERS = ['all', 'pending', 'accepted', 'completed', 'rejected'];

const PickupRequestsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    if (!user?.id) return;
    const res = await pickupRequestService.listPickupRequestsByInstitution(user.id, activeFilter);
    if (!res.error) {
      setRequests(res.data || []);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user?.id, activeFilter]);

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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RequestDetail', { requestId: item.id })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>{item.category || 'Category not set'}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.statusText}>{item.status}</Text>
              <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardMeta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    textTransform: 'capitalize',
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default PickupRequestsScreen;
