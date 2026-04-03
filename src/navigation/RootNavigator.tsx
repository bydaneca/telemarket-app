import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Stack.Navigator screenOptions={{ headerShown : false }}>
            {isLoggedIn ? (
                <Stack.Screen name="Main" component={TabNavigator} />
            ) : (
                <Stack.Screen name="Login">
                    {props => (
                        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
                    )}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    );
};

export default RootNavigator;