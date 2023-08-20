import React, {useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from './../AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';


const RootNavigator = () => {
  const { state: { user } } = useContext(AuthContext);


  return (
    <NavigationContainer>
        {user ? (
          <AppStack />
        ) : (
          <AuthStack />
        )}
    </NavigationContainer>
  );
};

export default RootNavigator;
