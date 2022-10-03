import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Account from "../../core/Account";
import { showError } from "../../core/utils";
import { Button, LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const initQuery = new URLSearchParams(window.location.search);

const EnterPhone = ({ account }: { account: Account | null }) => {
  const navigate = useNavigate();

  const [isAutobind, setAutobind] = useState(false);
  const [isPhoneValid, setPhoneValid] = useState(false);
  const [phoneId, setPhoneId] = useState<number | null>(null);
  const [phone, setPhone] = useState(
    account?.phone || initQuery.get("phone") || ""
  );

  const [isLoading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handlePhoneValid = (value: string, data: any) => {
    setTimeout(() => {
      setPhoneValid(value.length === data.format.split(".").length - 1);
    }, 0);
    return true;
  };

  useEffect(() => {
    if (account == null) return;
    const query = new URLSearchParams(window.location.search);
    const phone = query.get("phone");
    const code = query.get("code");
    if (!phone || !code) return;

    const run = async () => {
      setAutobind(true);
      const phoneAccaunt = await account.checkRegistration(phone);
      if (phoneAccaunt === account.accountId) {
        account.setupPhone(phone);
        navigate("/receive/success");
        setAutobind(false);
        return;
      }

      if (phoneAccaunt) {
        showError("Phone already linked");
        setAutobind(false);
        return;
      }

      const phoneId = await account?.api.sendPhone(phone, account.accountId);
      await account.api.allocateNearAccount(code, phoneId, account.accountId);
      navigate("/receive/success");
      setAutobind(false);
    };

    run().catch(() => setAutobind(false));
  }, [account, navigate]);

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

  if (isAutobind) {
    return <Title>Loading...</Title>;
  }

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

      <S.SPhoneInput
        value={phone}
        onChange={(v) => setPhone(v)}
        isValid={handlePhoneValid}
        placeholder="Receiver phone (+1)"
        country="us"
      />

      <Button onClick={handlePhone} disabled={isLoading || !isPhoneValid}>
        {isLoading ? "Loading..." : "Continue"}
      </Button>
    </S.Section>
  );
};

export default EnterPhone;
