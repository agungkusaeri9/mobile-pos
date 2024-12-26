import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";

export const checkQrCode = async (code) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    if (!base_url || !token) {
      ToastAndroid(
        "Base URL or token is missing in AsyncStorage.",
        ToastAndroid.SHORT
      );
    }

    const response = await axios.get(
      `${base_url}/api/products/${code}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const stockInCreate = async (data) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.post(`${base_url}/api/stock-ins`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const stockOutCreate = async (code, qty) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.post(
      `${base_url}/api/stock-out/create`,
      { code, qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const checkHost = async (host) => {
  try {
    const response = await axios.post(`${host}/api/check`);
    return response.data.meta.status;
  } catch (error) {
    return error.response?.data;
  }
};

export const getProducts = async (limit, page, search) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.get(`${base_url}/api/products`, {
      params: {
        limit: limit,
        page: page,
        keyword: search,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getTransactions = async (limit, page, search) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.get(`${base_url}/api/transactions`, {
      params: {
        limit: limit,
        page: page,
        keyword: search,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getPayments = async (limit, page, search) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.get(`${base_url}/api/payments`, {
      params: {
        limit: limit,
        page: page,
        keyword: search,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createTransaction = async (data) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.post(`${base_url}/api/transactions`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const getInfoToday = async () => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.post(`${base_url}/api/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching info today:", error);
    throw error;
  }
};

export const getTransactionByCode = async (code) => {
  try {
    const base_url = await SecureStore.getItemAsync("base_url");
    const token = await SecureStore.getItemAsync("access_token");
    const response = await axios.get(`${base_url}/api/transactions/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction by code:", error);
    throw error;
  }
};
