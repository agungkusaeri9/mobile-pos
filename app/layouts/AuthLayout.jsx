import React from "react";
import { StyleSheet, View } from "react-native";

function AuthLayout({ children }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default AuthLayout;
