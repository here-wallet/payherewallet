import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Account from "../../core/Account";
import { Button } from "../../uikit/Button";
import { Amount, Title } from "../../uikit/Title";
import * as S from "./styled";

const ApproveReceive = ({ account }: { account: Account | null }) => {
  const navigate = useNavigate();
  const [total, setTotal] = useState<string | null>(null);

  useEffect(() => {
    if (account?.phone == null) return;

    account
      .loadReceived(account.phone)
      .then((res) => {
        if (res == null) return navigate("/receive/success");
        setTotal(res.near);
      })
      .catch((e) => console.log(e));
  }, [account, navigate]);

  const handleApprove = () => {
    if (account?.phone == null) return;
    account
      .receiveMoney(account.phone)
      .then(navigate)
      .catch(() => alert("receiveMoney error"));
  };

  if (account?.phone == null) {
    return <Navigate to={"/receive/verify"} />;
  }

  if (total == null) {
    return <Title>Loading...</Title>;
  }

  return (
    <S.Section>
      <Amount>
        {total}
        <span>NEAR</span>
      </Amount>
      <Title>Approve receive</Title>

      <Button onClick={handleApprove}>Approve</Button>
    </S.Section>
  );
};

export default ApproveReceive;
