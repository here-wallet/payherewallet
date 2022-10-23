import React, { useEffect, useState } from "react";
import { Title } from "../uikit/Title";
import { Button } from "../Receive/Connect/styled";
import { ReactComponent as HereIcon } from "../Receive/Connect/here.svg";
import { useWallet } from "../core/useWallet";

import * as S from "./styled";
import nftImage from "./nft.svg";
import { Loading } from "../uikit/Loading";

const MintNFT = ({ handleLogin }: any) => {
  const app = useWallet();
  const [loading, setLoading] = useState(true);
  const [dropout, setDropout] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [nft, setNFT] = useState<{
    token_name: string;
    image_url: string;
  } | null>(null);

  const handleDropout = () => {
    setLoading(true);
    app?.account?.api
      .allocateDropoutNFT()
      .then(setNFT)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (app?.account == null) return;
    setLoading(true);
    app?.account
      .hasDropoutNFTs()
      .then(async (v) => {
        if (v) {
          setDropout(v);
          setLoading(false);
          return;
        }

        const nft = await app?.account?.api.allocateDropoutNFT();
        setNFT(nft);
        setDropout(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [app?.account]);

  useEffect(() => {
    if (nft == null) return;
    setImgLoading(true);
    const img = new Image();
    img.onload = () => setImgLoading(false);
    img.src = nft.image_url;
  }, [nft]);

  if (app?.isLoading) return <Loading />;

  if (app?.account == null) {
    return (
      <div style={{ padding: "16px" }}>
        <Title>Connect HERE Wallet and receive NFT</Title>
        <br />
        <Button onClick={handleLogin}>
          <HereIcon />
          Connect HERE Wallet account
        </Button>
      </div>
    );
  }

  if (loading) return <Loading />;

  if (dropout) {
    if (nft == null) {
      return (
        <S.Overlay>
          <S.NFTCard onClick={handleDropout}>
            <S.Glow />
            <S.Content>
              <h1>Congrats!</h1>
              <p>
                You won an NFT. <br />
                Click here to view it
              </p>
              <img src={nftImage} alt="nft" />
            </S.Content>
          </S.NFTCard>
        </S.Overlay>
      );
    }

    return (
      <S.Container>
        <S.CardContainer style={{ display: "flex", flexDirection: "column" }}>
          <S.Card isLoading={imgLoading}>
            {!imgLoading && <img src={nft.image_url} alt="nft" />}
          </S.Card>

          <p>
            Leave your contact information so the HERE team can contact you to
            give you the winnings{" "}
            <a href="https://forms.gle/ZRLcjZwAwWpi2GPr5">Click form</a>
          </p>
        </S.CardContainer>

        <S.Features>
          <h1>{nft.token_name}</h1>
          <p>
            This NFT has been given to early users of HERE Wallet. Each owner
            has privileges.
          </p>
          <h2>Benefits</h2>
          <S.FeatureItem style={{ "--delay": "0" } as any}>
            <h2>+1 % APY</h2>
            <p>Bonus interest</p>
          </S.FeatureItem>
          <S.FeatureItem style={{ "--delay": "0.5s" } as any}>
            <h2>Gas Refund</h2>
            <p>Gas as cashback for every transaction</p>
          </S.FeatureItem>
          <S.FeatureItem style={{ "--delay": "1s" } as any}>
            <h2>Community</h2>
            <p>
              <a href="https://t.me/+iLczZ5230X5hZDky">Click here</a> to open
              chat
            </p>
          </S.FeatureItem>
          <S.FeatureItem style={{ "--delay": "1.5s" } as any}>
            <h2>Airdrops</h2>
            <p>
              HERE Tokens will be distributed to NFT owners after the launch
            </p>
          </S.FeatureItem>
          <S.FeatureItem style={{ "--delay": "2s" } as any}>
            <h2>Mutations</h2>
            <p>
              The more money you stake, the bigger the chance that your NFT
              mutates into a very rare alien monkey
            </p>
          </S.FeatureItem>
        </S.Features>
      </S.Container>
    );
  }

  return (
    <div>
      <Title>Sorry! You dont have HERE NFT</Title>
      <p style={{ textAlign: "center" }}>
        Follow our contests on{" "}
        <a href="https://twitter.com/here_wallet">twitter</a>!
      </p>
    </div>
  );
};

export default MintNFT;
