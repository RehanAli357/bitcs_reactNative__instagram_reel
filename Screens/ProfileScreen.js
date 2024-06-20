import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { getPosts } from "../Firebase/postDoc";
import React, { useCallback, useState } from "react";
import { auth } from "../Firebase/index";
import { logoutUser } from "../Firebase/userDoc";
import Upload from "../CommonComponent/Upload";
import { useFocusEffect } from "@react-navigation/native";
import { Video } from "expo-av";
const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [display, setDisplay] = useState({
    userProfile: false,
    userSetting: false,
  });
  const onLogoutPress = async () => {
    await logoutUser()
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((err) => {
        ToastAndroid.show("Unable to signout", ToastAndroid.LONG);
        console.log(err.message);
      });
  };
  const getAllPosts = async () => {
    await getPosts(auth.currentUser.uid, "userPost")
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const renderItem = ({ item }) => {
    return (
      <Video
        source={{ uri: item.imageUrl }}
        shouldPlay={false}
        style={{ height: 100, width: 100, margin: 2 }}
        resizeMode="cover"
      />
    );
  };
  useFocusEffect(
    useCallback(() => {
      getAllPosts();
    }, [])
  );
  return (
    <View style={styles.layout}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "5px",
          marginBottom: "5px",
          padding: 16,
        }}
      >
        <Text style={{ marginleft: 15, fontWeight: "bold" }}>
          {auth.currentUser.email}
        </Text>
        <TouchableOpacity onPress={onLogoutPress}>
          <Image
            source={require("../Image/logout.png")}
            style={{ width: 30, height: 30, marginRight: "5px" }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.profile}>
        <View style={styles.profilePic}>
          <TouchableOpacity
            onLongPress={() => {
              setDisplay((pdata) => ({
                ...pdata,
                userProfile: !pdata.userProfile,
              }));
            }}
          >
            <Image
              source={require("../Image/user.png")}
              style={styles.ProfileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileFollow}>
          <Text style={{ fontWeight: "bold", marginRight: 5 }}>
            Posts {posts.length}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", width: "100%" }}>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 16,
  },
  profile: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  profilePic: {
    flex: 0.3,
    marginLeft: 10,
  },
  ProfileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  profileFollow: {
    flex: 1,
    flexDirection: "row",
  },
});
