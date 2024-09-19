import React from 'react';
import { AppNavigator } from './src/navigator/AppNavigator';

import { AuthProvider } from './src/screens/AuthContext';
import '@react-native-firebase/app'; 

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator /> 
    </AuthProvider>
  );
};

export default App;
