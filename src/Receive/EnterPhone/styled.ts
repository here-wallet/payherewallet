import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";

export const SInput = styled(Input)``;

export const Section = styled.div`
  margin: auto;
  padding: 16px;
  width: 343px;

  ${SInput} {
    margin-top: 16px;
    margin-bottom: 32px;
  }

  ${Button} {
    border-radius: 24px;
    margin-top: 8px;
    height: 62px;
  }

  @media (max-width: 720px) {
    width: 100%;
  }
`;

export const Phone = styled.p`
  text-align: center;
`;
