import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import { Dropdown, Input } from '../components/Input';
import { Spacer } from '../components/Layout';
import institutionService from '../services/institutionService';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../constants';

const institutionTypeOptions = [
  { id: 'NGO', label: 'NGO', emoji: '🌱' },
  { id: 'Vendor', label: 'Vendor', emoji: '♻️' },
];

const CreateInstitutionProfileScreen = ({ navigation }) => {
  const { refreshInstitutionStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'NGO',
    address: '',
    phone: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.type) next.type = 'Type is required';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const res = await institutionService.upsertInstitution({
      name: form.name.trim(),
      type: form.type,
      address: form.address.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
      is_active: true,
      is_available: true,
    });
    setLoading(false);

    if (res.error) {
      Alert.alert('Unable to create institution profile', res.error.message || 'Please try again.');
      return;
    }

    await refreshInstitutionStatus();

    Alert.alert('Profile completed', 'Your institution profile is ready.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'InstitutionDashboard' }],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete Institution Profile 🏢</Text>
      <Spacer size="xs" />
      <Text style={styles.subtitle}>This step is required before accessing your dashboard.</Text>

      <Spacer size="lg" />

      <Input
        label="Name"
        placeholder="Green Earth NGO"
        value={form.name}
        onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
        error={errors.name}
      />

      <Dropdown
        label="Type"
        options={institutionTypeOptions}
        selectedValue={form.type}
        onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
        error={errors.type}
      />

      <Input
        label="Address"
        placeholder="Bengaluru, Karnataka"
        value={form.address}
        onChangeText={(value) => setForm((prev) => ({ ...prev, address: value }))}
        error={errors.address}
      />

      <Input
        label="Phone"
        placeholder="+91 XXXXX XXXXX"
        value={form.phone}
        onChangeText={(value) => setForm((prev) => ({ ...prev, phone: value }))}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <Input
        label="Description"
        placeholder="Tell users about your institution's e-waste services"
        value={form.description}
        onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))}
        multiline
        numberOfLines={4}
      />

      <Spacer size="md" />

      <Button
        title={loading ? 'Saving...' : 'Save Profile'}
        size="large"
        onPress={onSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default CreateInstitutionProfileScreen;
