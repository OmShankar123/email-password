import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const UpdateProduct = ({ route, navigation }) => {
  const { product } = route.params;
  
  const [title, setTitle] = useState(product.title || '');
  const [price, setPrice] = useState(product.price.toString() || '');
  const [description, setDescription] = useState(product.description || '');
  const [image, setImage] = useState(product.image || '');
  const [category, setCategory] = useState(product.category || '');
  const [priceError, setPriceError] = useState('');

  const handleUpdateProduct = async () => {
    if (!title || !price || !description || !category || !image) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Price must be a valid number greater than 0.');
      return;
    }

    try {
      const updatedProduct = {
        id: product.id,
        title,
        price: parseFloat(price),
        description,
        image,
        category,
      };

      await AsyncStorage.setItem(`product_${product.id}`, JSON.stringify(updatedProduct));
      Alert.alert('Success', 'Product updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update product:', error);
      Alert.alert('Error', 'Failed to update product.');
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

  const handleCamera = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Product</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product title"
        placeholderTextColor={'#888'}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product price"
        placeholderTextColor={'#888'}
        keyboardType="numeric"
        value={price}
        onChangeText={handlePriceChange}
      />
      {priceError ? <Text style={styles.error}>{priceError}</Text> : null}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product description"
        placeholderTextColor={'#888'}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product category"
        placeholderTextColor={'#888'}
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

      <TouchableOpacity style={styles.button} onPress={handleUpdateProduct}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 50,
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
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePicker: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    color: '#000',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
  },
});

export default UpdateProduct;
