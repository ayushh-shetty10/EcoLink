import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  icon,
  disabled = false,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          error && styles.errorBorder,
          disabled && styles.disabled,
        ]}
      >
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const Dropdown = ({
  label,
  options = [],
  selectedValue,
  onValueChange,
  placeholder,
  error,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedValue),
    [options, selectedValue]
  );

  const handleSelect = (value) => {
    onValueChange?.(value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[
          styles.dropdownWrapper,
          error && styles.errorBorder,
          disabled && styles.disabled,
        ]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedOption && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => null}>
            <Text style={styles.modalTitle}>{label || 'Select option'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText} numberOfLines={1}>
                    {option.emoji ? `${option.emoji} ` : ''}
                    {option.label}
                  </Text>
                  {selectedValue === option.id ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  inputWithIcon: {
    marginLeft: spacing.sm,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  icon: {
    marginTop: 1,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    marginRight: spacing.sm,
  },
  placeholderText: {
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionItem: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundAlt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.sm,
  },
});

export { Input, Dropdown };
