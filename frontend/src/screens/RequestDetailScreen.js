import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { colors, spacing } from '../constants';
import pickupRequestService from '../services/pickupRequestService';

const RequestDetailScreen = ({ route, navigation }) => {
  const { requestId } = route.params || {};
  const [request, setRequest] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadDetails = async () => {
    if (!requestId) return;
    const res = await pickupRequestService.getPickupRequestById(requestId);
    if (!res.error) setRequest(res.data || null);
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

  if (!request) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.loadingText}>Loading request details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{request.title}</Text>
      <Text style={styles.subtitle}>Status: {request.status}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.sectionText}>{request.category || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Condition</Text>
        <Text style={styles.sectionText}>{request.condition || 'Not specified'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image</Text>
        <Text style={styles.sectionText}>{request.image_url || 'No image provided'}</Text>
      </View>

      <View style={styles.actionsWrap}>
        <Button title="Accept" onPress={() => updateStatus('accepted')} loading={saving} />
        <View style={{ height: spacing.sm }} />
        <Button title="Reject" variant="outline" onPress={() => updateStatus('rejected')} loading={saving} />
        <View style={{ height: spacing.sm }} />
        <Button title="Complete" variant="secondary" onPress={() => updateStatus('completed')} loading={saving} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: spacing.xs, fontSize: 13, color: colors.primaryDark, textTransform: 'capitalize' },
  section: {
    marginTop: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' },
  sectionText: { marginTop: spacing.xs, fontSize: 14, color: colors.text },
  actionsWrap: { marginTop: spacing.lg },
});

export default RequestDetailScreen;
