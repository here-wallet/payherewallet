import { Link } from "react-router-dom";
import { Button, StrokeButton } from "../uikit/Button";
import * as S from "./styled";


const Homepage = () => {
  return (
    <S.Section>
      <S.Title>
        Exchange crypto <nobr>with friends via</nobr> phone number
      </S.Title>
      <S.Buttons>
        <Link to="/send">
          <Button>Send</Button>
        </Link>
        <Link to="/receive">
          <StrokeButton>Receive</StrokeButton>
        </Link>
      </S.Buttons>
    </S.Section>
  );
};

export default Homepage;
