import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';


import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';

const Photo = ({ photo, onDeletePhoto, onClosePicture }) => {
  return (
    <ImageBackground source={{ uri: photo }} style={styles.imagePreview}>
      <StatusBar style="light" />
      <View style={styles.actionsButtons}>
        <Icon
          name="delete"
          size={50}
          color={"#fff"}
          onPress={() => {
            onDeletePhoto(null)
          }}
        />
        <Icon name="check" size={50} color={"#fff"} onPress={onClosePicture} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  actionsButtons: {
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
  }
});

export default Photo;