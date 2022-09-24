import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Account from "../../core/Account";
import { useWallet } from "../../core/useWallet";
import { changeSearch, getSearch } from "../../core/utils";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const initSearch = getSearch();
console.log(initSearch);

const EnterCrypto = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const navigate = useNavigate();
  const firstCall = useRef(true);

  const [amount, setAmount] = useState(initSearch.amount || "");
  const [phone, setPhone] = useState(initSearch.phone || "");
  const [receiver, setReceiver] = useState(initSearch.receiver || "");
  const isInvalid = !amount || !phone || !receiver;

  const handleTransfer = async () => {
    if (account == null) {
      return app?.selectorModal.show();
    }

    account.sendMoney(phone, amount, receiver).then((path) => navigate(path));
  };

  useEffect(() => {
    if (firstCall.current) {
      firstCall.current = false;
      return;
    }

    changeSearch({ phone, amount, receiver });
  }, [phone, amount, receiver]);

  const toNFT = () => {
    if (app?.account) {
      return navigate("/send/nft");
    }

    app?.selectorModal.show();
  };

  return (
    <S.Section>
      <Title>Enter details</Title>
      <S.Tabs>
        <S.Tab onClick={() => navigate("/send/crypto")} isSelected>
          Crypto
        </S.Tab>
        <S.Tab onClick={toNFT}>NFT</S.Tab>
      </S.Tabs>

      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
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
      <Button onClick={handleTransfer} disabled={isInvalid}>
        {app?.account ? "Review" : "Connect wallet"}
      </Button>
    </S.Section>
  );
};

export default EnterCrypto;
