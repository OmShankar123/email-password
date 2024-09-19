
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Linking,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(false); 
  const animatedValue = useRef(new Animated.Value(0)).current; 

  const generateRandomId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 10000);
    return `${timestamp}-${randomNum}`;
  };

  const handleAddProduct = async () => {
    if (!title || !price || !description || !category || !image) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Price must be a valid number greater than 0.');
      return;
    }

    setLoading(true); // Start loader

    // Start the animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    try {
      const productId = generateRandomId();
      const newProduct = {
        id: productId,
        title,
        price: parseFloat(price),
        description,
        image,
        category,
      };

      // Upload the image to Firebase Storage
      const uploadUri = image;
      const fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const reference = storage().ref(fileName);

      await reference.putFile(uploadUri);

      // Get the download URL
      const imageUrl = await reference.getDownloadURL();
      newProduct.image = imageUrl; // Add the image URL to the product object

      await AsyncStorage.setItem(`product_${productId}`, JSON.stringify(newProduct));
      Alert.alert('Success', 'Product added successfully! Note: Product image is automatically added to Firebase Storage');

      // Clear input fields
      setTitle('');
      setPrice('');
      setDescription('');
      setImage('');
      setCategory('');
      setPriceError('');
    } catch (error) {
      console.error('Failed to add product:', error);
      Alert.alert('Error', 'Failed to add product.');
    } finally {
      setLoading(false);

      // Reset the animation
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleImageSelect = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: handleCamera },
        { text: 'Gallery', onPress: handleGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true; 
    }
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Camera Permission Required',
        'This app needs camera access to take photos. Please enable it in app settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setImage(imageUri);
      }
    });
  };

  const handleGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setImage(imageUri);
      }
    });
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    if (isNaN(value) || parseFloat(value) <= 0) {
      setPriceError('Price must be a valid number greater than 0.');
    } else {
      setPriceError('');
    }
  };

  // Animated styles
  const animatedStyle = {
    borderRadius: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [8, 30], 
    }),
    width: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 60], 
    }),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>

      <TextInput
        style={styles.input}
        placeholderTextColor={'#888'}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={'#888'}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={handlePriceChange}
      />
      {priceError ? <Text style={styles.error}>{priceError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholderTextColor={'#888'}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={'#888'}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      ) : null}

      <TouchableOpacity onPress={handleImageSelect} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>
          {image ? 'Change Product Image' : 'Pick a Product Image'}
        </Text>
      </TouchableOpacity>
<TouchableWithoutFeedback
 onPress={handleAddProduct}
>
      <Animated.View style={[animatedStyle, styles.button]}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <TouchableOpacity onPress={handleAddProduct} style={{}}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',

   alignItems:"center"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    width:"100%",
    color: '#000',
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
   // paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  imagePicker: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    width:"100%",
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#000',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
});

export default AddProduct;
