import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import { Dropdown, Input } from '../components/Input';
import { Container, Spacer } from '../components/Layout';
import { useUser } from '../context/UserContext';
import { actions, colors, conditions, spacing, wasteCategories } from '../constants';

const AddWasteScreen = ({ navigation }) => {
  const { addWasteItem, updateUserPoints, addBadge } = useUser();
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [image, setImage] = useState(null);

  const availableActions = useMemo(() => {
    if (condition === 'working') {
      return [
        { id: actions.SELL, label: 'Sell', emoji: '💰' },
        { id: actions.DONATE, label: 'Donate', emoji: '🎁' },
      ];
    }

    if (condition === 'not-working') {
      return [{ id: actions.RECYCLE, label: 'Recycle', emoji: '♻️' }];
    }

    return [];
  }, [condition]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!title || !selectedCategory || !condition || !selectedAction) {
      alert('Please fill all required fields.');
      return;
    }

    const createdItem = addWasteItem({
      title,
      category: selectedCategory,
      condition,
      description,
      action: selectedAction,
      image: image || '📦',
    });

    let points = 0;

    if (selectedAction === actions.DONATE) {
      points = 10;
      addBadge('first-donation');
    }

    if (selectedAction === actions.RECYCLE) {
      points = 5;
      addBadge('first-recycle');
    }

    updateUserPoints(points);

    if (selectedAction === actions.RECYCLE) {
      navigation.navigate('VendorDirectory', { item: createdItem, forPickup: true });
      return;
    }

    alert(`Item added successfully. You earned ${points} points.`);
    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Container padded>
        <View style={styles.cameraSection}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>{image ? '✅' : '📸'}</Text>
            <Text style={styles.imageStateText}>{image ? 'Image Selected' : 'Add Item Photo'}</Text>
          </View>

          <Spacer size="sm" />

          <Button title="Upload Image" onPress={handlePickImage} variant="outline" size="medium" />

          <Text style={styles.helpText}>Use a clear front-facing photo for faster pickup approvals.</Text>
        </View>

        <Spacer size="lg" />

        <Input
          label="Device Name"
          placeholder="e.g., Old Dell Laptop"
          value={title}
          onChangeText={setTitle}
          icon="tag"
        />

        <Dropdown
          label="Category"
          placeholder="Select category"
          options={wasteCategories}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
        />

        <Dropdown
          label="Condition"
          placeholder="Select condition"
          options={conditions}
          selectedValue={condition}
          onValueChange={(value) => {
            setCondition(value);
            setSelectedAction('');
          }}
        />

        <Input
          label="Description (Optional)"
          placeholder="Add item details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          icon="note-text-outline"
        />

        {condition ? (
          <>
            <Spacer size="sm" />
            <Text style={styles.actionLabel}>What would you like to do?</Text>

            <View style={styles.actionButtons}>
              {availableActions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.actionButton,
                    selectedAction === option.id && styles.actionButtonSelected,
                  ]}
                  onPress={() => setSelectedAction(option.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.actionButtonEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.actionButtonText,
                      selectedAction === option.id && styles.actionButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : null}

        {selectedAction ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              {selectedAction === actions.DONATE
                ? 'Donate this item'
                : selectedAction === actions.SELL
                ? 'Sell this item'
                : 'Recycle this item'}
            </Text>
            <Text style={styles.infoText}>
              {selectedAction === actions.DONATE
                ? 'Donation gives you 10 points and unlocks badge progress.'
                : selectedAction === actions.SELL
                ? 'Selling keeps devices in use and supports circular economy.'
                : 'Recycling gives you 5 points and opens vendor pickup options.'}
            </Text>
          </View>
        ) : null}

        <Spacer size="xl" />

        <Button
          title="Continue"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          disabled={!selectedAction}
        />

        <Spacer size="sm" />

        <Button
          title="Cancel"
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
  cameraSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  imagePlaceholder: {
    width: '100%',
    maxWidth: 260,
    minHeight: 180,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  imagePlaceholderText: {
    fontSize: 42,
    marginBottom: spacing.xs,
  },
  imageStateText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  helpText: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 86,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  actionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  actionButtonEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  actionButtonTextSelected: {
    color: colors.primary,
  },
  infoBox: {
    marginTop: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});

export default AddWasteScreen;
