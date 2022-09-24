import { useState, useEffect } from "react";
import imageUrl from "../../assets/rock.png";
import Account from "../../core/Account";
import { SmsRequest } from "../../core/api";
import * as S from "./styled";

const SendSuccess = ({ account }: { account: Account | null }) => {
  const [data, setData] = useState<SmsRequest | null>(null);

  useEffect(() => {
    console.log("completeSendMoney");
    account?.completeSendMoney().then(setData);
  }, [account, setData]);

  if (data == null) {
    return null;
  }

  return (
    <S.Section>
      <img src={imageUrl} alt="success" />
      <S.Card>
        <h2>
          {data.amount}
          <span>NEAR</span>
        </h2>
        <p>
          You have successfully transfered money
          <br />
          to <b>{data?.send_to_phone}</b>.
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
