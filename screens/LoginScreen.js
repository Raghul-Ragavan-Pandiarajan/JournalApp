import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import { useTheme } from '@react-navigation/native';
import { signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider, signInWithRedirect  } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { PasswordInput } from '../components/PasswordInput';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const colors = useTheme().colors;
  

  const resetState = useCallback(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, []);

  useState(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetState();
    });
    return unsubscribe;
  }, [resetState, navigation]);

  const handleLogin = () => {

    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    else {
      setError('')
    }

    signInWithEmailAndPassword(auth, email, password)
     .then(userCredentials => {
       const user = userCredentials.user
       navigation.navigate('Home')
     })
     .catch((error) => {
      if (error.code == 'auth/invalid-email'){setError('Please enter a valid email address')}
      else if (error.code == 'auth/user-not-found'){setError('User not found . Please enter valid email address.')}
      else if (error.code == 'auth/wrong-password'){setError('Incorrect Email/Password. ')}
      else if (error.code == 'auth/too-many-requests'){setError('Server down. Please try again after some time.')}
     })
   }
  //  const handleGoogleLogin = () => {
  //     signInWithRedirect(auth)
  //     .then((result) => {
  //       // const credential = GoogleAuthProvider.credentialFromResult(result);
  //       // const token = credential.accessToken;
  //       // const user = result.user;
  //       console.log(result)
  //       navigation.navigate('Home')
  //     }).catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       const email = error.customData.email;
  //       // const credential = GoogleAuthProvider.credentialFromError(error);
  //       console.log(errorMessage, email)
  //     });
  //  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
    <View style={styles.titleContainer}>
      <Text style={[styles.title, {color: colors.text}]}>Sign In</Text>
      <Text style={[styles.description, {color: colors.text}]}>Muse: Unleash creativity daily with our intuitive journal app. Capture thoughts, track growth, and find inspiration on your journey of self-discovery.</Text>
    </View>
    <View style={styles.inputContainer}>
      <Text style={[styles.inputTitle, {color: colors.text}]}>Your Email</Text>
      <TextInput style={[styles.input, {color: colors.text}]} placeholder="Enter your email" keyboardType="email-address"
        autoCapitalize="none" onChangeText={text => setEmail(text)}/>
      <Text style={[styles.inputTitle, {color: colors.text}]}>Password</Text>
      <PasswordInput  placeholder="Enter password" secureTextEntry={true} onChangeText={text => setPassword(text)} />
      { (error ) && <Text style={styles.errorText}>{ error}</Text>}
      <TouchableOpacity style={styles.buttonSignup} onPress={handleLogin}>
        <Text style={styles.buttonTextSignup} >Sign In</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.orText}>Or</Text>
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={[styles.buttonGoogle, {backgroundColor: colors.background, borderColor: colors.border}]} >
      <AntDesign name="google" size={20} color={colors.text} style={styles.icon} /> 
        <Text style={[styles.buttonText, {color: colors.text}]}>Sign In with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonApple, {backgroundColor: colors.background, borderColor: colors.border}]}>
      <FontAwesome name="apple" size={20} color={colors.text} style={styles.icon} />
        <Text style={[styles.buttonText, {color: colors.text}]}>Sign In with Apple</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.loginContainer}>
      <Text style={[styles.inputTitle, {color: colors.text}]}>New Journal User?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.loginLink}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 30, 
    },
    titleContainer: {
      alignItems: 'flex-start',
      marginBottom: 20,
      marginTop: 20,
      margin: 15,
    },
    title: {
      fontFamily: 'GeneralSans-SemiBold',
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    description: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      marginBottom: 20,
    },
    inputContainer: {
      width: '90%',
      marginBottom: 20,
    },
    inputTitle: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 15,
      marginBottom: 15,
    },
    input: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 15,
      paddingHorizontal: 10,
      marginBottom: 15,
      height: 45,
    },
    buttonSignup: {
      backgroundColor: "#8568f0",
      borderRadius: 20,
      paddingVertical: 15,
      marginTop: 25,
      marginBottom: 15,
    },
    buttonTextSignup: {
      fontFamily: 'GeneralSans-SemiBold',
      fontSize: 16,
      textAlign: 'center',
      color: "white"
    },
    orText: {
      fontFamily: 'GeneralSans-Regular',
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 40,
      color: "grey"
    },
    buttonContainer: {
      width: '90%',
      marginBottom: 40,
      justifyContent: 'space-between'
    },
    buttonGoogle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', 
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 15,
      paddingVertical: 15,
      marginBottom: 20
    },
    buttonApple: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 15,
      paddingVertical: 15,
    },
    buttonText: {
      fontFamily: 'GeneralSans-SemiBold',
      fontSize: 16,
      textAlign: 'center',
    },
    icon: {
      marginRight: 10, 
    },
    loginContainer: {
      flexDirection: 'row',
    },
    loginText: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
    },
    loginLink: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      color: '#8568f0',
      marginLeft: 5,
    },
    errorText: {
      color: 'red',
      marginTop: 5,
      marginBottom: 10,
      marginLeft: 3,
      fontSize: 12,
    },
  });
  
export default LoginScreen;