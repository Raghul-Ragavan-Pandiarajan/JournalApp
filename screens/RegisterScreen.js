import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [name, setName] = useState('')
  const [errorName, setErrorName] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPass, setErrorPass] = useState('')
  const [errorReenteredPass, setErrorReenteredPass] = useState('');
  const [error, setError] = useState('')

  const resetState = useCallback(() => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setErrorEmail('');
    setErrorName('');
    setErrorPass('');
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetState();
    });

    return unsubscribe;
  }, [resetState, navigation]);


  const handleSignUp = () => {
    setError('');
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    else {
      setError('')
    }
  if (error == '' && errorEmail == '' && errorPass == '' && errorName == ''){
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      const user = userCredentials.user
      updateProfile(user, {
        displayName: name
      })
      navigation.navigate('Login')
    })
    .catch(error => {
      if (error.code == 'auth/email-already-in-use'){setError('User found with entered email. Try another.')}
    })
  }
   
  }

  const colors = useTheme().colors;
  return (
    <KeyboardAwareScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, {color: colors.text}]}>Sign Up</Text>
        <Text style={[styles.description, {color: colors.text}]}>Muse: Unleash creativity daily with our intuitive journal app. Capture thoughts, track growth, and find inspiration on your journey of self-discovery.</Text>
      </View>
      <View style={styles.inputContainer}>
      <Text style={[styles.inputTitle, {color: colors.text}]}>Your Name</Text>
        <TextInput style={[styles.input, {color: colors.text}, 
        errorName ? styles.inputWithError : {}]} 
        placeholder="Enter your Name" 
        onEndEditing={()=> {
          const namePattern = /^[A-Za-z\s]+$/;

          if (!namePattern.test(name)) {
            setErrorName('Name should only contain letters and spaces');
            return;
          }
          else {setErrorName('')}
        }}
        onChangeText={(text) =>{
          setName(text)
          setErrorName('')
          setError('')
        } 
          }/>
          {errorName && <Text style={styles.errorText}>{errorName}</Text>}
        <Text style={[styles.inputTitle, {color: colors.text}]}>Your Email</Text>
        <TextInput style={[styles.input, {color: colors.text}, errorEmail ? styles.inputWithError : {}]} placeholder="Enter your email" 
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) =>{
          setErrorEmail('')
          setEmail(text)
          setError('')}}
        onEndEditing={() =>{
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
          if (!emailPattern.test(email)) {
            setErrorEmail('Please enter a valid email address');
            return;
          }
          else {setErrorEmail('')}
    
        }
      }/>
      {errorEmail && <Text style={styles.errorText}>{errorEmail}</Text>}
        <Text style={[styles.inputTitle, {color: colors.text}]}>Password</Text>
        <TextInput style={[styles.input, {color: colors.text}, errorPass ? styles.inputWithError : {}]} placeholder="Enter password" secureTextEntry={true}
          onChangeText={(text) =>{
            setErrorPass('')
            setPassword(text)
            setError('')}}
          onEndEditing={() =>{
          const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  
    if (!passwordPattern.test(password)) {
      setErrorPass('Password should have at least 8 characters, one capital letter, one number, and one special character');
      return;
    }
          else {setErrorPass('')}
    
        }
      }/>
{errorPass && <Text style={styles.errorText}>{errorPass}</Text>}
<Text style={[styles.inputTitle, {color: colors.text}]}>Reenter Password</Text>
<TextInput
  style={[
    styles.input,
    {color: colors.text},
    errorPass ? styles.inputWithError : {},
    errorReenteredPass ? styles.inputWithError : {},
  ]}
  placeholder="Reenter password"
  secureTextEntry={true}
  onChangeText={(text) => {
    setErrorReenteredPass('');
    setReenteredPassword(text);
  }}
  onEndEditing={() => {
    if (reenteredPassword !== password) {
      setErrorReenteredPass('Passwords do not match');
    }
  }}
/>
      
      { (error || errorReenteredPass) && <Text style={styles.errorText}>{ error != '' ? error : errorReenteredPass}</Text>}
        <TouchableOpacity style={styles.buttonSignup} onPress={handleSignUp}>
          <Text style={styles.buttonTextSignup} >Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, {color: colors.text}]}>Already Have an Account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
          
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
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
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
  inputWithError: {
    borderColor: 'red',
  },

  inputTitleError: {
    color: 'red',
  },

  errorText: {
    color: 'red',
    marginBottom: 15,
    marginLeft: 3,
    fontSize: 12,
  },
});

export default RegisterScreen;
