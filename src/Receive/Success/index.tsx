import imageUrl from "../../assets/rock.png";
import Account from "../../core/Account";
import * as S from "./styled";

const ReceiveSuccess = ({ account }: { account: Account | null }) => {
  return (
    <S.Section>
      <img src={imageUrl} alt="success" />
      <S.Card>
        <h2>
          1<span>NEAR</span>
        </h2>
        <p>
          You have successfully transfered money
          <br />
          to <b>{"phone"}</b>.
          <br />
          User will receive an SMS with all the details
        </p>
        <a href={`https://explorer.near.org/?query=${""}`}>Transaction link</a>
      </S.Card>
    </S.Section>
  );
};

export default ReceiveSuccess;
