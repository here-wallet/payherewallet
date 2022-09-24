import Account from "../../core/Account";
import { SmsRequest } from "../../core/api";
import { Title } from "../../uikit/Title";
import * as S from "./styled";

interface Props {
  account: Account | null;
  details: SmsRequest;
}

const ReviewDetails = ({ account, details }: Props) => {
  return (
    <S.Section>
      <Title>Review</Title>
      <Title>{details.amount} NEAR</Title>
      <S.Card></S.Card>
    </S.Section>
  );
};

export default ReviewDetails;
