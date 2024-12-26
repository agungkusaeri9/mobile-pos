import * as SecureStore from "expo-secure-store";
export const getUserDetail = async () => {
  try {
    const userJson = await SecureStore.getItemAsync("user");
    console.log("User JSON", userJson);
    if (userJson) {
      const user = JSON.parse(userJson);
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};
