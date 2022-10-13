import React, { useEffect, useState, useContext } from "react";
import { WalletSelector, NetworkId } from "@near-wallet-selector/core";
import { setupWalletSelector } from "@near-wallet-selector/core";
import {
  setupModal,
  WalletSelectorModal,
} from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { setupHereWallet } from "./here-wallet";

import "@near-wallet-selector/modal-ui/styles.css";
import Account from "./Account";
import { delay } from "./utils";

type AppServices = {
  selector: WalletSelector;
  selectorModal: WalletSelectorModal;
  account: Account | null;
  isLoading: boolean;
};

type Props = {
  children: React.ReactNode;
};

let loginTx: string | null = null;
const query = new URLSearchParams(window.location.search);
const hash = query.get("transactionHashes");
const isKeys = query.get("all_keys");
if (isKeys) loginTx = hash;

const AppContext = React.createContext<AppServices | null>(null);

export function AppContextProvider({ children }: Props) {
  const [context, setContext] = useState<AppServices | null>(null);

  useEffect(() => {
    const init = async () => {
      const selector = await setupWalletSelector({
        network: process.env.REACT_APP_NETWORK! as NetworkId,
        modules: [
          setupHereWallet(),
          setupNearWallet(),
          setupSender(),
          setupLedger(),
          setupMyNearWallet(),
          setupMeteorWallet(),
          setupNightly(),
          setupMathWallet(),
        ],
      });

      const selectorModal = setupModal(selector, {
        contractId: process.env.REACT_APP_CONTRACT!,
      });

      const { network } = selector.options;
      const provider = new JsonRpcProvider({ url: network.nodeUrl });

      selector.store.observable.subscribe(async () => {
        const wallet = await selector.wallet().catch(() => null);
        if (wallet == null) {
          context?.account?.dispose();
          setContext({
            account: null,
            selector,
            selectorModal,
            isLoading: false,
          });
          return;
        }

        context?.account?.dispose();

        setContext({
          account: null,
          selector,
          selectorModal,
          isLoading: true,
        });

        const accounts = await wallet.getAccounts();
        const name = accounts[0].accountId;
        const account = new Account(name, wallet, provider);
        if (loginTx) await delay(8000);

        await account.auth().catch(() => null);
        setContext({
          account,
          selector,
          selectorModal,
          isLoading: false,
        });
      });

      setContext({ selector, selectorModal, account: null, isLoading: false });
    };

    init();
  }, []);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export function useWallet() {
  const context = useContext(AppContext);
  return context;
}
