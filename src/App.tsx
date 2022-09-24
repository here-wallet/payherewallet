import { useEffect, useState } from "react";
import styled from "styled-components";
import { Routes, Route, Navigate } from "react-router-dom";
import { ReactComponent as Appstore } from "./assets/appstore.svg";

import { useWallet } from "./core/useWallet";
import Account from "./core/Account";
import { Header } from "./Header";
import Homepage from "./Homepage";
import SendSuccess from "./Send/Success";
import EnterPhone from "./Receive/EnterPhone";
import ReceiveSuccess from "./Receive/Success";
import EnterCrypto from "./Send/EnterDetails/EnterCrypto";
import EnterNFT from "./Send/EnterDetails/EnterNFT";
import Connect from "./Receive/Connect";
import InstallHere from "./Receive/InstallHere";
import ApproveReceive from "./Receive/ApproveReceive";

const App = () => {
  const app = useWallet();
  const account = app?.account ?? null;

  const handleLogin = async () => {
    app?.selectorModal.show();
  };

  return (
    <Container>
      <Header
        account={app?.account?.accountId ?? ""}
        onLogout={() => app?.account?.logout()}
        onLogin={handleLogin}
      />

      <Routes>
        <Route
          path="/receive/success"
          element={<ReceiveSuccess account={account} />}
        />
        <Route
          path="/receive/approve"
          element={<ApproveReceive account={account} />}
        />
        <Route
          path="/receive/verify"
          element={<EnterPhone account={account} />}
        />
        <Route path="/receive/here" element={<InstallHere />} />
        <Route
          path="/receive"
          element={<Connect account={account} onLogin={handleLogin} />}
        />
        <Route
          path="/send/success"
          element={<SendSuccess account={account} />}
        />

        <Route
          path="/send/crypto"
          element={<EnterCrypto account={account} />}
        />
        <Route path="/send/nft" element={<EnterNFT account={account} />} />
        <Route path="/send" element={<Navigate to="/send/crypto" />} />

        <Route path="/" element={<Homepage />} />
      </Routes>

      <Footer>
        <a href="https://testflight.apple.com/join/osMqBAZ9">
          <Appstore />
        </a>
        <p>
          Don’t have an account yet?{" "}
          <nobr>
            Visit <a href="https://herewallet.app">herewallet.app</a>
          </nobr>
        </p>
      </Footer>
    </Container>
  );
};

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 32px;
  padding: 0 16px;

  p {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #6b6661;
    margin: 24px 0;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  width: 100vw;
`;

export default App;
