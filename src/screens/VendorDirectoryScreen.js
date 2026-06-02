import React, { useMemo, useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VendorCard } from '../components/Cards';
import { mockVendors } from '../mockData/vendors';
import { colors, spacing } from '../constants';

const VendorDirectoryScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockVendors;
    }

    const query = searchQuery.toLowerCase();
    return mockVendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(query) ||
        vendor.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleVendorPress = (vendor) => {
    navigation.navigate('VendorDetail', {
      vendor,
      fromRoute: route.params?.forPickup,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>E-Waste Vendors</Text>
          <Text style={styles.vendorCount}>{filteredVendors.length}</Text>
        </View>
        <Text style={styles.headerSubtext}>Bangalore, Mumbai, Delhi, Hyderabad, Chennai</Text>
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
          placeholder="Search vendor or city"
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
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <VendorCard
              vendor={item}
              onPress={() => handleVendorPress(item)}
              onCall={() => Linking.openURL(`tel:${item.phone}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No vendors found</Text>
            <Text style={styles.emptySubtext}>Try searching with another city or vendor name.</Text>
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
