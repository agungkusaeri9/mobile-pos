import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { loginService } from "../services/authService";
import {
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { profileService } from "../services/profileService";
import AuthLayout from "../layouts/AuthLayout";
import { checkHost } from "../services/apiService";
import * as SecureStore from "expo-secure-store";
import { isLogin } from "../middleware/authMiddleware";

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState({ value: "admin@gmail.com", error: "" });
  const [password, setPassword] = useState({ value: "password", error: "" });
  const [host, setHost] = useState({
    value: "http://192.168.100.71:8000",
    error: "",
  });

  const CekLogin = async () => {
    try {
      const cek = await isLogin();
      if (cek) {
        navigation.navigate("Main");
      }
    } catch (error) {
      console.log("error login", error);
    }
  };

  useEffect(() => {
    CekLogin();
  }, []);

  const onLoginPressed = async () => {
    setIsLoading(true);
    // cek host
    try {
      const response = await checkHost(host.value);
      if (response !== "success") {
        ToastAndroid.show("The host is not valid", ToastAndroid.SHORT);
        return;
      }
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setIsLoading(false);
    }

    try {
      setIsLoading(true);
      const response = await loginService(
        email.value,
        password.value,
        host.value
      );
      if (response.meta.code == 422) {
        Object.keys(response.errors).forEach((key) => {
          const message = response.errors[key]?.[0];
          ToastAndroid.show(message, ToastAndroid.SHORT);
        });
      }
      if (response.meta.code == 401) {
        ToastAndroid.show(response.meta.message, ToastAndroid.SHORT);
      }

      if (response.meta.code == 200) {
        const { access_token } = response.data;
        try {
          //  save host
          await SecureStore.setItemAsync("base_url", host.value);
          //  save token
          await SecureStore.setItemAsync("access_token", access_token);
          const user = await profileService();
          //  save user
          await SecureStore.setItemAsync("user", JSON.stringify(user["data"]));
        } catch (error) {
          console.log("Error Login ", error);
        }

        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }
    } catch (error) {
      console.log("Error ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Logo height={80} width={80} />
        <Header>LOGIN</Header>
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          error={!!email.error}
          errorText={email.error}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
        />
        <TextInput
          label="Host"
          returnKeyType="done"
          value={host.value}
          onChangeText={(text) => setHost({ value: text, error: "" })}
          error={!!host.error}
          errorText={host.error}
        />
        <Button mode="contained" onPress={onLoginPressed} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            "Login"
          )}{" "}
        </Button>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    // marginVertical: 8,
    backgroundColor: theme.colors.error,
    padding: 8,
    borderRadius: 4,
    width: "100%",
  },
  errorText: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
});
