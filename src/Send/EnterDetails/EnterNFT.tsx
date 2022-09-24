import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Account from "../../core/Account";
import { useWallet } from "../../core/useWallet";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const EnterNFT = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [receiver, setReceiver] = useState("");

  const handleTransfer = async () => {
    if (account == null) return;
  };

  if (app?.account == null) {
    return <Navigate to="/send" />;
  }

  const toNFT = () => {
    if (app?.account) {
      navigate("/send/nft");
      return;
    }
    app?.selectorModal.show();
  };

  return (
    <S.Section>
      <Title>Enter details</Title>
      <S.Tabs>
        <S.Tab onClick={() => navigate("/send/crypto")}>Crypto</S.Tab>
        <S.Tab isSelected onClick={toNFT}>
          NFT
        </S.Tab>
      </S.Tabs>

      <Input
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Receiver name"
      />
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Receiver phone"
      />
      <Button onClick={handleTransfer}>Review</Button>
    </S.Section>
  );
};

export default EnterNFT;
