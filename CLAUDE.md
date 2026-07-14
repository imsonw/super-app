# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is **not a single project** — it's three independent React Native apps living side by side, each with its own `package.json`, `node_modules`, iOS/Android native projects, and Ruby/CocoaPods `vendor/bundle`:

- `host/` — the shell app. Provides navigation and dynamically loads the other apps as remote modules at runtime.
- `app1/` — a "mini app" exposed to the host via Module Federation.
- `app2/` — a second mini app, same shape as `app1`.

A third mini app, `app3`, is referenced in federation/resolver config throughout the code but **does not exist in this repo**. Don't be surprised by dangling references to it in `host/index.js`, `AppNavigation.js`, and the remote config JSON.

Always `cd` into the specific app directory before running any command — there is no root `package.json` and no workspace tooling tying the three together.

## Commands

Run these from inside `host/`, `app1/`, or `app2/` individually (install deps separately in each):

```bash
yarn install                 # install JS deps for this app only
yarn start                    # react-native webpack-start (dev server, Re.Pack)
yarn android                  # react-native run-android
yarn ios                      # react-native run-ios
yarn test                     # jest
yarn test __tests__/App-test.js   # run a single test file
yarn lint                     # eslint .
yarn clean                    # recursively delete node_modules in this app
```

`app1` and `app2` (the federated remotes) additionally have production bundle-build scripts, since they need to produce standalone bundles the host fetches over the network:

```bash
yarn webpack-android          # npx webpack -c webpack.config.mjs --env platform=android --env mode=production
yarn webpack-ios              # npx webpack -c webpack.config.mjs --env platform=ios --env mode=production
```

`host` has no `webpack-*` scripts — it's launched via the normal React Native/Re.Pack dev flow (`yarn start` + `yarn android`/`yarn ios`), not built as a standalone bundle for distribution to other apps.

Native tooling notes:
- Node version is pinned via `.node-version` (16); Ruby via `.ruby-version` (2.7.5, used for CocoaPods/Fastlane-style tooling under `ios/`/`vendor/bundle`).
- iOS deps: `bundle install` then `bundle exec pod install` inside `ios/` (each app has its own `Gemfile`/`Podfile`).

## Architecture: Module Federation "super app"

This project uses [Re.Pack](https://github.com/callstack/repack) (`@callstack/repack`, a Webpack-based alternative to Metro) with Webpack 5 **Module Federation** to compose a "super app" out of independently deployable React Native mini apps.

**Bundler config**: each app's `webpack.config.mjs` configures `Repack.plugins.ModuleFederationPlugin`:
- `host`'s config declares itself `name: 'host'` and only lists `shared` deps (react, react-native, react-native-fast-image) — it does not `expose` anything.
- `app1`/`app2` declare `name: 'app1'`/`'app2'` and `exposes: {'./App': './src/App1.js'}` (resp. `App2.js`) — this is the module the host loads remotely.
- Shared deps (`react`, `react-native`, `react-native-fast-image`) are marked `singleton`/`eager` so host and remotes share one instance instead of bundling their own copies.

**Runtime remote loading** (`host/index.js`): `ScriptManager.shared.addResolver` maps federated container names (`app1`, `app2`, `app3`) to remote bundle URLs (`Config.APP1_URL`, `APP2_URL`, `APP3_URL`) using `Federated.createURLResolver`. When the caller is `'main'` (the host's own bundle), it resolves to the local dev server instead. `ScriptManager.shared.setStorage(AsyncStorage)` caches downloaded remote bundles on-device.

**Remote config bootstrap** (`host/Root.js`, top-level — distinct from `host/src/Root.js`): on app start, before rendering anything, it fetches a JSON config from a GitHub-hosted URL (`configURL`) containing `app_1`/`app_2`/`app_3` remote bundle URLs, and writes them into the mutable `Config` singleton (`host/src/Config.js`). Nothing federated can load until this fetch resolves — `Root` renders a bare "Loading..." view until `isLoaded` is true.

**Navigation & lazy loading** (`host/src/navigation/AppNavigation.js`): each mini app is loaded with `React.lazy(() => Federated.importModule('app1', './App'))` and rendered inside `React.Suspense`, as a screen in a single `@react-navigation/native-stack` `Stack.Navigator` alongside the host's own local `HomeScreen`.

**Navigation without props** (`host/src/Root.js`, lowercase, under `src/`): exports a shared `navigationRef` plus `navigate`/`goBack`/`navigateAndReset`/`navigateAndSimpleReset` helpers so both host screens and dynamically-loaded mini apps can trigger navigation without needing the navigation prop threaded through.

**Mini app shape** (`app1/`, `app2/`): each is a fully standalone React Native app (own `index.js` entry, own `App1.js`/`App2.js`, own native projects) that *also* happens to expose a component via Module Federation. This means each can be run/debugged independently (`yarn android`/`yarn ios` inside `app1/`) exactly like the host can, in addition to being loaded remotely inside the host shell.

When making changes that touch federation (adding a shared dep, changing an exposed module's public shape, adding a new mini app), all of the following need to stay consistent: the `webpack.config.mjs` `shared`/`exposes` config in the affected app(s), the resolver map in `host/index.js`, and the remote config JSON schema that `host/Root.js` fetches.
