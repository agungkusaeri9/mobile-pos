import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, ToastAndroid } from "react-native";
import Button from "../components/Button";
import MainLayout from "../layouts/MainLayout";
import { TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { checkQrCode, stockInCreate } from "../services/apiService";
import { checkAuth, isLogin } from "../middleware/authMiddleware";
import Header from "../components/Header";
import { ActivityIndicator } from "react-native-paper";
import { formatRupiah } from "../helpers/formatRupiah";

function StockInScreen({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    code: "",
  });
  const [form, setForm] = useState({
    product_id: "",
    price: 0,
    qty: 0,
    description: "",
  });

  const CekLogin = async () => {
    try {
      const cek = await isLogin();
      if (!cek) {
        navigation.navigate("LogoutScreen");
      }
    } catch (error) {
      // navigation.navigate("LogoutScreen");
      console.log(error);
    }
  };

  useEffect(() => {
    CekLogin();
  }, [navigation]);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    const fetch_product = async (data) => {
      setIsLoading(true);
      try {
        const response = await checkQrCode(data);
        console.log(response);
        if (response.meta.code == 404) {
          ToastAndroid.show(response.meta.message, ToastAndroid.SHORT);
          return;
        }
        if (response.meta.code == 200) {
          const product = response.data;
          setProduct({
            code: product.code,
            name: product.name,
          });
          setForm({
            ...form,
            product_id: product.id,
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error :", error.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetch_product(data);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={requestPermission}
          style={{ backgroundColor: "green", color: "white" }}
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  const handleScanAgain = () => {
    setScanned(false);
    setProduct({
      name: "",
      code: "",
    });
    setForm({
      product_id: "",
      price: 0,
      qty: 0,
      description: "",
    });
    setCode("");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (form.product_id == null || form.qty == null || form.price == null) {
      ToastAndroid.show("Please Scan Qr Code", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }
    try {
      const response = await stockInCreate(form);
      if (response.meta.code == 422) {
        Object.keys(response.errors).forEach((key) => {
          const message = response.errors[key]?.[0];
          ToastAndroid.show(message, ToastAndroid.SHORT);
        });
      }
      if (response.meta.code == 201) {
        ToastAndroid.show(response.meta.message, ToastAndroid.SHORT);
        handleScanAgain();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <MainLayout>
      <Header>Scan Qr Stock In</Header>
      <View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <CameraView
            facing={facing}
            style={{ width: "100%", height: 150 }}
            zoom={0.8}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "flex-end",
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Text
                  style={{
                    color: "#fff",
                    paddingLeft: 10,
                    textAlign: "center",
                  }}
                >
                  Flip Camera
                </Text>
              </TouchableOpacity>
            </View>
          </CameraView>
          {scanned && (
            <TouchableOpacity
              style={{
                backgroundColor: "#007bff",
                paddingHorizontal: 10,
                width: 200,
                borderRadius: 5,
                paddingVertical: 5,
                marginTop: 5,
              }}
              onPress={handleScanAgain}
            >
              <Text style={{ textAlign: "center", color: "#fff" }}>
                Scan Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View>
        <TextInput
          value={product.name?.toString()}
          onChangeText={(e) => setForm({ ...form, name: e })}
          autoFocus={false}
          placeholder="Product Name"
          readOnly
          style={{
            placeholder: "Qty",
            height: 38,
            width: "100%",
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            fontSize: 14,
            marginBottom: 10,
          }}
        />
      </View>
      <View>
        <TextInput
          value={form.qty}
          onChangeText={(e) => setForm({ ...form, qty: e })}
          autoFocus={false}
          placeholder="Qty"
          keyboardType="numeric"
          style={{
            placeholder: "Qty",
            height: 38,
            width: "100%",
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
            marginTop: 5,
            fontSize: 14,
            marginBottom: 10,
          }}
        />
      </View>
      <View>
        <TextInput
          value={form.price}
          onChangeText={(e) => setForm({ ...form, price: e })}
          autoFocus={false}
          keyboardType="numeric"
          placeholder="Price"
          style={{
            placeholder: "Price",
            height: 38,
            width: "100%",
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
            marginTop: 5,
            fontSize: 14,
            marginBottom: 10,
          }}
        />
      </View>
      <View>
        <TextInput
          value={form.description}
          onChangeText={(e) => setForm({ ...form, description: e })}
          autoFocus={false}
          placeholder="Description"
          style={{
            placeholder: "Qty",
            height: 38,
            width: "100%",
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 5,
            marginTop: 5,
            fontSize: 14,
            marginBottom: 5,
          }}
        />
      </View>
      <View>
        <Button
          mode="contained"
          style={styles.buttonSubmit}
          onPress={handleSubmit}
          disabled={scanned == false || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            "Submit"
          )}{" "}
        </Button>
      </View>
    </MainLayout>
  );
}

export default StockInScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  boxScan: {
    height: 170,
  },
  detailProduct: {
    flexDirection: "row",
  },
  label: {
    flex: 1,
    color: "#333",
    width: 130,
    marginBottom: 5,
  },
  value: {
    color: "#333",
    flex: 2,
    flexWrap: "wrap",
  },
  buttonSubmit: {
    width: "100%",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    height: 52,
    fontSize: 12,
    color: "#fff",
  },
});
