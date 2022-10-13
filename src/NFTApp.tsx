import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { ReactComponent as Appstore } from "./assets/appstore.svg";

import { useWallet } from "./core/useWallet";
import { Header } from "./Header";
import MintNFT from "./MintNFT";

const NFTApp = () => {
  const app = useWallet();
  const handleLogin = async () => {
    const wallet = await app?.selector.wallet("here-wallet");
    await wallet?.signIn({ contractId: "herewallet.near", accounts: [] });
  };

  return (
    <Container>
      <Header
        account={app?.account?.accountId ?? ""}
        onLogout={() => app?.account?.logout()}
        onLogin={handleLogin}
      />

      <Routes>
        <Route path="/" element={<MintNFT handleLogin={handleLogin} />} />
      </Routes>

      <Footer>
        <a href="https://appstore.herewallet.app/nft">
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
  width: 100vw;

  min-height: calc(var(--vh, 1vh) * 100);
`;

export default NFTApp;
