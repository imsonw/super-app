import React from 'react';
import {Text} from 'react-native';
import {Federated} from '@callstack/repack/client';
import HomeScreen from '../container/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../Root';

const App1 = React.lazy(() => Federated.importModule('app1', './App'));
const App2 = React.lazy(() => Federated.importModule('app2', './App'));
const App3 = React.lazy(() => Federated.importModule('app3', './App'));

function MiniApp1Container() {
  return (
    <React.Suspense fallback={<Text>Loading ...</Text>}>
      <App1 />
    </React.Suspense>
  );
}

function MiniApp2Container() {
  return (
    <React.Suspense fallback={<Text>Loading ...</Text>}>
      <App2 />
    </React.Suspense>
  );
}

function MiniApp3Container() {
  return (
    <React.Suspense fallback={<Text>Loading ...</Text>}>
      <App3 />
    </React.Suspense>
  );
}

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MiniApp1" component={MiniApp1Container} />
      <Stack.Screen name="MiniApp2" component={MiniApp2Container} />
      <Stack.Screen name="MiniApp3" component={MiniApp3Container} />
    </Stack.Navigator>
  );
};

export function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <HomeStack />
    </NavigationContainer>
  );
}
