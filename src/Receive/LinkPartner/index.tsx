import { Helmet } from "react-helmet";
import { Title } from "../../uikit/Title";

import * as S from "./styled";

const LinkPartner = () => {
  return (
    <S.Section>
      <Helmet>
        <meta
          name="apple-itunes-app"
          content="app-id=1634994703, app-clip-bundle-id=app.here.wallet.Clip, app-clip-display=card"
        />
      </Helmet>
      <Title>Secret AppClip flow</Title>
    </S.Section>
  );
};

export default LinkPartner;
