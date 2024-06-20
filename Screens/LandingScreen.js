import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useFocusEffect } from "@react-navigation/native";
import { getPosts } from "../Firebase/postDoc";

const { height, width } = Dimensions.get("window");

const LandingScreen = ({ navigation }) => {
  const [crrIndex, setIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const videoRefs = useRef([]);

  const getAllPosts = async () => {
    await getPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getAllPosts();
    }, [])
  );

  useEffect(() => {
    const video = videoRefs.current[crrIndex];
    if (video) {
      video.playAsync();
    }
    return () => {
      if (video) {
        video.stopAsync();
      }
    };
  }, [crrIndex]);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{
            uri: item.url,
          }}
          style={styles.video}
          useNativeControls={false}
          shouldPlay={index === crrIndex}
          isLooping
          resizeMode="cover"
          isMuted={false}
          volume={1.0}
        />
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.reelText}>Reel</Text>
            <Image source={require("../Image/more.png")} style={styles.moreIcon} />
          </View>
          <View style={styles.footer}>
            <View style={styles.userInfo}>
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require("../Image/user.png")
                }
                style={styles.userImage}
              />
              <Text style={styles.userName}>{item.userName}</Text>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        </View>
      </View>
    );
  };

  const changeIndex = (e) => {
    setIndex(e.index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SwiperFlatList
        vertical={true}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onChangeIndex={changeIndex}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No Reel Uploaded Yet
          </Text>
        }
      />
      <View style={styles.screenFooter}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../Image/user.png")} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Upload")}>
          <Image source={require("../Image/more.png")} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  videoContainer: {
    height: height,
    justifyContent: "center",
  },
  video: {
    height: height,
    width: width,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    padding: 20,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },
  moreIcon: {
    width: 25,
    height: 25,
  },
  footer: {
    marginBottom: 60,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    marginLeft: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  caption: {
    marginTop: 5,
    color: "white",
    fontSize: 14,
  },
  screenFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  footerIcon: {
    width: 30,
    height: 30,
  },
  emptyMessage: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});

export default LandingScreen;
