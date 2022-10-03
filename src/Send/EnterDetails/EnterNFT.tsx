import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import Account from "../../core/Account";
import { NFTModel } from "../../core/api";
import { useWallet } from "../../core/useWallet";
import { changeSearch, getSearch, showError } from "../../core/utils";
import { Button, LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";

import { ReactComponent as ArrowDown } from "./arrow.svg";
import * as S from "./styled";

const initSearch = getSearch();

const getNFTImage = (nft: NFTModel) => {
  if (nft.contact.contract_id === "x.paras.near") {
    return `https://paras-cdn.imgix.net//${nft.url}?w=600&auto=format,compress`;
  }
  return nft.url;
};

const EnterNFT = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const navigate = useNavigate();
  const firstCall = useRef(true);

  const [nfts, setNfts] = useState<NFTModel[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [isPhoneValid, setPhoneValid] = useState(false);
  const [nft, setNft] = useState(initSearch.nft || "");
  const [phone, setPhone] = useState(initSearch.phone || "");
  const [receiver, setReceiver] = useState(initSearch.comment || "");
  const isInvalid = !isPhoneValid || !receiver || !nft;

  useEffect(() => {
    if (firstCall.current) {
      firstCall.current = false;
      return;
    }
    changeSearch({ phone, nft, comment: receiver });
  }, [phone, nft, receiver]);

  const formatNft = (nft: NFTModel) =>
    `${nft.contact.contract_id}#${nft.metadata.token_id}`;
  const selectedItem = nfts.findIndex((t) => formatNft(t) === nft);

  const handleTransfer = async () => {
    if (account == null) return app?.selectorModal.show();
    account
      .sendNFT(phone, nft, receiver)
      .then((path) => navigate(path))
      .catch((e) => {
        console.log(e);
        showError("sendNFT error");
      });
  };

  const handlePhoneValid = (value: string, data: any) => {
    setTimeout(() => {
      setPhoneValid(value.length !== data.format.split(".").length - 1);
    }, 0);
    return true;
  };

  const setPrevNft = () => {
    setNft(
      formatNft(nfts[selectedItem - 1 < 0 ? nfts.length - 1 : selectedItem - 1])
    );
  };

  const setNextNft = () => {
    setNft(
      formatNft(nfts[selectedItem + 1 >= nfts.length ? 0 : selectedItem + 1])
    );
  };

  useEffect(() => {
    if (account == null) return;

    setLoading(true);
    account?.api
      .loadNFTs(account.accountId)
      .then((v) => setTimeout(() => setNfts(v), 500))
      .catch(() => showError("Load NFTs error"))
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [account]);

  return (
    <S.Section>
      <Title>Enter details</Title>
      <S.Tabs>
        <S.Tab onClick={() => navigate("/send/crypto")}>Crypto</S.Tab>
        <S.Tab isSelected>NFT</S.Tab>
      </S.Tabs>

      {account && isLoading && <S.Badge>Loading...</S.Badge>}
      {account && !isLoading && !nfts.length && (
        <S.Badge>You dont have NFT</S.Badge>
      )}

      {!account && (
        <S.Badge>
          You must
          <LinkButton onClick={() => app?.selectorModal.show()}>
            connect a wallet
          </LinkButton>
        </S.Badge>
      )}

      {account && !isLoading && nfts.length > 0 && (
        <S.Gallery>
          <S.LeftButton onClick={() => setPrevNft()}>
            <ArrowDown />
          </S.LeftButton>

          <S.RightButton onClick={() => setNextNft()}>
            <ArrowDown />
          </S.RightButton>

          <AliceCarousel
            infinite
            mouseTracking
            responsive={{ 0: { items: 1 } }}
            animationType="fadeout"
            animationDuration={800}
            disableButtonsControls
            disableDotsControls
            controlsStrategy="alternate"
            activeIndex={selectedItem}
            onSlideChanged={(e) => setNft(formatNft(nfts[e.item]))}
            items={nfts.map((item) => (
              <S.NftCard
                style={{
                  width: nfts.length === 1 ? "100%" : "",
                }}
                key={item.metadata.media}
                data-value={item.metadata.media}
              >
                <div>
                  <img src={getNFTImage(item)} alt={item.contact.name} />
                  <p>
                    {item.contact.name.slice(0, 60)} #{item.metadata.token_id}
                  </p>
                </div>
              </S.NftCard>
            ))}
          />
        </S.Gallery>
      )}

      <S.SInput
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Comment (Peter for apples)"
      />

      <S.SPhoneInput
        value={phone}
        onChange={(v) => setPhone(v)}
        isValid={handlePhoneValid}
        placeholder="Receiver phone (+1)"
        country="us"
      />

      <Button onClick={handleTransfer} disabled={isInvalid}>
        Continue
      </Button>
    </S.Section>
  );
};

export default EnterNFT;
