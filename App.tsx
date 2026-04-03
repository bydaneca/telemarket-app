import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
