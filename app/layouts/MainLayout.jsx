import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native";

function MainLayout({ children }) {
  return (
    <ScrollView style={styles.sv}>
      <View style={styles.container}>{children}</View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  sv: {
    backgroundColor: "white",
  },
});

export default MainLayout;
