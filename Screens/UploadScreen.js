import { View } from "react-native";
import React, { useState } from "react";
import Upload from "../CommonComponent/Upload";

const UploadScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Upload
        navigation={navigation}
        type={"posts"}
        image={image}
        setImage={setImage}
      />
    </View>
  );
};

export default UploadScreen;
