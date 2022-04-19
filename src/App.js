import React, {useState, useEffect} from "react";
import './App.css';

import EluvioWalletFrame, {PopupLogin} from "./EluvioWalletFrame";

// Login flow is done in the iframe. Use loaded + logged in state to determine when to show / hide the frame.
function SampleWithFrame() {
  const [client, setClient] = useState(undefined);
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(undefined);

  useEffect(() => {
    if(!client) { return; }

    window.client = client;

    client.AddEventListener(client.EVENTS.ALL, event => console.log(event));

    // Wallet app has finished loading and the client is ready to use - if the user is logged in, a LOG_IN event will have proceeded this event.
    client.AddEventListener(client.EVENTS.LOADED, () => setLoaded(true));

    // User has logged out - This causes a full app reload, so set `loaded` to false. A new `LOADED` event will fire when the app has finished reloading.
    client.AddEventListener(client.EVENTS.LOG_OUT, () => {
      setLoaded(false);
      setLoggedIn(false);
      setUserProfile(undefined);
    });

    // User has logged in, and their profile info is now accessible.
    client.AddEventListener(
      client.EVENTS.LOG_IN,
      async () => {
        setLoggedIn(true);
        setUserProfile(await client.UserProfile());
      }
    );
  }, [client]);

  return (
    <div className="App">
      { /* Keep this component loaded, it is the frame the client depends on */}
      <EluvioWalletFrame
        // Determine when you want to show the frame for login
        visible={loaded && !loggedIn}
        client={client}
        SetClient={setClient}
      />

      <div>Wallet Loaded: { loaded.toString() }</div>
      <div>Wallet Logged In: { loggedIn.toString() }</div>
      <div>User Profile: <pre>{JSON.stringify(userProfile || {}, null, 2)}</pre></div>

      {
        loggedIn ?
          <button
            onClick={async () => {
              setLoaded(false);
              setLoggedIn(false);
              await client.SignOut()
            }}
            className="log-out-button"
          >
            Sign Out
          </button> : null
      }
    </div>
  );
}

// Login flow is done with a popup. Frame is never shown.
function SampleWithPopup() {
  const [client, setClient] = useState(undefined);
  const [popupLoggedIn, setPopupLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(undefined);

  useEffect(() => {
    if(!client) { return; }

    window.client = client;

    client.AddEventListener(client.EVENTS.ALL, event => console.log(event));

    // Wallet app has finished loading and the client is ready to use - if the user is logged in, a LOG_IN event will have proceeded this event.
    client.AddEventListener(client.EVENTS.LOADED, () => setLoaded(true));

    // User has logged out - This causes a full app reload, so set `loaded` to false. A new `LOADED` event will fire when the app has finished reloading.
    client.AddEventListener(client.EVENTS.LOG_OUT, () => {
      setLoaded(false);
      setLoggedIn(false);
      setPopupLoggedIn(false);
      setUserProfile(undefined);
    });

    // User has logged in, and their profile info is now accessible.
    client.AddEventListener(
      client.EVENTS.LOG_IN,
      async () => {
        setLoggedIn(true);
        setUserProfile(await client.UserProfile());
      }
    );
  }, [client]);

  return (
    <div className="App">
      { /* Keep this component loaded, it is the frame the client depends on */}
      <EluvioWalletFrame
        // Use key to force reload frame when the popup indicates login
        key={`wallet-frame-${popupLoggedIn}`}
        client={client}
        visible={false}
        SetClient={setClient}
      />

      <div>Wallet Loaded: { loaded.toString() }</div>
      <div>Wallet Logged In: { loggedIn.toString() }</div>
      <div>User Profile: <pre>{JSON.stringify(userProfile || {}, null, 2)}</pre></div>

      {
        loggedIn ?
          <button
            onClick={async () => {
              setLoaded(false);
              setLoggedIn(false);
              await client.SignOut()
            }}
          >
            Sign Out
          </button> : null
      }

      {
        !loggedIn && loaded ?
          <button
            onClick={async () => {
              try {
                await PopupLogin()
                setPopupLoggedIn(true);
                setLoaded(false);
              } catch(error) {
                console.log(error);
              }
            }}
          >
            Sign In
          </button> : null
      }
    </div>
  );
}

//export default SampleWithFrame;
export default SampleWithPopup;
