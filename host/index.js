import {AppRegistry, Platform} from 'react-native';
import {ScriptManager, Script, Federated} from '@callstack/repack/client';
import {name as appName} from './app.json';
import {Root} from './Root';
import {Config} from './src/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

ScriptManager.shared.setStorage(AsyncStorage);
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const resolveURL = Federated.createURLResolver({
    containers: {
      app1: `${Config.APP1_URL}/[name][ext]`,
      app2: `${Config.APP2_URL}/[name][ext]`,
      app3: `${Config.APP3_URL}/[name][ext]`,
    },
  });
  let url;
  if (caller === 'main') {
    url = Script.getDevServerURL(scriptId);
  } else {
    url = resolveURL(scriptId, caller);
  }

  // console.log(JSON.stringify({scriptId, caller, url}));

  if (!url) {
    return undefined;
  }

  return {
    url,
    query: {
      platform: Platform.OS,
    },
  };
});
ScriptManager.shared.on('resolving', (...args) => {
  console.log('✅ DEBUG/resolving', ...args);
});

ScriptManager.shared.on('resolved', (...args) => {
  console.log('✅ DEBUG/resolved', ...args);
});

ScriptManager.shared.on('prefetching', (...args) => {
  console.log('✅ DEBUG/prefetching', ...args);
});

ScriptManager.shared.on('loading', (...args) => {
  console.log('✅ DEBUG/loading', ...args);
});

ScriptManager.shared.on('loaded', (...args) => {
  console.log('✅ DEBUG/loaded', ...args);
});

ScriptManager.shared.on('error', (...args) => {
  console.log('❌ DEBUG/error', ...args);
});
AppRegistry.registerComponent(appName, () => Root);
