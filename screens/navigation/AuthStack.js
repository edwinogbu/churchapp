import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './../WelcomeScreen';
import LoginScreen from './../LoginScreen';
import SignUpScreen from './../SignUpScreen';
import {themeColors} from './../../theme'

import { useFonts } from 'expo-font';
import Home from './../Home';

const theme = {
    ...themeColors,
    colors: {
        ...themeColors.bg,
        border: "transparent",
    },
};


const Stack = createNativeStackNavigator();


export default function AuthStack() {
  const [loaded] = useFonts({
    "Roboto-Black" : require('./../../assets/fonts/Roboto-Black.ttf'),
    "Roboto-Bold" : require('./../../assets/fonts/Roboto-Bold.ttf'),
    "Roboto-Regular" : require('./../../assets/fonts/Roboto-Regular.ttf'),
})

if(!loaded){
    return null;
}

  return (
    // <NavigationContainer>
    // <NavigationContainer>
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
        initialRouteName={'Welcome'}
    >
      {/* <Stack.Navigator initialRouteName='Welcome'> */}
        {/* <Stack.Screen name="Home" options={{headerShown: false}} component={Home} /> */}
        <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
      </Stack.Navigator>
    // </NavigationContainer>
  )
}