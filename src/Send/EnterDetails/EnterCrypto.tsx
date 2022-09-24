import { useState } from "react";
import { Link } from "react-router-dom";
import Account from "../../core/Account";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import * as S from "./styled";

const EnterCrypto = ({ account }: { account: Account | null }) => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");

  const handleTransfer = async () => {
    if (account == null) return;
    account.sendMoney(phone, amount, sender, receiver);
  };

  return (
    <S.Section>
      <S.Title>Enter details</S.Title>
      <S.Tabs>
        <Link to="/send/crypto">
          <S.Tab isSelected>Crypto</S.Tab>
        </Link>
        <Link to="/send/nft">
          <S.Tab>NFT</S.Tab>
        </Link>
      </S.Tabs>

      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />
      <Input
        value={sender}
        onChange={(e) => setSender(e.target.value)}
        placeholder="Sender name"
      />
      <Input
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Receiver name"
      />
      <Button onClick={handleTransfer}>Review</Button>
    </S.Section>
  );
};

export default EnterCrypto;
