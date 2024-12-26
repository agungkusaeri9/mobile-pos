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
  Image,
} from "react-native";
import { getTransactions } from "../services/apiService";
import { TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { isLogin } from "../middleware/authMiddleware";
import { formatRupiah } from "../helpers/formatRupiah";
import { dateFormat } from "../helpers/dateFormat";

function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 1000;

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
    fetchtransactions(limit);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setTransactions([]);
      fetchtransactions(limit);
    }, [])
  );

  const navigation = useNavigation();
  const fetchtransactions = async (limit) => {
    setIsLoading(true);
    try {
      const response = await getTransactions(limit);
      console.log(response.data.data.data);
      if (response.data.data.length > 0) {
        setTransactions((prevTransaction) => {
          const newtransactions = response.data.data.filter(
            (newtransaction) =>
              !prevTransaction.some(
                (transaction) => transaction.id === newtransaction.id
              )
          );
          return [...prevTransaction, ...newtransactions];
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

  return (
    <MainLayout>
      <Header>Transactions</Header>
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            color: "white",
          }}
          onPress={() => navigation.navigate("TransactionCreateScreen")}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Create Transaction
          </Text>
        </TouchableOpacity>
      </View>
      {transactions &&
        transactions.map((transaction, index) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TransactionDetailScreen", {
                code: transaction.code,
              });
            }}
            // key={transaction.code}
          >
            <View
              style={{
                marginBottom: 10,
                backgroundColor: "white",
                elevation: 4,
                borderRadius: 5,
                padding: 10,
                cursor: "pointer",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text>{transaction.code}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12 }}>
                    {dateFormat(transaction.created_at, "dd MMMM yyyy")}
                  </Text>
                </View>
              </View>
              {transaction.details.map((detail, i) => (
                <View
                  // key={detail.id + i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                >
                  <Image
                    source={{ uri: detail.product.image }}
                    style={{ width: 50, height: 40 }}
                  />
                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontWeight: "light",
                        fontSize: 10,
                        color: "#000",
                      }}
                    >
                      X : {detail.qty}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "light",
                        fontSize: 10,
                        color: "#000",
                      }}
                    >
                      Rp: {formatRupiah(detail.price)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontWeight: "", fontSize: 12 }}>
                  Total :
                  {transaction.price_discount > 0 && (
                    <Text
                      style={{
                        fontWeight: "light",
                        textDecorationLine: "line-through",
                        fontStyle: "italic",
                        color: "#000",
                      }}
                    >
                      {" "}
                      Rp. {formatRupiah(transaction.sub_total)}{" "}
                    </Text>
                  )}
                  <Text>Rp. {formatRupiah(transaction.price_total)}</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      {transactions.length === 0 && !isLoading && (
        <Text style={{ textAlign: "center" }}>No transactions found</Text>
      )}
      <View style={styles.rowtransaction} />
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
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionName: {
    width: "80%",
    fontSize: 12,
  },
  transactionQty: {
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
  rowtransaction: {
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

export default TransactionScreen;
