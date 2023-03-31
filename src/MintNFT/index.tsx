import React, { useEffect, useState } from "react";
import { Loading } from "./Loading";
import nftImage from "./nft.svg";
import * as S from "./styled";

const requestId = new URL(window.location.href).searchParams.get("token");

const MintNFT = () => {
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [nft, setNFT] = useState<{
    token_name: string;
    image_url: string;
  } | null>(null);

  const handleDropout = () => {
    setLoading(true);
    fetch("https://api.herewallet.app/api/v1/user/dropout_nft", {
      body: JSON.stringify({ token: requestId }),
      method: "POST",
    })
      .then((res) => res.json())
      .then(setNFT)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (nft == null) return;
    setImgLoading(true);
    const img = new Image();
    img.onload = () => setImgLoading(false);
    img.src = nft.image_url;
  }, [nft]);

  if (requestId == null) {
    return (
      <div style={{ margin: "auto" }}>
        <p style={{ textAlign: "center" }}>
          Sorry, this page no longer exists.
          <br />
          Follow us on <a href="https://twitter.com/here_wallet">twitter</a>!
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <div style={{ margin: "auto" }}>
        <Loading />
      </div>
    );

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
          This NFT has been given to early users of HERE Wallet. Each owner has
          privileges.
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
            <a href="https://t.me/+iLczZ5230X5hZDky">Click here</a> to open chat
          </p>
        </S.FeatureItem>
        <S.FeatureItem style={{ "--delay": "1.5s" } as any}>
          <h2>Airdrops</h2>
          <p>HERE Tokens will be distributed to NFT owners after the launch</p>
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
};

export default MintNFT;
