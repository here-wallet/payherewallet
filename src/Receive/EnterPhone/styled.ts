import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";

export const Section = styled.div`
  max-width: 343px;
  width: 100%;
  margin: auto;
  padding: 16px;

  ${Input} {
    margin-top: 16px;
    margin-bottom: 32px;
  }

  ${Button} {
    border-radius: 24px;
    margin-top: 8px;
    height: 62px;
  }
`;

export const Phone = styled.p`
  text-align: center;
`;
