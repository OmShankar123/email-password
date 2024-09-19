import React, { useContext } from 'react';

import { AuthContext } from '../screens/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddProduct from '../screens/AddProduct';
import UpdateProduct from '../screens/UpdateProduct';
import MyProducts from '../screens/MyProducts';
import Main from '../screens/Main';
import TabNavigator from '../screens/TabNavigator';
const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}
      >
        {user ? (
          <Stack.Screen name="Home" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Registration" component={Main} />
          
        )}
        <Stack.Screen
          name="Add Product"
          component={AddProduct}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UpdateProduct"
          component={UpdateProduct}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="MyProducts"
          component={MyProducts}
          options={{ headerShown: true }}
        />

    
      </Stack.Navigator>
    </NavigationContainer>
  );
};
