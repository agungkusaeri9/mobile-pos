import React from "react";
import { Image, StyleSheet } from "react-native";

export default function Logo({ height = 80, width = 80 }) {
  return (
    <Image
      source={require("../../assets/images/logo-toho3.png")}
      style={[{ height: height, width: width, objectFit: "contain" }]}
    />
  );
}
