import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import { View } from "react-native";
import MainLayout from "../layouts/MainLayout";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getInfoToday } from "../services/apiService";
import { getUserDetail } from "../helpers/getUser";
import { isLogin } from "../middleware/authMiddleware";
import { formatRupiah } from "../helpers/formatRupiah";
export default function HomeScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [infoToday, setInfoToday] = useState({
    product_count: 0,
    transaction_total_today: 0,
    transaction_count: 0,
  });
  const CekLogin = async () => {
    try {
      const cek = await isLogin();
      if (!cek) {
        navigation.navigate("LogoutScreen");
      }
    } catch (error) {
      // navigation.navigate("LogoutScreen");
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchInfoToday();
      CekLogin();
    }, [])
  );

  useEffect(() => {
    getUser();
    fetchInfoToday();
  }, []);

  const fetchInfoToday = async () => {
    try {
      const response = await getInfoToday();
      if (response.meta.code == 200) {
        setInfoToday({
          product_count: response.data.product_count,
          transaction_total_today: response.data.transaction_total_today,
          transaction_count: response.data.transaction_count,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    const user = await getUserDetail();
    try {
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MainLayout>
      <Header>Home</Header>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          textAlign: "center",
          padding: "auto",
        }}
      >
        <Logo />
        <Text style={{ fontSize: 18, marginVertical: 10 }}>
          Selamat Datang {user.name}
        </Text>
        <Paragraph>Congratulations you are logged in.</Paragraph>
      </View>

      <View>
        <View
          style={{
            backgroundColor: "#C4C8D3FF",
            padding: 10,
            margin: 10,
            height: 90,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12 }}>Product Total</Text>
          <Text style={{ fontSize: 35 }}>{infoToday.product_count}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#77B6D3FF",
            padding: 10,
            margin: 10,
            height: 90,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12 }}>Transaction Today</Text>
          <Text style={{ fontSize: 35 }}>
            {formatRupiah(infoToday.transaction_total_today)}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#C48181FF",
            padding: 10,
            margin: 10,
            height: 90,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12 }}>Transaction Count</Text>
          <Text style={{ fontSize: 35 }}>{infoToday.transaction_count}</Text>
        </View>
      </View>
    </MainLayout>
  );
}
