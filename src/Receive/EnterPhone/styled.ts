import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";

export const Section = styled.div`
  width: 343px;
  margin: auto;

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

export const Title = styled.h2`
  margin: 0;
  font-family: "CabinetGrotesk";
  font-style: normal;
  font-weight: 900;
  font-size: 40px;
  line-height: 50px;

  text-align: center;
  font-feature-settings: "liga" off;

  color: #2c3034;
`;
