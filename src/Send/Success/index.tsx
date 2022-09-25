import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imageUrl from "../../assets/rock.png";
import Account from "../../core/Account";
import { SmsRequest } from "../../core/api";
import { showError } from "../../core/utils";
import { Title } from "../../Homepage/styled";
import { LinkButton } from "../../uikit/Button";
import { Amount } from "../../uikit/Title";
import * as S from "./styled";

const SendSuccess = ({ account }: { account: Account | null }) => {
  const [data, setData] = useState<SmsRequest | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    account
      ?.completeSendMoney()
      .then(setData)
      .catch((e) => {
        showError("completeSendMoney error");
        navigate("/send");
      })
      .finally(() => setLoading(false));
  }, [account, navigate, setData]);

  if (isLoading) {
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
          {data?.amount}
          <span>NEAR</span>
        </Amount>
        <p>
          You have successfully transfered <br />
          money to <b>{data?.send_to_phone}</b>.
          <br />
          User will receive an SMS with all the details
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          <LinkButton onClick={() => navigate("/send")}>Go back</LinkButton>
          <a
            href={`https://explorer.near.org/?query=${data?.transaction_hash}`}
          >
            Transaction link
          </a>
        </div>
      </S.Card>
    </S.Section>
  );
};

export default SendSuccess;
