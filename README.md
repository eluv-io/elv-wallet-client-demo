# Eluvio Wallet Client Demo

This is a simple demo created using create-react-app to demonstrate a sample flow for initializing the Eluvio wallet client, logging in, and retrieving user data.

### Setup
```
 git clone https://github.com/eluv-io/elv-wallet-client-demo.git
 cd elv-wallet-client-demo/
 npm install
 npm start
```

### Login Flow

See `src/App.js` and `src/EluvioWalletFrame.js` for sample code.

For the login flow, there are two options:
  - Show the wallet frame 
  - Create a popup to go through the login flow (saving auth info to localstorage), then reload the frame to pick up the auth info.

These flows are demonstrated in the `SampleWithFrame` and `SampleWithPopup` in `App.js`. You can set the export at the bottom to change the flow the sample uses. 

#### Notes:
- The `EluvioWalletFrame` component MUST be rendered for the lifetime of the client. The client operates by sending messages to and receiving messages from this frame. If the frame is closed, the wallet client will not work. You can use event listeners, as demonstrated in this sample, to determine whether the app is loaded and whether the user is logged in. Any time the frame is re-initialized, you should wait for a `LOADED` event.
- The popup login flow **will not work** in environments that block cross-origin frames from accessing LocalStorage (this includes Chrome incognito windows)
- This sample is written assuming only the client API is desired (and so only the login flow must be shown), so the client initialization calls include the `loginOnly` param. If you want to show the Eluvio wallet app UI at any point, but still require the user log in, use the `requireLogin` parameter instead.
