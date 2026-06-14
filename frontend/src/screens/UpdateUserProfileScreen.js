import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import { Input } from '../components/Input';
import { Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import { colors, spacing } from '../constants';

const UpdateUserProfileScreen = ({ navigation }) => {
  const { user, profile, refreshUserProfileStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    setLoading(true);
    try {
      const res = await profileService.upsertProfile({
        id: user.id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      if (res.error) {
        setLoading(false);
        Alert.alert('Error', res.error.message || 'Failed to update profile');
        return;
      }

      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edit Profile ✏️</Text>
      <Spacer size="lg" />

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={form.full_name}
        onChangeText={(v) => setForm((p) => ({ ...p, full_name: v }))}
        editable={!loading}
      />
      <Spacer size="md" />

      <Input
        label="Phone Number"
        placeholder="+91 98765 43210"
        value={form.phone}
        onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
        keyboardType="phone-pad"
        editable={!loading}
      />
      <Spacer size="md" />

      <Input
        label="Address"
        placeholder="123 Main St, City, State 12345"
        value={form.address}
        onChangeText={(v) => setForm((p) => ({ ...p, address: v }))}
        multiline
        numberOfLines={3}
        editable={!loading}
      />
      <Spacer size="lg" />

      <Button
        title={loading ? 'Saving...' : 'Save Changes'}
        onPress={handleSave}
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
});

export default UpdateUserProfileScreen;
