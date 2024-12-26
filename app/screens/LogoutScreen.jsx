import React from "react";
import { View, Text, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

const LogoutAction = ({ navigation }) => {
  // Fungsi logout
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("base_url");
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("user");
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  // Panggil handleLogout ketika komponen dimuat
  React.useEffect(() => {
    handleLogout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutAction;
