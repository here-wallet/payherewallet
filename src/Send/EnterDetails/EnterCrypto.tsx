import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as ArrowDown } from "./arrow.svg";
import Account from "../../core/Account";
import { useUsdNear } from "../../core/useCurrency";
import { useWallet } from "../../core/useWallet";
import {
  changeSearch,
  formatAmount,
  formatPhone,
  getSearch,
  showError,
  validatePhone,
} from "../../core/utils";
import { Button } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const initSearch = getSearch();
console.log(initSearch);

const tokens = [
  { id: null, label: "NEAR" },
  { id: "usn.near", label: "USN" },
  { id: "usdt.near", label: "USDT" },
];

const EnterCrypto = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const near2usd = useUsdNear();
  const navigate = useNavigate();
  const firstCall = useRef(true);
  const [isOpen, setOpen] = useState(false);

  const [amount, setAmount] = useState(initSearch.amount || "");
  const [token, setToken] = useState("USN");
  const [phone, setPhone] = useState(initSearch.phone || "");
  const [receiver, setReceiver] = useState(initSearch.comment || "");
  const isInvalid = isNaN(+amount) || !validatePhone(phone) || !receiver;

  useEffect(() => {
    if (firstCall.current) {
      firstCall.current = false;
      return;
    }

    changeSearch({ phone, amount, token, receiver });
  }, [phone, amount, token, receiver]);

  useEffect(() => {
    const handler = () => setOpen(false);
    document.body.addEventListener("click", handler);
    return () => document.body.removeEventListener("click", handler);
  }, []);

  const handleTransfer = async () => {
    if (account == null) return app?.selectorModal.show();

    const contract = tokens.find((t) => t.label === token)?.id;
    const promise = contract
      ? account.sentFingToken(phone, amount, contract, receiver)
      : account.sendMoney(phone, amount, receiver);

    promise
      .then((path) => navigate(path))
      .catch(() => showError("sendMoney error"));
  };

  const toNFT = () => {
    if (app?.account) return navigate("/send/nft");
    app?.selectorModal.show();
  };

  const contractToken = tokens.find((t) => t.label === token)?.id;
  let course =
    "$" + contractToken
      ? (+amount).toFixed(2)
      : (+amount * near2usd).toFixed(2);

  const handleToken = (t: any) => {
    setToken(t.label);
    setOpen(false);
  };

  const postfix = (
    <div onClick={(e) => e.stopPropagation()}>
      <S.Token onClick={() => setOpen((v) => !v)}>
        {contractToken ? token : "NEAR"}
        <ArrowDown />
      </S.Token>

      {isOpen && (
        <S.Picker>
          {tokens
            .filter((t) => t.label !== token)
            .map((t) => (
              <S.Option key={t.id} onClick={() => handleToken(t)}>
                {t.label}
              </S.Option>
            ))}
        </S.Picker>
      )}
    </div>
  );

  return (
    <S.Section>
      <Title>Enter details</Title>
      <S.Tabs>
        <S.Tab onClick={() => navigate("/send/crypto")} isSelected>
          Crypto
        </S.Tab>
        <S.Tab onClick={toNFT}>NFT</S.Tab>
      </S.Tabs>

      <S.SInput
        value={amount}
        onChange={(e: any) => setAmount(formatAmount(e.target.value))}
        placeholder={`Amount (${contractToken ? token : "NEAR"})`}
        postfix={postfix}
        type="tel"
      />

      <S.SInput
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Comment (Peter for apples)"
      />

      <S.SInput
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="Receiver phone (+1)"
        type="tel"
      />
      <Button onClick={handleTransfer} disabled={isInvalid}>
        {app?.account ? "Send" : "Connect wallet"}
      </Button>
    </S.Section>
  );
};

export default EnterCrypto;
