# super-app

A React Native "super app" built with [Re.Pack](https://github.com/callstack/repack) and Webpack Module Federation. A `host` shell app dynamically loads independent "mini apps" (`app1`, `app2`) as remote modules at runtime, instead of bundling them all into one binary.

## Structure

```
host/   # shell app: navigation, loads mini apps remotely
app1/   # mini app, exposed to the host via Module Federation
app2/   # mini app, exposed to the host via Module Federation
```

Each directory is a **standalone React Native project** with its own `package.json`, native iOS/Android projects, and dependencies. There is no root-level package manager tying them together — install and run each one separately.

## How it works

1. On launch, `host` fetches a remote JSON config (from GitHub) containing the bundle URLs for `app1`/`app2`/`app3`.
2. `host` resolves those container names to bundle URLs via Re.Pack's `ScriptManager`, downloading and caching them on-device with `AsyncStorage`.
3. Mini apps are loaded lazily (`React.lazy` + `Federated.importModule`) and pushed as screens onto the host's `@react-navigation/native-stack` navigator.
4. `app1`/`app2` can also be run standalone like any other React Native app, in addition to being consumed remotely by the host.

> Note: `app3` is referenced in the resolver/config wiring but doesn't have a directory in this repo yet.

## Getting started

Requirements: Node 16 (see `.node-version`), Ruby 2.7.5 (see `.ruby-version`), Yarn.

For each app you want to run (`host`, `app1`, `app2`), from inside that directory:

```bash
yarn install
cd ios && bundle install && bundle exec pod install && cd ..   # iOS only

yarn start          # start the Re.Pack dev server
yarn android         # run on Android
yarn ios             # run on iOS
```

To run the full super app experience, start `host` plus the mini apps you want to test, and point `host`'s remote config at their dev server URLs.

## Other commands

Run inside any of `host`/`app1`/`app2`:

```bash
yarn test    # jest
yarn lint    # eslint .
yarn clean   # remove node_modules
```

`app1` and `app2` also have production bundling scripts, used to publish the remote bundles the host fetches:

```bash
yarn webpack-android
yarn webpack-ios
```

## More details

See [CLAUDE.md](CLAUDE.md) for a deeper architecture writeup (Module Federation config, the remote-loading/resolver flow, navigation wiring).
