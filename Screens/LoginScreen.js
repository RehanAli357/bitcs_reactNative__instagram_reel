import { StyleSheet, Text, View, ToastAndroid } from "react-native";
import React from "react";
import Form from "../CommonComponent/Form";
import { loginUser } from "../Firebase/userDoc";
const LoginScreen = ({ navigation }) => {
  const onSubmit = async (formData, setFormData) => {
    try {
      let user = await loginUser(formData);
      if (user) {
        navigation.navigate("Home");
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      ToastAndroid.show("Invalid UserName Password", ToastAndroid.LONG);
      console.log(error.message);
    }
  };
  return (
    <View style={styles.screen}>
      <Form type={"Login"} onSubmit={onSubmit} navigation={navigation} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
