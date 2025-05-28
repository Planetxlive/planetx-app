import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  KeyboardTypeOptions,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

type OTPInputProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  error?: string;
};

export default function OTPInput({
  length,
  value,
  onChange,
  keyboardType = 'numeric',
  style,
  error,
}: OTPInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [isFocused, setIsFocused] = useState<boolean[]>(Array(length).fill(false));

  // Create an array of individual characters from the input value
  const valueArray = value.split('');
  while (valueArray.length < length) {
    valueArray.push('');
  }

  useEffect(() => {
    // When component mounts, focus the first input
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (text: string, index: number) => {
    const newValue = [...valueArray];
    
    // Handle backspace
    if (text === '') {
      newValue[index] = '';
      onChange(newValue.join(''));
      
      // Focus previous input if available
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }
    
    // Take only the last character if more than one is entered
    const lastChar = text.slice(-1);
    newValue[index] = lastChar;
    onChange(newValue.join(''));
    
    // Focus next input if available
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // Hide keyboard if last input is filled
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace when input is empty
    if (e.nativeEvent.key === 'Backspace' && valueArray[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    const newFocusState = [...isFocused];
    newFocusState[index] = true;
    setIsFocused(newFocusState);
  };

  const handleBlur = (index: number) => {
    const newFocusState = [...isFocused];
    newFocusState[index] = false;
    setIsFocused(newFocusState);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputsContainer}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.input,
                {
                  borderColor: error
                    ? colors.errorColor
                    : isFocused[index]
                    ? colors.primaryColor
                    : colors.grayMedium,
                  color: colors.text,
                  backgroundColor: colors.inputBackground,
                },
              ]}
              keyboardType={keyboardType}
              maxLength={1}
              value={valueArray[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              autoCorrect={false}
              selectTextOnFocus={true}
            />
          ))}
      </View>
      {error && <Text style={[styles.errorText, { color: colors.errorColor }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});