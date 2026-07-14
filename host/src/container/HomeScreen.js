import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {navigate} from '../Root';
import {ScriptManager} from '@callstack/repack/client';

const HomeScreen = () => {
  const onPressMiniApp1 = async () => {
    navigate('MiniApp1');
  };
  const onPressMiniApp2 = () => {
    navigate('MiniApp2');
  };
  const onPressMiniApp3 = () => {
    navigate('MiniApp3');
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressMiniApp1} style={styles.moduleButton}>
        <Text>App 1</Text>
      </TouchableOpacity>
      <View style={{height: 50}} />
      <TouchableOpacity
        onPress={onPressMiniApp2}
        style={[styles.moduleButton, {backgroundColor: 'red'}]}>
        <Text>App 2</Text>
      </TouchableOpacity>
      <View style={{height: 50}} />
      <TouchableOpacity
        onPress={onPressMiniApp3}
        style={[styles.moduleButton, {backgroundColor: 'yellow'}]}>
        <Text>App 3</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
});
