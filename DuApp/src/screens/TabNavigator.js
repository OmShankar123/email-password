import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyProducts from './MyProducts';
import HomeScreen from './HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Api Products"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="cloud" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Local Products"
        component={MyProducts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="store" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({});
