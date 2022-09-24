import { Navigate, useNavigate } from "react-router-dom";
import Account from "../../core/Account";
import { useWallet } from "../../core/useWallet";
import { Title } from "../../uikit/Title";
import { ReactComponent as HereIcon } from "./here.svg";
import { ReactComponent as NearIcon } from "./near.svg";

import * as S from "./styled";

interface Props {
  account: Account | null;
  onLogin: () => void;
}

const Connect = ({ account, onLogin }: Props) => {
  const navigate = useNavigate();
  const app = useWallet();

  if (app?.account) {
    return <Navigate to="/receive/verify" />;
  }

  return (
    <S.Section>
      <Title>
        Select a way to receive <br /> 10.12 NEAR
      </Title>
      <S.Button onClick={() => navigate("/receive/here")}>
        <HereIcon />
        Create new HERE Wallet account
      </S.Button>
      <S.Button onClick={onLogin}>
        <NearIcon />
        Link existing wallet account
      </S.Button>
    </S.Section>
  );
};

export default Connect;
