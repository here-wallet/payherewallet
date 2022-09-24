import { Navigate, useNavigate } from "react-router-dom";
import imageUrl from "../../assets/rock.png";
import Account from "../../core/Account";
import { showError } from "../../core/utils";
import { LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

const ReceiveSuccess = ({ account }: { account: Account | null }) => {
  const navigate = useNavigate();
  const handleUnlink = () => {
    if (account?.phone == null) return;
    account
      .unlinkPhone(account.phone)
      .then(navigate)
      .catch(() => showError("unlinkPhone error"));
  };

  if (account?.phone == null) {
    return <Navigate to="/" />;
  }

  return (
    <S.Section>
      <img src={imageUrl} alt="success" />

      <Title>
        Your phone is linked
        <br />
        to near account
      </Title>

      <p>
        Now all transfers will immediately
        <br /> be sent to your account
      </p>

      <LinkButton onClick={handleUnlink}>Unlink phone</LinkButton>
    </S.Section>
  );
};

export default ReceiveSuccess;
