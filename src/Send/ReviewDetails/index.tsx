import Account from "../../core/Account";
import { SmsRequest } from "../../core/api";
import * as S from "./styled";

interface Props {
  account: Account | null;
  details: SmsRequest;
}

const ReviewDetails = ({ account, details }: Props) => {
  return (
    <S.Section>
      <S.Title>Review</S.Title>
      <S.Title>{details.amount} NEAR</S.Title>
      <S.Card></S.Card>
    </S.Section>
  );
};

export default ReviewDetails;
