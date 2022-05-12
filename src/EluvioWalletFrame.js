import React, {useState} from "react";
import {ElvWalletClient} from "@eluvio/elv-wallet-client/src/index";

export const PopupLogin = async () => {
  const popupClient = await ElvWalletClient.InitializePopup({
    walletAppUrl: "https://wallet.contentfabric.io",
    requestor: "WWE Moonsault",
    loginOnly: true
  })

  await new Promise((resolve, reject) => {
    popupClient.AddEventListener(popupClient.EVENTS.LOG_IN, () => resolve());
    popupClient.AddEventListener(popupClient.EVENTS.CLOSE, () => reject());
  });

  // Make sure to destroy client to close popup
  await popupClient.Destroy();
}

const EluvioWalletFrame = ({visible, client, SetClient}) => {
  const [initialized, setInitialized] = useState(false);

  return (
    <div
      ref={element => {
        // Client already initialized
        if(!element || initialized) { return; }

        const previousClient = client;
        ElvWalletClient.InitializeFrame({
          walletAppUrl: "https://wallet.contentfabric.io",
          target: element,
          requestor: "WWE Moonsault",
          loginOnly: true
        })
          .then(client => {
            SetClient(client)

            // If previously used client is present, ensure it is destroyed
            if(previousClient) {
              previousClient.Destroy();
            }
          })
          .catch(error => console.error(error));

        setInitialized(true);
      }}
      className={`wallet-frame ${visible ? "wallet-frame-visible" : "wallet-frame-hidden"}`}
    />
  )
};

export default EluvioWalletFrame;
