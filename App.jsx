import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { theme } from "./app/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
} from "./app/screens";
import StockInScreen from "./app/screens/StockInScreen";
import TransactionScreen from "./app/screens/TransactionScreen";
import LogoutScreen from "./app/screens/LogoutScreen";
import { Ionicons } from "react-native-vector-icons";
import LogoutAction from "./app/screens/LogoutScreen";
import ProductScreen from "./app/screens/ProductScreen";
import store from "./app/redux/store";
import TransactionDetail from "./app/screens/TransactionDetail";
import TransactionDetailScreen from "./app/screens/TransactionDetail";
import TransactionCreateScreen from "./app/screens/TransactionCreateScreen";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const handleLogout = async () => {
    try {
      AsyncStorage.clear();
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.log(error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          height: 60, // Ketinggian bar tab
          backgroundColor: "#fff", // Warna latar belakang tab bar
          color: "#000",
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: "white",
          borderWidth: 0,
          elevation: 0,
          height: 17,
        },
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name="Stock In"
        component={StockInScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-up" size={18} color={color} />
          ),
          tabBarLabel: "Stock In",
          tabBarLabelStyle: { fontSize: 9 },
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={18} color={color} />
          ),
          tabBarLabel: "Transactions",
          tabBarLabelStyle: { fontSize: 9 },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={18} color={color} />
          ),
          tabBarLabel: "Home",
          tabBarLabelStyle: { fontSize: 9 },
        }}
      />
      <Tab.Screen
        name="Product"
        component={ProductScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scale-outline" size={18} color={color} />
          ),
          tabBarLabel: "Product",
          tabBarLabelStyle: { fontSize: 9 },
        }}
      />
      <Tab.Screen
        name="LogoutScreen"
        component={LogoutScreen}
        onPress={handleLogout}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out" size={18} color={color} />
          ),
          tabBarLabel: "Logout",
          tabBarLabelStyle: { fontSize: 9 },
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen
        name="TransactionCreateScreen"
        component={TransactionCreateScreen}
        options={{
          headerShown: true,
          title: "Create Transaction",
        }}
      />
      <Stack.Screen
        name="TransactionDetailScreen"
        component={TransactionDetailScreen}
        options={{
          headerShown: true,
          title: "Transaction Detail",
        }}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="LogoutScreen" component={LogoutAction} />
      <Stack.Screen name="Main" component={MyTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Provider>
  );
}
