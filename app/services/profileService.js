import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const profileService = async () => {
  const base_url = await SecureStore.getItemAsync("base_url");
  const token = await SecureStore.getItemAsync("access_token");
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
    return {
      status: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
      error: error,
    };
  }
};
