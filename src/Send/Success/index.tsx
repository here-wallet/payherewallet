import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imageUrl from "../../assets/rock.png";
import Account from "../../core/Account";
import { SmsRequest, SmsStatus } from "../../core/api";
import { delay, showError } from "../../core/utils";
import { Title } from "../../Homepage/styled";
import { LinkButton } from "../../uikit/Button";
import { Amount } from "../../uikit/Title";
import * as S from "./styled";

const getComment = (request: SmsRequest, symbol: string) => {
  const link = `https://phone.herewallet.app/receive?phone=${request.send_to_phone}`;
  if (request.nft) {
    return `Hello! I sent you NFT. You can get it here: ${link}`;
  }

  return `Hello! I sent you ${request.amount} ${symbol}. You can get it here: ${link}`;
};

const SendSuccess = ({ account }: { account: Account | null }) => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const [data] = useState<SmsRequest>(() => {
    const query = new URLSearchParams(window.location.search);
    return {
      nft: query.get("nft") ?? "",
      token: query.get("token") ?? "",
      amount: query.get("amount") ?? "",
      transaction_hash: query.get("transactionHashes") ?? "",
      near_account_id: query.get("near_account_id") ?? "",
      send_to_phone: query.get("send_to_phone") ?? "",
      comment: query.get("comment") ?? "",
    };
  });

  const token = account?.tokens.find((t) => t.symbol === data?.token);

  useEffect(() => {
    if (account == null) return;
    let isDisposed = false;

    const handler = async () => {
      await delay(5000);
      if (isDisposed) return;

      const { status } = await account?.api
        .checkSms(data.transaction_hash)
        .catch(() => ({ status: "loading" }));

      if (status === SmsStatus.undelivered) {
        setLoading(false);
        setError(true);
        return;
      }

      if (status === SmsStatus.delivered) {
        setLoading(false);
        return;
      }

      handler();
    };

    handler();
    return () => {
      isDisposed = true;
    };
  }, [account, data]);

  const handleCopy = async () => {
    navigator.clipboard
      .writeText(getComment(data, token?.symbol ?? "NEAR"))
      .then(() => {
        showError("The message has been copied");
      });
  };

  return (
    <S.Section>
      <img src={imageUrl} alt="success" />
      <S.Card>
        {data?.nft ? (
          <Title>NFT Sent</Title>
        ) : (
          <Amount>
            {data?.amount}
            <span>{token?.symbol ?? "NEAR"}</span>
          </Amount>
        )}

        <p style={{ marginTop: 2 }}>
          You have successfully transfered <br />
          money to <b>+{data?.send_to_phone}</b>.
          <br />
          {isError ? (
            <div style={{ marginTop: 8 }}>
              This phone number is not supported. Please send your friend a
              message by yourself{" "}
              <LinkButton onClick={handleCopy}>Copy message</LinkButton>
            </div>
          ) : isLoading ? (
            <div style={{ marginTop: 8 }}>
              <b> Waiting for the usage message to be sent...</b>
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <b>Ready! The message has been sent!</b>
            </div>
          )}
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
