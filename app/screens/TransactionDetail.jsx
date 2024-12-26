import React, { use, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { isLogin } from "../middleware/authMiddleware";
import { formatRupiah } from "../helpers/formatRupiah";
import { dateFormat } from "../helpers/dateFormat";
import { Image, Text, View } from "react-native";
import { getTransactionByCode } from "../services/apiService";

function TransactionDetailScreen({ navigation, route }) {
  const { code } = route.params;
  const [transaction, setTransaction] = useState({});

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
    fetchTransaction(code);
  }, []);

  const fetchTransaction = async () => {
    try {
      const response = await getTransactionByCode(code);
      if (response.meta.code == 200) {
        setTransaction(response.data);
      } else {
        alert(response.meta.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <View
        style={{
          backgroundColor: "white",
          elevation: 5,
          padding: 10,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>Date</Text>
          <Text style={{ fontSize: 12 }}>
            {dateFormat(transaction.created_at)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>Code</Text>
          <Text style={{ fontSize: 12 }}>{transaction.code}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>Payment</Text>
          <Text style={{ fontSize: 12 }}>{transaction.payment?.name}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>Sub Total</Text>
          <Text style={{ fontSize: 12 }}>
            Rp. {formatRupiah(transaction.sub_total)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>Discount</Text>
          <Text style={{ fontSize: 12 }}>
            Rp. {formatRupiah(transaction.price_discount)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 12 }}>Total</Text>
          <Text style={{ fontSize: 12 }}>
            Rp. {formatRupiah(transaction.price_total)}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text>Products</Text>
      </View>
      <View style={{ backgroundColor: "white", elevation: 5, padding: 10 }}>
        {transaction.details?.map((detail, i) => (
          <View
            key={detail.id + i}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Image
                source={{ uri: detail.product.image }}
                style={{ width: 50, height: 40 }}
              />
              <Text>{detail.product.name}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontWeight: "light",
                  fontSize: 12,
                  color: "#000",
                }}
              >
                X : {detail.qty}
              </Text>
              <Text
                style={{
                  fontWeight: "light",
                  fontSize: 12,
                  color: "#000",
                }}
              >
                Rp: {formatRupiah(detail.price)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </MainLayout>
  );
}

export default TransactionDetailScreen;
