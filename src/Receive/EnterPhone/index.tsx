import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Account from "../../core/Account";
import { showError } from "../../core/utils";
import { Button, LinkButton, StrokeButton } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
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
    const isAuth = await account.checkRegistration(phone);
    if (isAuth) {
      account.setupPhone(phone);
      return navigate("/receive/approve");
    }

    await account?.api
      .sendPhone(phone, account.accountId)
      .then(setPhoneId)
      .catch(() => showError("sendPhone error"));

    setLoading(false);
  };

  const handleVerify = async () => {
    if (account == null || phoneId == null) return;
    setLoading(true);

    await account.api
      .allocateNearAccount(code, phoneId, account.accountId)
      .then(() => {
        account.setupPhone(phone);
        navigate("/receive/approve");
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
        <Input
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
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
      />
      <Button onClick={handlePhone} disabled={isLoading}>
        {isLoading ? "Loading..." : "Continue"}
      </Button>
    </S.Section>
  );
};

export default EnterPhone;
