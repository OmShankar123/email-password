import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import { AuthContext } from './AuthContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProducts = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        setLoading(true); 
        try {
          const keys = await AsyncStorage.getAllKeys();
          const productKeys = keys.filter(key => key.startsWith('product_'));
          const products = await Promise.all(productKeys.map(key => AsyncStorage.getItem(key)));
          const parsedProducts = products.map(product => JSON.parse(product)).filter(Boolean); // Filter out null values
          setProducts(parsedProducts);
        } catch (error) {
          console.error('Failed to fetch products:', error);
          Alert.alert('Error', 'Failed to fetch products.');
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchProducts();
    }, [])
  );

  const handleDeleteProduct = async (productId) => {
    try {
      await AsyncStorage.removeItem(`product_${productId}`);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      Alert.alert('Success', 'Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      Alert.alert('Error', 'Failed to delete product.');
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate('UpdateProduct', { product: item })}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>No products added yet.</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add Product')}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()} // Ensure unique keys
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Add Product')}>
        <Image
          source={require('../assets/more.png')}
          style={styles.floatingButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: "#8E8E8E",
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: 'white',
  },
});

export default MyProducts;
