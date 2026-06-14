import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import { Input } from '../components/Input';
import { Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import { colors, spacing } from '../constants';

const CreateUserProfileScreen = ({ navigation }) => {
  const { user, profile, refreshUserProfileStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.full_name?.trim()) next.full_name = 'Full name is required';
    if (!form.phone?.trim()) next.phone = 'Phone number is required';
    if (!form.address?.trim()) next.address = 'Address is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!user?.id) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    setLoading(true);
    try {
      const res = await profileService.upsertProfile({
        id: user.id,
        email: user.email,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        role: 'individual',
        profile_completed: true,
      });

      if (res.error) {
        setLoading(false);
        Alert.alert('Error', res.error.message || 'Failed to save profile');
        return;
      }

      // Refresh the user profile status to remove the gate
      await refreshUserProfileStatus();
      setLoading(false);

      Alert.alert('Success', 'Profile completed! Redirecting to home...');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to save profile');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete Your Profile 👤</Text>
      <Text style={styles.subtitle}>Help us connect you with trusted vendors for e-waste collection</Text>

      <Spacer size="lg" />

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={form.full_name}
        onChangeText={(v) => setForm((p) => ({ ...p, full_name: v }))}
        error={errors.full_name}
        editable={!loading}
      />
      <Spacer size="md" />

      <Input
        label="Phone Number"
        placeholder="+91 98765 43210"
        value={form.phone}
        onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
        error={errors.phone}
        keyboardType="phone-pad"
        editable={!loading}
      />
      <Spacer size="md" />

      <Input
        label="Address"
        placeholder="123 Main St, City, State 12345"
        value={form.address}
        onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
        error={errors.address}
        multiline
        numberOfLines={3}
        editable={!loading}
      />
      <Spacer size="lg" />

      <Button
        title={loading ? 'Saving...' : 'Complete Profile'}
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: spacing.sm, fontSize: 14, color: colors.textSecondary },
});

export default CreateUserProfileScreen;
