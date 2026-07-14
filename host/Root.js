import * as React from 'react';
import {App} from './src/navigation/AppNavigation';
import {useEffect} from 'react';
import {Text, View} from 'react-native';
import {Config} from './src/Config';

const configURL =
  'https://raw.githubusercontent.com/4tech-sonnn/supper-app-config/main/config.json';

export function Root() {
  const [isLoaded, setLoaded] = React.useState(false);

  const getConfig = url => {
    const requestOptions = {method: 'GET'};
    return fetch(url, requestOptions);
  };

  useEffect(() => {
    getConfig(configURL)
      .then(result => result.json())
      .then(json => {
        Config.APP1_URL = json.app_1;
        Config.APP2_URL = json.app_2;
        Config.APP3_URL = json.app_3;
        console.log('✅ json: ', Config);
        setLoaded(true);
      })
      .catch(error => console.log('error', error));
  }, []);
  return isLoaded ? (
    <App />
  ) : (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Loading...</Text>
    </View>
  );
}
