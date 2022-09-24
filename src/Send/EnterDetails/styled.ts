import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";

export const Section = styled.div`
  max-width: 343px;
  margin: auto;
  padding: 16px;

  ${Input} {
    margin-top: 16px;
  }

  ${Button} {
    margin-top: 32px;
  }
`;

export const Tabs = styled.div`
  background: #ebdedc;
  border-radius: 16px;
  height: 32px;
  display: flex;
  margin: 16px 0;
`;

export const Tab = styled.div<{ isSelected?: boolean }>`
  background: ${(p) => (p.isSelected ? "#2c3034" : "#ebdedc")};
  color: ${(p) => (p.isSelected ? "#fff" : "#2c3034")};
  border-radius: 16px;
  height: 32px;
  flex: 1;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
`;