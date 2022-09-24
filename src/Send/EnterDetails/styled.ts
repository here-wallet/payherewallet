import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";

export const Section = styled.div`
  width: 343px;
  margin: auto;

  ${Input} {
    margin-top: 16px;
  }

  ${Button} {
    margin-top: 32px;
  }
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

export const Tabs = styled.div`
  background: #ebdedc;
  border-radius: 16px;
  height: 32px;
  display: flex;
  margin: 16px 0;

  a {
    flex: 1;
    height: 32px;
    text-decoration: none;
  }
`;

export const Tab = styled.div<{ isSelected?: boolean }>`
  background: ${(p) => (p.isSelected ? "#2c3034" : "#ebdedc")};
  color: ${(p) => (p.isSelected ? "#fff" : "#2c3034")};
  border-radius: 16px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
`;