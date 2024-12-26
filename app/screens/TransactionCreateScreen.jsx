import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ToastAndroid, TextInput } from "react-native";
import Button from "../components/Button";
import MainLayout from "../layouts/MainLayout";
import { TouchableHighlight, TouchableOpacity } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  checkQrCode,
  createTransaction,
  getPayments,
  stockOutCreate,
} from "../services/apiService";
import { checkAuth, isLogin } from "../middleware/authMiddleware";
import { Picker } from "@react-native-picker/picker";
import { formatRupiah } from "../helpers/formatRupiah";

function TransactionCreateScreen({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState("");
  const [qty, setQty] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [carts, setCarts] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    payment_id: "",
    products: [],
    price_discount: 0,
    sub_total: 0,
    price_total: 0,
    customer: "-",
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
    fetchPayments();
  }, [navigation]);

  const fetchPayments = async () => {
    try {
      const response = await getPayments();
      setPayments(response.data.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    const product = await fetch_product(data);

    const formatData = {
      id: product.id,
      product_name: product.name,
      price: product.price,
      qty: 1,
      price_total: product.price * 1,
    };

    setCarts((prevCarts) => {
      const existingProductIndex = prevCarts.findIndex(
        (cartItem) => cartItem.id === formatData.id
      );

      let updatedCarts;

      if (existingProductIndex !== -1) {
        // Jika produk sudah ada, update qty dan price_total
        updatedCarts = [...prevCarts];
        updatedCarts[existingProductIndex] = {
          ...updatedCarts[existingProductIndex],
          qty: updatedCarts[existingProductIndex].qty + 1,
          price_total:
            updatedCarts[existingProductIndex].price *
            (updatedCarts[existingProductIndex].qty + 1),
        };
      } else {
        // Jika produk belum ada, tambahkan ke keranjang
        updatedCarts = [...prevCarts, formatData];
      }

      // Hitung sub_total
      const subTotal = updatedCarts.reduce(
        (total, item) => total + item.price_total,
        0
      );

      // Update form
      setForm((prevForm) => ({
        ...prevForm,
        products: updatedCarts,
        sub_total: subTotal,
        price_total: subTotal - prevForm.price_discount,
      }));

      return updatedCarts;
    });
  };

  const fetch_product = async (data) => {
    setIsLoading(true);
    try {
      const response = await checkQrCode(data);
      if (response.meta.code == 404) {
        ToastAndroid.show(response.meta.message, ToastAndroid.SHORT);
        return;
      }
      if (response.meta.code == 200) {
        const product = response.data;
        return product;
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error :", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscount = (value) => {
    const discountValue = parseFloat(value) || 0; // Konversi string ke angka
    setForm((prevForm) => ({
      ...prevForm,
      price_discount: discountValue,
      price_total: getSubTotal() - discountValue,
    }));
  };

  const handleRemove = (id) => {
    setCarts(carts.filter((cart) => cart.id !== id));
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
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
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await createTransaction(form);
      if (response.meta.code == 422) {
        Object.keys(response.errors).forEach((key) => {
          const message = response.errors[key]?.[0];
          ToastAndroid.show(message, ToastAndroid.SHORT);
        });
      }
      if (
        response.meta.code == 403 ||
        response.meta.code == 404 ||
        response.meta.code == 500
      ) {
        ToastAndroid.show(response.meta.message, ToastAndroid.SHORT);
      }

      if (response.meta.code == 201) {
        ToastAndroid.show(response.meta.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubTotal = () => {
    return carts.reduce((total, item) => total + item.price_total, 0);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <MainLayout>
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

          <View
            style={{
              backgroundColor: "white",
              elevation: 5,
              borderRadius: 5,
              width: "100%",
              marginTop: 10,
              padding: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 18 }}>Product List</Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "black",
                marginVertical: 10,
              }}
            ></View>
            {carts.length > 0 &&
              carts.map((cart, index) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                  key={index}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      {cart.product_name}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Qty : {cart.qty}</Text>
                    <Text style={{ fontSize: 12 }}>
                      Price : Rp. {formatRupiah(cart.price)}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                      Total : Rp. {formatRupiah(cart.price_total)}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <TouchableOpacity onPress={() => handleRemove(cart.id)}>
                      <Text style={{ color: "red", fontSize: 20 }}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
          <View
            style={{
              marginTop: 10,
              backgroundColor: "white",
              elevation: 5,

              padding: 10,
              borderRadius: 5,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <View>
                <Text style={{ fontSize: 14 }}>Payment</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(e) => setForm({ ...form, payment_id: e })}
                  style={{
                    height: 26,
                    justifyContent: "center",
                    width: "100%",
                    // backgroundColor: "#f5f5f5",
                    borderWidth: 1,
                    width: 80,
                    fontSize: 14,
                    borderRadius: 5,
                  }}
                >
                  <Picker.Item label="Pilih" value="" />
                  {payments.map((payment, index) => (
                    <Picker.Item
                      key={index}
                      label={payment.name}
                      value={payment.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <View>
                <Text style={{ fontSize: 14 }}>Customer</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <TextInput
                  style={{
                    height: 26,
                    fontSize: 14,
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "black",
                    width: 80,
                    paddingHorizontal: 10,
                  }}
                  label="Total"
                  mode="outlined"
                  value={form.customer}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <View>
                <Text style={{ fontSize: 14 }}>Sub Total</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "black", fontSize: 14 }}>
                  Rp. {formatRupiah(form.sub_total)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <View>
                <Text style={{ fontSize: 14 }}>Discount</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <TextInput
                  style={{
                    height: 26,
                    fontSize: 14,
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "black",
                    width: 80,
                    paddingHorizontal: 10,
                  }}
                  label="Discount"
                  keyboardType="numeric"
                  mode="outlined"
                  value={form.price_discount.toString()} // Pastikan nilai berupa string
                  onChangeText={handleDiscount}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <View>
                <Text style={{ fontSize: 14 }}>Total</Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <TextInput
                  style={{
                    height: 26,
                    fontSize: 14,
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "black",
                    width: 80,
                    paddingHorizontal: 10,
                  }}
                  label="Total"
                  keyboardType="numeric"
                  mode="outlined"
                  readOnly
                  value={form.price_total.toString()}
                />
              </View>
            </View>
          </View>
          <View style={{ width: "100%", marginTop: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
              onPress={handleSubmit}
            >
              <Text
                style={{ color: "white", fontSize: 14, textAlign: "center" }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

export default TransactionCreateScreen;
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
  transactionProduct: {
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
    flex: 2, // Menyediakan ruang lebih untuk nilai
    flexWrap: "wrap",
  },
  buttonSubmit: {
    width: "100%",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    fontSize: 12,
  },
});
