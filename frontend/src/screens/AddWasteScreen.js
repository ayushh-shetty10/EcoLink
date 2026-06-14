import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import { Dropdown, Input } from '../components/Input';
import { Container, Spacer } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import institutionService from '../services/institutionService';
import pickupRequestService from '../services/pickupRequestService';
import imageService from '../services/imageService';
import { actions, colors, conditions, spacing, wasteCategories } from '../constants';

const AddWasteScreen = ({ navigation }) => {
  const { user: authUser } = useAuth();
  const { addWasteItem, updateUserPoints, addBadge } = useUser();
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !selectedCategory || !condition || !selectedAction) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    if (selectedAction === actions.RECYCLE && !image) {
      Alert.alert('Image Required', 'Please select an image for recycling items.');
      return;
    }

    const createdItem = addWasteItem({
      title,
      category: selectedCategory,
      condition,
      description,
      action: selectedAction,
      image: image?.uri || '📦',
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
      setUploading(true);
      try {
        let imageUrl = null;
        let imageUploadWarning = null;

        if (!authUser?.id) {
          throw new Error('User session not found');
        }

        // Upload image first, but treat upload failures as non-blocking.
        if (image?.base64 || image?.uri) {
          const fileName = imageService.generateImageFileName(authUser.id);
          const uploadRes = await imageService.uploadImageToStorage(fileName, image);
          if (uploadRes.error) {
            imageUploadWarning = uploadRes.error;
            console.warn('Image upload failed, creating request without image URL:', uploadRes.error);
          } else {
            imageUrl = uploadRes.url;
          }
        }

        // Find an available institution for pickup
        const institutionsRes = await institutionService.listAvailableInstitutions(1);
        const assignedInstitution = institutionsRes?.data?.[0] || null;

        // Create pickup request with the uploaded image URL if available.
        const requestRes = await pickupRequestService.createPickupRequest({
          user_id: authUser.id,
          institution_id: assignedInstitution?.id || null,
          title,
          category: selectedCategory,
          condition,
          image_url: imageUrl,
          status: 'pending',
        });

        if (requestRes.error) {
          throw requestRes.error;
        }

        setUploading(false);

        if (assignedInstitution) {
          Alert.alert(
            'Pickup Request Created',
            imageUploadWarning
              ? `Your pickup request has been assigned to ${assignedInstitution.name}.\n\nThe image upload failed, but your request was saved.\n\nYou earned ${points} points!`
              : `Your pickup request has been assigned to ${assignedInstitution.name}.\n\nYou earned ${points} points!`
          );
        } else {
          Alert.alert(
            'Pickup Request Created',
            imageUploadWarning
              ? `Your request will be assigned when an institution is available.\n\nThe image upload failed, but your request was saved.\n\nYou earned ${points} points!`
              : `Your request will be assigned when an institution is available.\n\nYou earned ${points} points!`
          );
        }

        navigation.navigate('VendorDirectory', { item: createdItem, forPickup: true });
        return;
      } catch (e) {
        setUploading(false);
        console.warn('Pickup request error:', e);
        Alert.alert(
          'Error',
          e?.message || 'Unable to create pickup request. Please try again.'
        );
        return;
      }
    }

    Alert.alert('Success', `Item added successfully. You earned ${points} points.`);
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
          title={uploading ? 'Creating Pickup Request...' : 'Continue'}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          disabled={!selectedAction || uploading}
          loading={uploading}
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
