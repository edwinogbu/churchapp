import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import RootNavigator from './screens/navigation/RootNavigator';
import { AuthProvider } from './screens/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
          <RootNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

