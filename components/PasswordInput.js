import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import the desired icon library
import { useTheme } from '@react-navigation/native';

export const PasswordInput = ({ placeholder, value, onChangeText }) => {
  const [showPassword, setShowPassword] = useState(false);
  const colors = useTheme().colors;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between', borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 15 }}>
      <TextInput
        style={{color: colors.text, fontFamily: 'GeneralSans-Regular',
        fontSize: 14,
        paddingHorizontal: 10,
        height: 45,
        width: '80%',
    }}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity  style={{ alignItems: 'flex-end', paddingHorizontal: 10, width: '20%',}} onPress={togglePasswordVisibility}>
        <Ionicons name={showPassword ? 'ios-eye-off' : 'ios-eye'} size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};