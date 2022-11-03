import { Navigate, useNavigate } from "react-router-dom";
import Account from "../../core/Account";
import { useWallet } from "../../core/useWallet";
import { LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";
import { ReactComponent as HereIcon } from "./here.svg";
import { ReactComponent as NearIcon } from "./near.svg";
import { ReactComponent as Appstore } from "../../assets/appstore.svg";

import * as S from "./styled";
import { isAutobindQuery } from "../EnterPhone";

interface Props {
  account: Account | null;
  onLogin: () => void;
}

export const isIOS = () => {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

const getLinkPhoneQuery = () => {
  const query = new URLSearchParams(window.location.search);
  const phone_id = query.get("phone_id") ?? "";
  const phone = query.get("phone") ?? "";
  const code = query.get("code") ?? "";
  return new URLSearchParams({ phone_id, phone, code });
};

const Connect = ({ onLogin }: Props) => {
  const navigate = useNavigate();
  const app = useWallet();

  const useIOSFlow = isIOS() && isAutobindQuery();

  const downloadApp = async () => {
    const link = `herewallet://hereapp.com/link_phone?${getLinkPhoneQuery()}`;
    try {
      let item = new ClipboardItem({ "text/uri-list": Promise.resolve(link) });
      await navigator.clipboard.write([item]);
    } catch (e) {
      console.error(e);
    }

    window.location.href = "https://appstore.herewallet.app/phone";
  };

  if (app?.account && useIOSFlow === false) {
    return <Navigate to={`/receive/verify${window.location.search}`} />;
  }

  if (useIOSFlow) {
    return (
      <S.Section>
        <Title>Receive your money</Title>
        <br />

        <p style={{ fontWeight: 500, textAlign: "center" }}>
          Download the app from the AppStore, <br />
          create your wallet and come back for your money 🔥
        </p>

        <LinkButton
          onClick={() => downloadApp()}
          style={{ display: "block", margin: "auto", width: "fit-content" }}
        >
          <Appstore style={{ width: 220, height: 100 }} />
        </LinkButton>

        <br />

        {app?.account ? (
          <LinkButton
            style={{ margin: "auto", display: "block" }}
            onClick={() => navigate(`/receive/verify${window.location.search}`)}
          >
            or receive money through this website
          </LinkButton>
        ) : (
          <LinkButton
            style={{ margin: "auto", display: "block" }}
            onClick={onLogin}
          >
            Link existing wallet account
          </LinkButton>
        )}
      </S.Section>
    );
  }

  return (
    <S.Section>
      <Title>
        Select a way to receive <br />
      </Title>
      <S.Button
        onClick={() => navigate(`/receive/here${window.location.search}`)}
      >
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
