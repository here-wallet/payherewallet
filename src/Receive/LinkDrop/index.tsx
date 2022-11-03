import { useLocation } from "react-router-dom";
import { ReactComponent as Appstore } from "../../assets/appstore.svg";
import { LinkButton } from "../../uikit/Button";
import { Title } from "../../uikit/Title";

import * as S from "./styled";

const LinkDrop = () => {
  const location = useLocation();

  const downloadApp = async () => {
    const link = `herewallet://herewallet.app${location.pathname}${location.search}`;
    try {
      let item = new ClipboardItem({ "text/uri-list": Promise.resolve(link) });
      await navigator.clipboard.write([item]);
    } catch (e) {
      console.error(e);
    }

    window.location.href = "https://appstore.herewallet.app/phone";
  };

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
    </S.Section>
  );
};

export default LinkDrop;
