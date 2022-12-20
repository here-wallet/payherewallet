import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

import { useWallet } from "../../core/useWallet";
import Account from "../../core/Account";
import { Button, LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import { Spinner } from "../../uikit/Spinner";
import { FTModel } from "../../core/api";
import {
  changeSearch,
  formatAmount,
  getSearch,
  showError,
} from "../../core/utils";

import { ReactComponent as ArrowDown } from "./arrow.svg";
import * as S from "./styled";

const initSearch = getSearch();

const EnterCrypto = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const navigate = useNavigate();
  const firstCall = useRef(true);
  const [isOpen, setOpen] = useState(false);

  const [isPhoneValid, setPhoneValid] = useState(false);
  const [amount, setAmount] = useState(initSearch.amount || "");
  const [token, setToken] = useState(initSearch.token || "NEAR");
  const [phone, setPhone] = useState(initSearch.phone || "");
  const [receiver, setReceiver] = useState(initSearch.comment || "");
  const isInvalid = isNaN(+amount) || isPhoneValid;

  useEffect(() => {
    if (firstCall.current) {
      firstCall.current = false;
      return;
    }

    changeSearch({ phone, amount, token, comment: receiver });
  }, [phone, amount, token, receiver]);

  useEffect(() => {
    const handler = () => setOpen(false);
    document.body.addEventListener("click", handler);
    return () => document.body.removeEventListener("click", handler);
  }, []);

  const handleTransfer = async () => {
    if (account == null) return app?.selectorModal.show();

    const ftModel = tokens.find(
      (t) => t.symbol === token && t.symbol !== "NEAR"
    );

    const promise = ftModel
      ? account.sentFingToken(phone, amount, ftModel, receiver)
      : account.sendMoney(phone, amount, receiver);

    promise
      .then((path) => navigate(path))
      .catch((e) => {
        console.log(e);
        showError("sendMoney error");
      });
  };

  const handlePhoneValid = (value: string, data: any) => {
    setTimeout(() => {
      setPhoneValid(value.length < 6);
    }, 0);
    return true;
  };

  const handleToken = (t: FTModel) => {
    setToken(t.symbol);
    setOpen(false);
  };

  const tokens =
    toJS(account?.tokens)?.sort(
      (a, b) => b.amount * b.usd_rate - a.amount * a.usd_rate
    ) ?? [];

  const selectedToken = account?.tokens.find((t) => t.symbol === token) ?? {
    usd_rate: 1,
    amount: 0,
  };

  const { usd_rate } = selectedToken;
  const tokenBalance = (selectedToken.amount * usd_rate).toFixed(2);
  const amount2usd = ((isNaN(+amount) ? 0 : +amount) * usd_rate).toFixed(2);

  const postfix = (
    <div onClick={(e) => e.stopPropagation()}>
      <S.Token
        style={{ fontWeight: "bolder" }}
        onClick={() => setOpen((v) => !v)}
      >
        {token}
        <ArrowDown />
      </S.Token>

      {isOpen && (
        <S.PickerMenu>
          <S.PickerWrapper>
            <S.PickerList>
              {tokens.length === 0 && <Spinner />}
              {tokens.map((t) => (
                <S.Option key={t.token_id} onClick={() => handleToken(t)}>
                  {t.symbol}
                  <img width="24" src={t.icon} alt="icon" />
                </S.Option>
              ))}
            </S.PickerList>
          </S.PickerWrapper>
        </S.PickerMenu>
      )}
    </div>
  );

  return (
    <S.Section>
      <Title>Enter details</Title>
      <S.Tabs>
        <S.Tab isSelected>Crypto</S.Tab>
        <S.Tab onClick={() => navigate("/send/nft")}>NFT</S.Tab>
      </S.Tabs>

      {!account && (
        <S.Badge>
          You must
          <LinkButton onClick={() => app?.selectorModal.show()}>
            connect a wallet
          </LinkButton>
        </S.Badge>
      )}

      {account && (
        <>
          <S.CurrencyLabel>
            <span>${amount2usd}</span>
            <span>Balance: ${tokenBalance}</span>
          </S.CurrencyLabel>

          <S.SInput
            value={amount}
            onChange={(e: any) => setAmount(formatAmount(e.target.value))}
            placeholder={`Amount (${token})`}
            postfix={postfix}
          />
        </>
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

export default observer(EnterCrypto);