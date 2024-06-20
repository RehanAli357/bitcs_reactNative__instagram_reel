import { StyleSheet, ToastAndroid, View } from "react-native";
import React from "react";
import { signInUser } from "../Firebase/userDoc";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Form from "../CommonComponent/Form";
import { hashPassowrd } from "../HashedPassword/EncryptedPassword";
const RegisterScreen = ({ navigation }) => {
  const onSubmit = async (formData, setFormData) => {
    const { email, password } = formData;
    const hash = hashPassowrd(password);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        hash
      );
      const userData = await signInUser({
        email: email,
        password: hash,
        uid: userCredential.user.uid,
      });
      if (userData) {
        setFormData({
          email: "",
          password: "",
        });
        navigation.navigate("Login");
      }
    } catch (error) {
      ToastAndroid.show("Unable to create new account", ToastAndroid.LONG);
      console.log(error.message);
    }
  };
  return (
    <View style={styles.screen}>
      <Form type={"Register"} onSubmit={onSubmit} navigation={navigation} />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
