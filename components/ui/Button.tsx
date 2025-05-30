import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const getButtonStyles = () => {
    let baseStyle: ViewStyle = {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle = { ...baseStyle, paddingVertical: 8, paddingHorizontal: 16 };
        break;
      case 'medium':
        baseStyle = { ...baseStyle, paddingVertical: 12, paddingHorizontal: 24 };
        break;
      case 'large':
        baseStyle = { ...baseStyle, paddingVertical: 16, paddingHorizontal: 32 };
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.primaryColor,
        };
        break;
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.secondaryColor,
        };
        break;
      case 'outline':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primaryColor,
        };
        break;
      case 'text':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
        break;
    }

    // Width style
    if (fullWidth) {
      baseStyle = { ...baseStyle, width: '100%' };
    }

    // Disabled style
    if (disabled) {
      baseStyle = {
        ...baseStyle,
        opacity: 0.5,
      };
    }

    return baseStyle;
  };

  const getTextStyles = () => {
    let baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle = { ...baseStyle, fontSize: 14 };
        break;
      case 'medium':
        baseStyle = { ...baseStyle, fontSize: 16 };
        break;
      case 'large':
        baseStyle = { ...baseStyle, fontSize: 18 };
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle = {
          ...baseStyle,
          color: 'white',
        };
        break;
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          color: 'white',
        };
        break;
      case 'outline':
        baseStyle = {
          ...baseStyle,
          color: colors.primaryColor,
        };
        break;
      case 'text':
        baseStyle = {
          ...baseStyle,
          color: colors.primaryColor,
        };
        break;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? colors.primaryColor : 'white'}
          size="small"
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}