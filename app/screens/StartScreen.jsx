import React from "react";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import { View } from "react-native";

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Logo height={80} width={80} />
        <Header>WMS Toho</Header>
        <Paragraph>
          Please log in first before starting the application.
        </Paragraph>
        <Button mode="contained" onPress={() => navigation.navigate("Main")}>
          Start
        </Button>
      </View>
    </Background>
  );
}
