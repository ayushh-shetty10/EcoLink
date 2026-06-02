import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants';

const Icon = ({
  name,
  size = 24,
  color = colors.text,
  style,
}) => {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

const TabIcon = ({ name, size = 24, color = colors.text, label = '' }) => {
  return (
    <Icon name={name} size={size} color={color} />
  );
};

export { Icon, TabIcon };
