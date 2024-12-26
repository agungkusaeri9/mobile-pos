import AsyncStorage from "@react-native-async-storage/async-storage";

// Fungsi untuk mengambil token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("@MySuperStore:access_token");
    if (token !== null) {
      return token; // Mengembalikan token jika ditemukan
    } else {
      console.log("Token not found");
      return null; // Mengembalikan null jika tidak ditemukan
    }
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

// Fungsi untuk mengambil username
const getUsername = async () => {
  try {
    const username = await AsyncStorage.getItem("@MySuperStore:username");
    if (username !== null) {
      return username; // Mengembalikan username jika ditemukan
    } else {
      console.log("Username not found");
      return null; // Mengembalikan null jika tidak ditemukan
    }
  } catch (error) {
    console.log("Error getting username:", error);
    return null;
  }
};

// Fungsi untuk mengambil host
const getHost = async () => {
  try {
    const host = await AsyncStorage.getItem("@MySuperStore:base_url");
    if (host !== null) {
      return host; // Mengembalikan host jika ditemukan
    } else {
      console.log("Host not found");
      return null; // Mengembalikan null jika tidak ditemukan
    }
  } catch (error) {
    console.log("Error getting host:", error);
    return null;
  }
};

// Menggunakan fungsi untuk mendapatkan data
const fetchData = async () => {
  const token = await getToken();
  const username = await getUsername();
  const host = await getHost();
};

// Panggil fungsi untuk mengambil data
fetchData();
