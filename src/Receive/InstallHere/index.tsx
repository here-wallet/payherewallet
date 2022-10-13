import { Navigate } from "react-router-dom";
import { useWallet } from "../../core/useWallet";
import { Title } from "../../uikit/Title";
import qrUrl from "./qr.svg";
import * as S from "./styled";

const InstallHere = () => {
  const app = useWallet();

  if (app?.account) {
    return <Navigate to={`/receive/verify${window.location.search}`} />;
  }

  return (
    <S.Section>
      <Title>Install the app to continue</Title>
      <ul>
        <li>Install the app</li>
        <li>Create an account </li>
        <li>Press “Connect wallet” in the top-right corner</li>
      </ul>

      <img src={qrUrl} alt="qrcode" />
    </S.Section>
  );
};

export default InstallHere;
