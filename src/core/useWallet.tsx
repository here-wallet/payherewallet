import React, { useEffect, useState, useContext } from "react";
import {
  WalletSelector,
  Wallet,
  Account,
  NetworkId,
} from "@near-wallet-selector/core";
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
import { setupDefaultWallets } from "@near-wallet-selector/default-wallets";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupHereWallet } from "./here-wallet";

type AppServices = {
  selector: WalletSelector;
  selectorModal: WalletSelectorModal;
  wallet: Wallet | null;
  account: Account | null;
};

type Props = {
  children: React.ReactNode;
};

const AppContext = React.createContext<AppServices | null>(null);

export function AppContextProvider({ children }: Props) {
  const [context, setContext] = useState<AppServices | null>(null);

  useEffect(() => {
    const init = async () => {
      const selector = await setupWalletSelector({
        network: process.env.REACT_APP_NETWORK! as NetworkId,
        modules: [
          setupHereWallet(),
          ...(await setupDefaultWallets()),
          setupNearWallet(),
          setupMyNearWallet(),
          setupSender(),
          setupMathWallet(),
          setupNightly(),
          setupMeteorWallet(),
          setupLedger(),
        ],
      });

      const selectorModal = setupModal(selector, {
        contractId: process.env.REACT_APP_CONTRACT!,
      });

      selector.store.observable.subscribe(async () => {
        const wallet = await selector.wallet().catch(() => null);
        const account = await wallet?.getAccounts();
        setContext({
          selector,
          selectorModal,
          wallet,
          account: account?.[0] ?? null,
        });
      });

      const wallet = await selector.wallet().catch(() => null);
      setContext({ selector, selectorModal, wallet, account: null });
    };

    init();
  }, []);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export function useWallet() {
  const context = useContext(AppContext);
  return context;
}
