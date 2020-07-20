import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Modal
} from 'react-native';

import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';


import Icon from 'react-native-vector-icons/MaterialIcons';

import Photo from "../components/Photo";
import Camera from "../components/Camera";

const Book = ({ navigation }) => {
  const book = navigation.getParam("book", {
    title: '',
    description: '',
    read: false,
    photo: ''
  });

  const isEdit = navigation.getParam("isEdit", false);

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState(book.title);
  const [description, setDescription] = useState(book.description);
  const [read, setRead] = useState(book.read);
  const [photo, setPhoto] = useState(book.photo);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("books").then(data => {
      if (data) {
        const book = JSON.parse(data);
        setBooks(book);
      }
    })
  }, []);

  const isValid = () => {
    if (title !== undefined && title !== '') {
      return true;
    }

    return false;
  };

  const onSave = async () => {
    if (isValid()) {

      if (isEdit) {
        // altera o livro corrente
        let newBooks = books;

        newBooks.map(item => {
          if (item.id === book.id) {
            item.title = title;
            item.description = description;
            item.read = read;
            item.photo = photo;
          }
          return item;
        });

        console.log("books", books);
        console.log("newBooks", newBooks);

        await AsyncStorage.setItem('books', JSON.stringify(newBooks));
      } else {
        // adiciona um novo livro
        const id = Math.random(5000).toString();
        const data = {
          id,
          title,
          description,
          photo,
        };

        books.push(data);
        await AsyncStorage.setItem('books', JSON.stringify(books));
      }

      navigation.goBack();
    } else {
      console.log('Inválido!');
    }
  };

  const onCloseModal = () => setIsModalVisible(false);

  const onChangePhoto = (newPhoto) => setPhoto(newPhoto);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.toolbox}>
        <Text style={styles.pageTitle}>Adicionar um novo livro</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={text => {
          setTitle(text);
        }}
      />
      <TextInput
        style={[styles.input, styles.inputPad]}
        placeholder="Descrição"
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={text => {
          setDescription(text);
        }}
      />

      <TouchableOpacity
        style={[styles.saveButton, !isValid() ? styles.saveButtonInvalid : '']}
        onPress={onSave}>
        <Text style={styles.saveButtonText}>{isEdit ? "Atualizar" : "Cadastrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => {
          setIsModalVisible(true)
        }}
      >
        <Icon name="photo-camera" size={50} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={isModalVisible}
      >
        {
          photo ? (
            <Photo
              photo={photo}
              onDeletePhoto={onChangePhoto}
              onClosePicture={onCloseModal}
            />
          ) : (
              <Camera onCloseCamera={onCloseModal} onTakePicture={onChangePhoto} />
            )
        }
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // paddingTop: Constants.statusBarHeight,
  },
  toolbox: {
    justifyContent: 'center',
    flexDirection: "row",
    marginTop: 50,
    marginBottom: 5,
    borderBottomColor: '#EEEEEE',
    borderTopColor: '#fff',
    borderEndColor: '#fff',
    borderStartColor: '#fff',
    borderRadius: 15,
    borderWidth: 4,
  },
  pageTitle: {
    textAlign: 'center',
    color: '#989898',
    fontSize: 35,
    marginBottom: 25,
    marginLeft: 5,
  },
  input: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    // color: '#DADADA',
    paddingLeft: 5,
    borderColor: '#CAECFF',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    height: 50,
  },
  inputPad: {
    paddingTop: 10,
    marginBottom: 0,
    height: 82,
  },
  cameraButton: {
    backgroundColor: '#33B5FF',
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00a2ff',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    width: 147,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,

  },
  saveButtonInvalid: {
    backgroundColor: '#b3e3ff',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#95a5a6',
    fontSize: 20,
  },
});

export default Book;
