import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CallsScreen from '../screens/CallsScreen';
import RestaurantsScreen from '../screens/RestaurantsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Calls" component={CallsScreen} />
            <Tab.Screen name="Restaurants" component={RestaurantsScreen}/>
            <Tab.Screen name="Calendar" component={CalendarScreen}/>
            <Tab.Screen name="Dashboard" component={DashboardScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
    );
};

export default TabNavigator;