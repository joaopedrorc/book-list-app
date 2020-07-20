import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';

import Icon from "react-native-vector-icons/MaterialIcons";

const Main = ({ navigation }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("books").then(data => {
      const book = JSON.parse(data);
      setBooks(book);
    })
  }, []);

  const onNewBook = () => {
    navigation.navigate('Book');
  }

  const onBookEdit = (bookId) => {
    const book = books.find(item => item.id === bookId)
    navigation.navigate('Book', { book: book, isEdit: true });
  };

  const onBookDelete = async (bookId) => {
    const newBooks = books.filter(item => item.id !== bookId);
    await AsyncStorage.setItem("books", JSON.stringify(newBooks));
    setBooks(newBooks);
  }

  const onBookRead = async (bookId) => {
    const newBooks = books.map(item => {
      if (item.id === bookId) {
        item.read = !item.read; // false -> true / true -> false
      }
      return item;
    });

    await AsyncStorage.setItem("books", JSON.stringify(newBooks));
    setBooks(newBooks);
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.toolbox}>
        <Text style={styles.title}>Lista de Leitura</Text>
      </View>
      <FlatList
        style={styles.FlatList}
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemsContainer}>
            <TouchableOpacity
              style={styles.itemButton}
              onPress={() => onBookRead(item.id)}>
              <Text style={[styles.itemText, item.read ? styles.itemRead : '']}>{item.title}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onBookEdit(item.id)}>
              <Icon name="create" size={35} color="#2ecc71" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onBookDelete(item.id)}>
              <Icon name="delete" size={35} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.toolboxButtonView}>
        <TouchableOpacity
          style={styles.toolboxButton}
          onPress={onNewBook}>
          <Icon name="add" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    // paddingTop: Constants.statusBarHeight,
  },
  toolbox: {
    flexDirection: "row",
    marginTop: 50,
    borderBottomColor: '#EEEEEE',
    borderTopColor: '#fff',
    borderEndColor: '#fff',
    borderStartColor: '#fff',
    borderRadius: 0,
    borderWidth: 4,
  },
  title: {
    flex: 1,
    fontSize: 40,
    color: "#989898",
    marginBottom: 25,
    marginLeft: 8,
  },
  toolboxButton: {
    backgroundColor: "#3498db",
    borderRadius: 50,
    width: 61,
    height: 61,
    justifyContent: "center",
    alignItems: "center",
  },
  toolboxButtonView: {
    marginLeft: 290,
    marginTop: 425,
    marginBottom: 54,
  },
  FlatList: {
    // borderWidth: 2,
    marginBottom: -545,
  },
  itemsContainer: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: '#DEF2FF',
    borderRadius: 8,
    marginTop: 32,
    marginRight: 5,
    padding: 8,
    height: 78,
  },
  itemButton: {
    flex: 1,
  },
  itemText: {
    fontSize: 22,
    color: '#7B7171',
  },
  itemRead: {
    textDecorationLine: "line-through",
    color: "#95a5a6",
  },
  editButton: {},
  deleteButton: {},
});

export default Main;