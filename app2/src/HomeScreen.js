import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

function HomeScreen() {
  const [character, setCharacter] = useState([]);

  const getCharacter = async url => {
    const res = await fetch(url);
    const data = await res.json();
    setCharacter(prevState => {
      return [...prevState, ...data];
    });
  };

  useEffect(() => {
    getCharacter('https://hp-api.herokuapp.com/api/characters/staff');
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.item}>
        <FastImage
          style={{width: 80, height: 80}}
          source={{uri: item.image}}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={{margin: 10}}>{item.name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar />
      <View style={styles.background}>
        <Text>Version2</Text>
        <FlatList
          data={character}
          numColumns={2}
          onEndReachedThreshold={0.7}
          renderItem={renderItem}
          keyExtractor={(item, idx) => `${idx}`}
        />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  hiLabel: {
    color: 'black',
    fontSize: 28,
    fontWeight: '600',
    margin: 20,
  },
  item: {
    height: 100,
    flex: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    backgroundColor: '#EEE',
  },
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
});
