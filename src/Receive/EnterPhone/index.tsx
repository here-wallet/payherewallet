import { useState } from "react";
import Account from "../../core/Account";
import { useWallet } from "../../core/useWallet";
import { Button, StrokeButton } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const EnterPhone = ({ account }: { account: Account | null }) => {
  const app = useWallet();
  const [phoneId, setPhoneId] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const handlePhone = () => {
    if (app?.account == null) return;
    account?.api.sendPhone(phone, app.account.accountId).then(setPhoneId);
  };

  const handleVerify = () => {
    if (app?.account == null) return;
    if (phoneId == null) return;

    account?.api.allocateNearAccount(code, phoneId, app.account.accountId);
  };

  if (phoneId) {
    return (
      <S.Section>
        <Title>Verify phone number</Title>
        <S.Phone>Enter the code sent to +{phone}</S.Phone>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="SMS code"
        />
        <Button onClick={handleVerify}>Verify</Button>
        <StrokeButton onClick={() => setPhoneId(null)}>Back</StrokeButton>
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
      <Button onClick={handlePhone}>Continue</Button>
    </S.Section>
  );
};

export default EnterPhone;
