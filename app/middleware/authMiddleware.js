import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const isLogin = async () => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");

    if (!base_url || !token) {
      await SecureStore.deleteItemAsync("base_url");
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("user");
      return false;
    }

    try {
      const response = await axios.post(
        `${base_url}/api/me`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (error) {
      // return false;
      console.log("Error", error);
    }
  } catch (error) {
    console.log("Error2", error);

    return false;
  }
};
