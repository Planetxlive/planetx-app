import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { Eye, EyeOff } from 'lucide-react-native';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  editable?: boolean;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  editable = true,
}: InputProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.errorColor : colors.grayMedium,
          },
          multiline && { height: numberOfLines * 24 + 16 },
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 12,
              paddingRight: rightIcon || secureTextEntry ? 40 : 12,
            },
            multiline && { textAlignVertical: 'top' },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.grayDark}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            {showPassword ? (
              <Eye size={20} color={colors.grayDark} />
            ) : (
              <EyeOff size={20} color={colors.grayDark} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.errorColor }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  leftIconContainer: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});