import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import { PhoneInput } from "../../uikit/PhoneInput";

export const SInput = styled(Input)``;
export const SPhoneInput = styled(PhoneInput)``;

export const Section = styled.div`
  margin: auto;
  padding: 16px;
  width: 343px;

  ${SInput}, ${SPhoneInput} {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  ${Button} {
    border-radius: 24px;
    height: 62px;
  }

  @media (max-width: 720px) {
    width: 100%;
  }
`;

export const Phone = styled.p`
  text-align: center;
`;
