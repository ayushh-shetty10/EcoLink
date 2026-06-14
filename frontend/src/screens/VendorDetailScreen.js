import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Card } from '../components/Cards';
import { Container, Spacer } from '../components/Layout';
import { colors, spacing } from '../constants';
import pickupRequestService from '../services/pickupRequestService';

const VendorDetailScreen = ({ route, navigation }) => {
  const { vendor, fromRoute } = route.params;
  // pickupPayload is passed from AddWasteScreen when the user is doing a recycle pickup
  const pickupPayload = route.params?.pickupPayload || null;

  const [requestSent, setRequestSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canCall = !!vendor.phone && vendor.phone !== 'Not available';
  const canEmail = !!vendor.email;

  const handleRequestPickup = async () => {
    if (pickupPayload) {
      // User came from AddWasteScreen (Recycle flow) — create a real DB row
      setSubmitting(true);
      console.log('[VendorDetailScreen] Creating pickup request for institution:', vendor.id, vendor.name);
      try {
        const payload = {
          ...pickupPayload,
          institution_id: vendor.id,
        };
        // Remove 'points' from the DB payload — it's only used for UI
        delete payload.points;

        console.log('[VendorDetailScreen] Inserting pickup request payload:', payload);
        const res = await pickupRequestService.createPickupRequest(payload);
        if (res.error) {
          console.error('[VendorDetailScreen] Pickup request DB insert failed:', res.error);
          Alert.alert('Error', res.error.message || 'Failed to send pickup request. Please try again.');
        } else {
          console.log('[VendorDetailScreen] Pickup request created successfully:', res.data);
          setRequestSent(true);
          Alert.alert(
            'Pickup Request Sent! ✅',
            `Your request has been sent to ${vendor.name}.\n\nYou earned ${pickupPayload.points || 5} points!`
          );
        }
      } catch (e) {
        console.error('[VendorDetailScreen] Exception during pickup request creation:', e);
        Alert.alert('Error', e?.message || 'Failed to send pickup request. Please try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Non-recycle flow (Donate/Sell) — no DB row needed yet (future marketplace)
      setRequestSent(true);
      Alert.alert('Request Sent', `${vendor.name} will contact you soon.`);
    }
  };


  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.imageCircle}>
          <Text style={styles.vendorImage}>{vendor.image}</Text>
        </View>

        <Text style={styles.vendorName} numberOfLines={2}>
          {vendor.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {vendor.location}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <MaterialCommunityIcons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{vendor.rating}</Text>
          </View>
        </View>
      </View>

      <Container padded>
        <Text style={styles.sectionTitle}>Contact</Text>

        <View style={styles.contactActions}>
          <TouchableOpacity
            style={[styles.actionPill, !canCall && styles.actionPillDisabled]}
            onPress={() => canCall && Linking.openURL(`tel:${vendor.phone}`)}
            activeOpacity={0.75}
            disabled={!canCall}
          >
            <MaterialCommunityIcons name="phone" size={16} color={colors.primary} />
            <Text style={styles.actionPillText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionPill, !canEmail && styles.actionPillDisabled]}
            onPress={() => canEmail && Linking.openURL(`mailto:${vendor.email}`)}
            activeOpacity={0.75}
            disabled={!canEmail}
          >
            <MaterialCommunityIcons name="email" size={16} color={colors.primary} />
            <Text style={styles.actionPillText}>Email</Text>
          </TouchableOpacity>
        </View>

        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{vendor.phone}</Text>
          </View>
        </Card>

        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {vendor.email}
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.infoRowTop}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValueWide}>{vendor.address}</Text>
          </View>
        </Card>

        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pickup</Text>
            <Text
              style={[
                styles.infoValue,
                { color: vendor.pickupAvailable ? colors.success : colors.danger },
              ]}
            >
              {vendor.pickupAvailable ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </Card>

        <Spacer size="lg" />

        <Text style={styles.sectionTitle}>Accepted Categories</Text>
        <Card>
          <View style={styles.categoriesGrid}>
            {vendor.acceptedCategories.includes('all') ? (
              <View style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>All Categories</Text>
              </View>
            ) : (
              vendor.acceptedCategories.map((category) => (
                <View key={category} style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </Card>

        <Spacer size="xl" />

        <Button
          title={requestSent ? '✅ Request Sent' : submitting ? 'Sending...' : 'Request Pickup'}
          onPress={handleRequestPickup}
          disabled={requestSent || submitting}
          loading={submitting}
          size="large"
        />

        <Spacer size="sm" />

        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="large"
        />
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
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  imageCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  vendorImage: {
    fontSize: 44,
  },
  vendorName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  metaRow: {
    marginTop: spacing.sm,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  locationRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  locationText: {
    marginLeft: spacing.xs,
    fontSize: 13,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.grayLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  ratingText: {
    marginLeft: spacing.xs,
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  contactActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionPill: {
    flex: 1,
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  actionPillDisabled: {
    opacity: 0.5,
  },
  actionPillText: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoRowTop: {
    gap: spacing.xs,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValueWide: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryLight,
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});

export default VendorDetailScreen;
