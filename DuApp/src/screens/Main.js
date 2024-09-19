

import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from './AuthContext'; 
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const Main = () => {
  const { signIn, signUp } = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const animatedValue = useRef(new Animated.Value(0)).current; 

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true); 
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    try {
      if (isSignUp) {
        await signUp(email, password);
        Alert.alert('Success', 'You are now signed up.');
      } else {
        await signIn(email, password);
        Alert.alert('Success', 'You are now signed in.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false); 
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const animatedStyle = {
    borderRadius: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 30],
    }),
    width: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 60],
    }),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.header}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#888"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#888"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableWithoutFeedback onPress={handleAuth}>
          <View style={styles.buttonContainer}>
            <Animated.View style={[animatedStyle, styles.button]}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', 
    padding: 16,
  },
  inner: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center', 
    marginHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  textInput: {
    height: 50,
    borderColor: '#ddd',
    color:"#000",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#fafafa',
  },
  buttonContainer: {
    alignItems: 'center', 
    width: '100%', 
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FFA41C',
    borderRadius: 8,
    elevation: 4,
    width: '100%',
    padding: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007185', 
    fontSize: 16,
  },
});

export default Main;
