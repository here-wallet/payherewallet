import { useState, useEffect } from "react";
import imageUrl from "../../assets/rock.png";
import Account from "../../core/Account";
import { SmsRequest } from "../../core/api";
import { Title } from "../../Homepage/styled";
import { Amount } from "../../uikit/Title";
import * as S from "./styled";

const SendSuccess = ({ account }: { account: Account | null }) => {
  const [data, setData] = useState<SmsRequest | null>(null);

  useEffect(() => {
    account
      ?.completeSendMoney()
      .then(setData)
      .catch((e) => alert("completeSendMoney error"));
  }, [account, setData]);

  if (data == null) {
    return (
      <>
        <Title>Loading...</Title>
      </>
    );
  }

  return (
    <S.Section>
      <img src={imageUrl} alt="success" />
      <S.Card>
        <Amount>
          {data.amount}
          <span>NEAR</span>
        </Amount>
        <p>
          You have successfully transfered <br />
          money to <b>{data?.send_to_phone}</b>.
          <br />
          User will receive an SMS with all the details
        </p>
        <a href={`https://explorer.near.org/?query=${data?.transaction_hash}`}>
          Transaction link
        </a>
      </S.Card>
    </S.Section>
  );
};

export default SendSuccess;
