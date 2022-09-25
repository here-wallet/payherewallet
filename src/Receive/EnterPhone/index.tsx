import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Account from "../../core/Account";
import { formatPhone, showError, validatePhone } from "../../core/utils";
import { Button, LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const EnterPhone = ({ account }: { account: Account | null }) => {
  const navigate = useNavigate();
  const [phoneId, setPhoneId] = useState<number | null>(null);
  const [phone, setPhone] = useState(account?.phone ?? "");
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);

  if (account == null) {
    return <Navigate to="/receive" />;
  }

  const handlePhone = async () => {
    if (account == null) return;

    setLoading(true);
    const phoneAccaunt = await account.checkRegistration(phone);
    if (phoneAccaunt === account.accountId) {
      account.setupPhone(phone);
      return navigate("/receive/success");
    }

    if (phoneAccaunt == null) {
      await account?.api
        .sendPhone(phone, account.accountId)
        .then(setPhoneId)
        .catch(() => showError("sendPhone error"));
    } else {
      showError("Phone already linked");
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    if (account == null || phoneId == null) return;
    setLoading(true);

    await account.api
      .allocateNearAccount(code, phoneId, account.accountId)
      .then(() => {
        account.setupPhone(phone);
        navigate("/receive/success");
      })
      .catch(() => showError("SMS code incorrect"));

    setLoading(false);
  };

  if (phoneId) {
    return (
      <S.Section>
        <Title>Verify phone number</Title>
        <S.Phone>
          Enter the code sent to <b>{phone}</b>
        </S.Phone>

        <S.SInput
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="SMS code"
          disabled={isLoading}
        />

        <Button onClick={handleVerify} disabled={isLoading}>
          {isLoading ? "Loading..." : "Verify"}
        </Button>
        <LinkButton
          style={{ width: "100%", marginTop: 16 }}
          onClick={() => setPhoneId(null)}
        >
          Back
        </LinkButton>
      </S.Section>
    );
  }

  return (
    <S.Section>
      <Title>Enter phone</Title>
      <S.SInput
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="Phone number"
      />
      <Button
        onClick={handlePhone}
        disabled={isLoading || !validatePhone(phone)}
      >
        {isLoading ? "Loading..." : "Continue"}
      </Button>
    </S.Section>
  );
};

export default EnterPhone;
