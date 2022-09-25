import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";

export const SInput = styled(Input)``;

export const Section = styled.div`
  width: 343px;
  margin: auto;
  padding: 16px;

  ${SInput} {
    margin-top: 16px;
  }

  ${Button} {
    margin-top: 32px;
  }

  @media (max-width: 720px) {
    width: 100%;
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

export const Scroller = styled.div`
  gap: 20px;
  display: flex;
  box-sizing: border-box;
  padding: 16px;
`;

export const Gallery = styled.div`
  width: 589px;
  margin-left: calc(-589px / 4);

  @media (max-width: 720px) {
    width: calc(100% + 32px);
    margin-left: -16px;
  }
`;

export const NftCard = styled.div<{ isSelected: boolean }>`
  width: 192px;
  padding: 16px 0;

  @media (max-width: 720px) {
    width: 100%;
    margin: 0;
  }

  div {
    width: 183px;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    margin: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    cursor: pointer;

    background: #ebdedc;
    transition: 0.2s box-shadow;
    border: 1px solid #2c3034;
    box-shadow: ${(p) =>
      p.isSelected
        ? "8px 8px 0px #2c3034, 0 0 0 4px #2c3034"
        : "8px 8px 0px #2c3034"};
    border-radius: 16px;

    img {
      user-select: none;
      width: 181px;
      height: 181px;
      -webkit-user-drag: none;
      object-fit: cover;
    }

    p {
      font-family: "Manrope";
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      color: #2c3034;
      padding: 12px;
      margin: 0;
    }
  }
`;