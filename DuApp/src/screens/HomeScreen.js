// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
// import { AuthContext } from './AuthContext'; 
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const HomeScreen = ({ navigation }) => {
//   const { signOut } = useContext(AuthContext);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true); // Track if there are more products to load

//   useEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
//           <Text style={styles.logoutText}>Sign Out</Text>
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   // Fetch products from the API
//   const fetchProducts = async (pageNumber) => {
//     setLoading(pageNumber === 1); // Show loading for the first fetch
//     try {
//       const response = await fetch(`https://fakestoreapi.com/products?limit=10&page=${pageNumber}`);
//       const json = await response.json();
      
//       if (json.length > 0) {
//         setProducts(prevProducts => [...prevProducts, ...json]);
//       } else {
//         setHasMore(false); // No more products to load
//       }
//       setLoading(false);
//       setLoadingMore(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//       setLoadingMore(false);
//       Alert.alert('Error', 'Failed to fetch products.');
//     }
//   };

//   useEffect(() => {
//     fetchProducts(page);
//   }, [page]);

//   // Handle delete product
//   const handleDeleteProduct = (id) => {
//     setLoading(true);
//     fetch(`https://fakestoreapi.com/products/${id}`, {
//       method: 'DELETE',
//     })
//       .then(() => {
//         setProducts(products.filter(product => product.id !== id));
//         setLoading(false);
//         Alert.alert('Success', 'Product deleted successfully!');
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//         Alert.alert('Error', 'Failed to delete product.');
//       });
//   };

//   // Render each product in the FlatList
//   const renderProduct = ({ item }) => (
//     <View style={styles.productContainer}>
//       <Image source={{ uri: item.image }} style={styles.productImage} />
//       <View style={styles.productDetails}>
//         <Text  numberOfLines={2} style={styles.title}>{item.title}</Text>
//         <Text style={styles.price}>${item.price.toFixed(2)}</Text>
//       </View>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => handleDeleteProduct(item.id)}
//       >
//         <Text style={styles.deleteButtonText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Load more products when the user scrolls to the bottom
//   const loadMoreProducts = () => {
//     if (!loadingMore && hasMore) {
//       setLoadingMore(true);
//       setPage(prevPage => prevPage + 1);
//     }
//   };

//   // Show loader while data is being fetched
//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Products from Fake Store API</Text>
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.id.toString()} // Unique key for each item
//         renderItem={renderProduct}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         onEndReached={loadMoreProducts}
//         onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
//         ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null} // Loader at the bottom
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   logoutButton: {
//     marginRight: 10,
//     padding: 8,
//   },
//   logoutText: {
//     color: '#FF6347', // Tomato color for a fresh look
//     fontWeight: 'bold',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     marginHorizontal:10,
//     padding: 16,
//     marginBottom: 16,
//     borderRadius: 10,
//     elevation: 3,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowRadius: 6,
//   },
//   productImage: {
//     width: 80,
//     height: 80,
//     resizeMode: 'contain',
//     borderRadius: 10,
//     marginRight: 16,
//     borderColor: '#ccc',
//     borderWidth: 1,
  
//   },
//   productDetails: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingRight: 16,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   price: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#666',
//   },
//   deleteButton: {
//     backgroundColor: '#F44336',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   listContainer: {
//     paddingBottom: 20, // Add some padding at the bottom
//   },
//   footerLoader: {
//     padding: 10,
//   },
// });

// export default HomeScreen;


import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from './AuthContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchProducts = async (pageNumber) => {
    setLoading(pageNumber === 1); 
    try {
      const response = await fetch(`https://fakestoreapi.com/products?limit=10&page=${pageNumber}`);
      const json = await response.json();
      
      if (json.length > 0) {
        setProducts(prevProducts => [...prevProducts, ...json]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setLoadingMore(false);
      Alert.alert('Error', 'Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDeleteProduct = (id) => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
        setLoading(false);
        Alert.alert('Success', 'Product deleted successfully!');
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        Alert.alert('Error', 'Failed to delete product.');
      });
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteProduct(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF9900" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products from Fake Store API</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    marginRight: 10,
    padding: 8,
  },
  logoutText: {
    color: '#FF9900',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 10,
    marginRight: 16,
    borderColor: '#ccc',
    borderWidth: 1,
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
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  footerLoader: {
    padding: 10,
  },
});

export default HomeScreen;
