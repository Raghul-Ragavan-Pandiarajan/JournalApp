import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddJournalScreen from './screens/AddJournalScreen';
import { useFonts } from "expo-font";
import ProfileScreen from './screens/ProfileScreen';
import ViewJournalScreen from './screens/ViewJournalScreen';
import configureStore from './redux/store.js/configureStore';
import { Provider } from 'react-redux';
import { Text, useColorScheme } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, user=>{
      if (user) {
        setUser(user)
      }
      else{
        setUser(null)
      }
    });
    return unsubscribe
  },[])

  
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
 
  
  let [fontsLoaded] = useFonts({
    "GeneralSans-Medium":require("./assets/fonts/OTF/GeneralSans-Medium.otf"),
    "GeneralSans-Regular":require("./assets/fonts/OTF/GeneralSans-Regular.otf"),
    "GeneralSans-Bold":require("./assets/fonts/OTF/GeneralSans-Bold.otf"),
    "GeneralSans-Light":require("./assets/fonts/OTF/GeneralSans-Light.otf"),
    "GeneralSans-SemiBold":require("./assets/fonts/OTF/GeneralSans-Semibold.otf"),
  });
  if (!fontsLoaded) {
    return <Text>App is loading</Text>;
  }
  else{
    
      const AuthenticatedStack = (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddJournal" component={AddJournalScreen} />
          <Stack.Screen name="ViewJournal" component={ViewJournalScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      );
  
      const UnauthenticatedStack = (
        <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      );
  
      return (
        <Provider store={configureStore}>
          <NavigationContainer theme={theme}>
            {user ? AuthenticatedStack : UnauthenticatedStack}
          </NavigationContainer>
        </Provider>
      );
    }
    
  
};

export default App;
