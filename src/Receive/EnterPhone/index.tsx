import { useState } from "react";
import Account from "../../core/Account";
import { Button, StrokeButton } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import * as S from "./styled";

const EnterPhone = ({ account }: { account: Account | null }) => {
  const [phoneId, setPhoneId] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const handlePhone = () => {
    account?.api.sendPhone(phone).then(setPhoneId);
  };

  const handleVerify = () => {
    //account?.api
  };

  if (phoneId) {
    return (
      <S.Section>
        <S.Title>Verify phone number</S.Title>
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
      <S.Title>Enter phone</S.Title>
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
