import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VendorCard } from '../components/Cards';
import institutionService from '../services/institutionService';
import { colors, spacing } from '../constants';

const VendorDirectoryScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      const response = await institutionService.listAvailableInstitutions(100);
      if (!response.error) {
        setInstitutions(response.data || []);
      }
      setLoading(false);
    };

    fetchInstitutions();
  }, []);

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) {
      return institutions;
    }

    const query = searchQuery.toLowerCase();
    return institutions.filter(
      (institution) =>
        (institution.name || '').toLowerCase().includes(query) ||
        (institution.address || '').toLowerCase().includes(query)
    );
  }, [institutions, searchQuery]);

  const mapInstitutionToVendor = (institution) => {
    return {
      id: institution.id,
      name: institution.name,
      location: institution.address || 'Address not provided',
      phone: institution.phone || 'Not available',
      rating: 4.5,
      reviews: 0,
      image: institution.type === 'NGO' ? '🌱' : '♻️',
      pickupAvailable: !!institution.is_available,
      type: institution.type,
      address: institution.address,
      description: institution.description,
      email: institution.email || 'support@ecolink.in',
      acceptedCategories: ['all'],
      is_active: institution.is_active,
      is_available: institution.is_available,
    };
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('VendorDetail', {
      vendor,
      fromRoute: route.params?.forPickup,
      // Forward the pickupPayload from AddWasteScreen so VendorDetailScreen can create the DB row
      pickupPayload: route.params?.pickupPayload || null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Available Institutions</Text>
          <Text style={styles.vendorCount}>{filteredVendors.length}</Text>
        </View>
        <Text style={styles.headerSubtext}>NGOs and vendors accepting e-waste pickups</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search institution or address"
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const vendor = mapInstitutionToVendor(item);
          return (
            <View style={styles.listItem}>
              <VendorCard
                vendor={vendor}
                onPress={() => handleVendorPress(vendor)}
                onCall={vendor.phone ? () => Linking.openURL(`tel:${vendor.phone}`) : undefined}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>{loading ? '⏳' : '🔍'}</Text>
            <Text style={styles.emptyText}>{loading ? 'Loading institutions...' : 'No institutions found'}</Text>
            <Text style={styles.emptySubtext}>
              {loading ? 'Fetching active institutions.' : 'Try searching with a different keyword.'}
            </Text>
          </View>
        }
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
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  vendorCount: {
    minWidth: 30,
    textAlign: 'center',
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  headerSubtext: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    minHeight: 46,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  listItem: {
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});

export default VendorDirectoryScreen;
