import { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

import Account from "../../core/Account";
import { NFTModel } from "../../core/api";
import { useWallet } from "../../core/useWallet";
import {
  changeSearch,
  formatPhone,
  getSearch,
  showError,
  validatePhone,
} from "../../core/utils";
import { Button } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const responsive = {
  0: { items: 1 },
  589: { items: 1 },
  1024: { items: 3 },
};

const initSearch = getSearch();
console.log(initSearch);

const EnterNFT = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const navigate = useNavigate();
  const firstCall = useRef(true);

  const [nfts, setNfts] = useState<NFTModel[]>([]);
  const [isLoading, setLoading] = useState(false);

  const [nft, setNft] = useState(initSearch.nft ?? "");
  const [phone, setPhone] = useState(initSearch.phone ?? "");
  const [receiver, setReceiver] = useState(initSearch.comment ?? "");
  const isInvalid = !validatePhone(phone) || !receiver || !nft;

  useEffect(() => {
    if (firstCall.current) {
      firstCall.current = false;
      return;
    }
    changeSearch({ phone, nft, receiver });
  }, [phone, nft, receiver]);

  const formatNft = (nft: NFTModel) =>
    `${nft.contact.contract_id}#${nft.metadata.token_id}`;

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

  useEffect(() => {
    setLoading(true);
    account?.api
      .loadNFTs(account.accountId)
      .then((v) => setTimeout(() => setNfts(v), 500))
      .catch(() => showError("Load NFTs error"))
      .finally(() => setTimeout(() => setLoading(false), 500));
  }, [account]);

  if (app?.account == null) {
    return <Navigate to="/send" />;
  }

  return (
    <S.Section>
      <Title>Enter details</Title>
      <S.Tabs>
        <S.Tab onClick={() => navigate("/send/crypto")}>Crypto</S.Tab>
        <S.Tab isSelected>NFT</S.Tab>
      </S.Tabs>

      {isLoading && <S.Badge>Loading...</S.Badge>}
      {!isLoading && !nfts.length && <S.Badge>You dont have NFT</S.Badge>}

      {nfts.length > 0 && (
        <S.Gallery>
          <AliceCarousel
            animationType="fadeout"
            animationDuration={800}
            disableButtonsControls
            disableDotsControls
            mouseTracking
            responsive={responsive}
            controlsStrategy="alternate"
            infinite
            items={nfts.map((item) => (
              <S.NftCard
                style={{ width: nfts.length === 1 ? "100%" : "" }}
                key={item.metadata.media}
                data-value={item.metadata.media}
                isSelected={formatNft(item) === nft}
                onClick={() =>
                  setNft(formatNft(item) === nft ? "" : formatNft(item))
                }
              >
                <div>
                  <img
                    src={`${item.contact.base_uri}/${item.metadata.media}`}
                    alt={item.contact.name}
                  />
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
      <S.SInput
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="Receiver phone (+1)"
      />
      <Button onClick={handleTransfer} disabled={isInvalid}>
        {app?.account ? "Send" : "Connect wallet"}
      </Button>
    </S.Section>
  );
};

export default EnterNFT;
