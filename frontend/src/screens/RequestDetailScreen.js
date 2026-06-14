import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { colors, spacing } from '../constants';
import pickupRequestService from '../services/pickupRequestService';
import profileService from '../services/profileService';

const RequestDetailScreen = ({ route, navigation }) => {
  const { requestId } = route.params || {};
  const [request, setRequest] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    setLoading(true);
    try {
      if (!requestId) {
        setLoading(false);
        return;
      }

      const res = await pickupRequestService.getPickupRequestById(requestId);
      if (!res.error && res.data) {
        setRequest(res.data);

        // Fetch user profile if request has user_id
        if (res.data.user_id) {
          const userRes = await profileService.getProfileById(res.data.user_id);
          if (!userRes.error && userRes.data) {
            setUserInfo(userRes.data);
          }
        }
      } else {
        Alert.alert('Error', res.error?.message || 'Failed to load request details');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [requestId]);

  const updateStatus = async (status) => {
    if (!requestId) return;
    setSaving(true);
    const res = await pickupRequestService.updatePickupRequestStatus(requestId, status);
    setSaving(false);
    if (res.error) {
      Alert.alert('Unable to update request', res.error.message || 'Please try again.');
      return;
    }
    setRequest(res.data);
    if (status === 'completed') {
      Alert.alert('Marked as completed');
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loadingText}>Loading request details...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loadingText}>Request not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{request.title || 'E-Waste Item'}</Text>
      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
          Status: {request.status?.toUpperCase() || 'PENDING'}
        </Text>
      </View>

      {/* Image Preview */}
      {request.image_url && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 Image</Text>
          <Image source={{ uri: request.image_url }} style={styles.itemImage} />
        </View>
      )}

      {/* Item Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Item Details</Text>
        {request.category && <DetailRow label="Category" value={request.category} />}
        {request.condition && <DetailRow label="Condition" value={request.condition} />}
        {request.pickup_notes && <DetailRow label="Notes" value={request.pickup_notes} />}
      </View>

      {/* User Information */}
      {userInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Donor Information</Text>
          <DetailRow label="Name" value={userInfo.full_name || 'Not provided'} />
          <DetailRow label="Email" value={userInfo.email || 'Not provided'} />
          <DetailRow label="Phone" value={userInfo.phone || 'Not provided'} />
          <DetailRow label="Address" value={userInfo.address || 'Not provided'} />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsWrap}>
        <Button title="Accept" onPress={() => updateStatus('accepted')} loading={saving} disabled={saving} />
        <View style={{ height: spacing.sm }} />
        <Button title="Reject" variant="outline" onPress={() => updateStatus('rejected')} loading={saving} disabled={saving} />
        <View style={{ height: spacing.sm }} />
        <Button title="Complete" variant="secondary" onPress={() => updateStatus('completed')} loading={saving} disabled={saving} />
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
      return colors.text;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  subtitle: { marginTop: spacing.xs, fontSize: 13, color: colors.primaryDark, textTransform: 'capitalize' },
  statusBadge: { marginBottom: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  section: {
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  itemImage: { width: '100%', height: 200, borderRadius: 8, backgroundColor: colors.backgroundAlt },
  detailRow: { marginBottom: spacing.md, paddingBottomColor: colors.border, paddingBottomWidth: 1 },
  detailLabel: { fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.xs },
  detailValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  actionsWrap: { marginTop: spacing.lg },
});

export default RequestDetailScreen;
