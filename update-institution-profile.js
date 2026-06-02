const fs = require('fs');

const profilePath = 'frontend/src/screens/InstitutionProfileScreen.js';

const newContent = `import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from '../components/Button';
import { Dropdown, Input } from '../components/Input';
import { colors, spacing } from '../constants';
import { useAuth } from '../context/AuthContext';
import institutionService from '../services/institutionService';

const typeOptions = [
  { id: 'NGO', label: 'NGO' },
  { id: 'Vendor', label: 'Vendor' },
];

const InstitutionProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'NGO',
    address: '',
    phone: '',
    description: '',
    is_available: true,
    is_active: true,
  });

  const loadInstitution = async () => {
    if (!user?.id) return;
    const res = await institutionService.getInstitutionById(user.id);
    if (!res.error && res.data) {
      setForm({
        name: res.data.name || '',
        type: res.data.type || 'NGO',
        address: res.data.address || '',
        phone: res.data.phone || '',
        description: res.data.description || '',
        is_available: !!res.data.is_available,
        is_active: !!res.data.is_active,
      });
    }
  };

  useEffect(() => {
    loadInstitution();
  }, [user?.id]);

  const saveInstitution = async () => {
    if (!user?.id || !form.name) {
      Alert.alert('Institution name is required');
      return;
    }

    setSaving(true);
    const res = await institutionService.upsertInstitution({
      id: user.id,
      ...form,
    });
    setSaving(false);

    if (res.error) {
      Alert.alert('Unable to save profile', res.error.message || 'Please try again');
      return;
    }

    Alert.alert('Institution profile updated');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          setLoggingOut(true);
          await signOut();
          setLoggingOut(false);
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>⚙️ Institution Profile</Text>

      <Input label="Institution Name" value={form.name} onChangeText={(v) => setForm((p) => ({ ...p, name: v }))} />
      <Dropdown
        label="Institution Type"
        options={typeOptions}
        selectedValue={form.type}
        onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
      />
      <Input label="Address" value={form.address} onChangeText={(v) => setForm((p) => ({ ...p, address: v }))} />
      <Input label="Phone" value={form.phone} onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))} />
      <Input
        label="Description"
        value={form.description}
        onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
        multiline
        numberOfLines={4}
      />

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Available for pickup requests</Text>
          <Text style={styles.switchHint}>Users can be assigned to your institution when enabled</Text>
        </View>
        <Switch
          value={form.is_available}
          onValueChange={(v) => setForm((p) => ({ ...p, is_available: v }))}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={form.is_available ? colors.primary : colors.gray}
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Active Status</Text>
          <Text style={styles.switchHint}>Visible in search results when enabled</Text>
        </View>
        <Switch
          value={form.is_active}
          onValueChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={form.is_active ? colors.primary : colors.gray}
        />
      </View>

      <Button title="Save Changes" onPress={saveInstitution} loading={saving} />

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Account</Text>
      <Button
        title="Sign Out"
        onPress={handleLogout}
        loading={loggingOut}
        variant="outline"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  heading: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
  switchRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  switchHint: { marginTop: 2, fontSize: 11, color: colors.textSecondary, maxWidth: 220 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  logoutButton: { marginBottom: spacing.lg },
});

export default InstitutionProfileScreen;
`;

try {
  fs.writeFileSync(profilePath, newContent, 'utf-8');
  console.log('✅ InstitutionProfileScreen.js updated successfully!');
  console.log('   - Added logout functionality');
  console.log('   - Added active status switch');
  console.log('   - Improved UI with section title');
} catch (err) {
  console.error('❌ Error updating file:', err.message);
  process.exit(1);
}
