import React, { use, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { getProducts } from "../services/apiService";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import Header from "../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { isLogin } from "../middleware/authMiddleware";

function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 30;

  const CekLogin = async () => {
    try {
      const cek = await isLogin();
      if (!cek) {
        navigation.navigate("LogoutScreen");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CekLogin();
    if (hasMoreData) {
      fetchProducts(limit, currentPage, searchQuery);
    }
  }, [currentPage, hasMoreData]);

  useFocusEffect(
    React.useCallback(() => {
      setProducts([]);
      fetchProducts(limit, currentPage, searchQuery);

      if (hasMoreData) {
        fetchProducts(limit, currentPage, searchQuery);
      }
    }, [currentPage, hasMoreData])
  );

  const fetchProducts = async (limit, currentPage, searchInput) => {
    setIsLoading(true);
    try {
      const response = await getProducts(limit, currentPage, searchInput);
      if (response.data.data.length > 0) {
        setProducts((prevProducts) => {
          const newProducts = response.data.data.filter(
            (newProduct) =>
              !prevProducts.some((product) => product.id === newProduct.id)
          );
          return [...prevProducts, ...newProducts];
        });
      }

      // Cek apakah masih ada data untuk dimuat
      if (
        response.meta.pagination.current_page >=
        response.meta.pagination.last_page
      ) {
        setHasMoreData(false); // Jika sudah sampai halaman terakhir
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  // Fungsi untuk memuat data lebih lanjut
  const loadMoreData = () => {
    if (!isLoading && hasMoreData) {
      setCurrentPage((prevPage) => prevPage + 1); // Naikkan currentPage
    }
  };

  const onSearch = (text) => {
    setSearchQuery(text);
    setProducts([]);
    setCurrentPage(1);
    setHasMoreData(true);
    fetchProducts(limit, 1, text);
  };

  return (
    <MainLayout>
      <Header>Product</Header>
      <View>
        <TextInput
          placeholder="Search Products..."
          onChangeText={onSearch}
          value={searchQuery}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerName}>Product Name</Text>
        <Text style={styles.headerQty}>Qty</Text>
      </View>

      <View style={styles.row} />
      {products &&
        products.map((product, index) => (
          <View style={styles.productContainer} key={`${product.id}-${index}`}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productQty}>{product.stock}</Text>
          </View>
        ))}
      {products.length === 0 && !isLoading && (
        <Text style={{ textAlign: "center" }}>No products found</Text>
      )}
      <View style={styles.rowProduct} />

      {/* Tombol Load More */}
      {limit > 30 && hasMoreData && (
        <TouchableOpacity onPress={loadMoreData} disabled={isLoading}>
          <Text style={{ fontSize: 12, textAlign: "center" }}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              "Load More"
            )}
          </Text>
        </TouchableOpacity>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerName: {
    width: "80%",
    fontWeight: "bold",
    fontSize: 14,
  },
  headerQty: {
    width: "20%",
    alignSelf: "center",
    alignItems: "end",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    width: "80%",
    fontSize: 12,
  },
  productQty: {
    width: "20%",
    alignSelf: "center",
    alignItems: "end",
    textAlign: "center",
    fontSize: 12,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
    paddingVertical: 4,
  },
  rowProduct: {
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
});

export default ProductScreen;
