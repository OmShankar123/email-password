import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return subscriber; // Unsubscribe on unmount
  }, []);

  const signIn = async (email, password) => {
    setLoading(true); 
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential; 
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('User not registered. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else {
        throw new Error('An error occurred during sign-in. Please try again later.');
      }
    } finally {
      setLoading(false); 
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Sign Up Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check and try again.');
      } else {
        throw new Error('An error occurred during sign-up. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true); 
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Sign Out Error:", error);
      throw error;
    } finally {
      setLoading(false); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
