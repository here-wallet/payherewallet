import styled from "styled-components";
import { Button } from "../../uikit/Button";
import { Input } from "../../uikit/Input";
import { PhoneInput } from "../../uikit/PhoneInput";

export const SInput = styled(Input)``;

export const SPhoneInput = styled(PhoneInput)``;

export const Section = styled.div`
  width: 343px;
  margin: auto;
  padding: 16px;

  ${SInput}, ${SPhoneInput} {
    margin-top: 16px;
  }

  ${Button} {
    margin-top: 16px;
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
  width: 100%;
  position: relative;

  @media (max-width: 720px) {
    margin-left: -16px;
    width: calc(100% + 32px);
  }

  &::before {
    content: "";
    display: block;
    width: 60px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(90deg, #f2ebe9, transparent);
    z-index: 50;
  }

  &::after {
    content: "";
    display: block;
    width: 60px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(-90deg, #f2ebe9, transparent);
  }
`;

export const NftCard = styled.div`
  width: 100%;
  padding: 16px 0;

  @media (max-width: 720px) {
    width: 100%;
    margin: 0;
  }

  div {
    width: 183px;
    height: 250px;
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
    box-shadow: 8px 8px 0px #2c3034;
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

export const Badge = styled.div`
  border-radius: 16px;
  text-align: center;
  background: #ebdedc;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #2c3034;
  margin: 0;
`;

export const PickerMenu = styled.div`
  position: absolute;
  right: -8px;
  z-index: 10000;
  top: 26px;
`;

export const PickerWrapper = styled.div`
  position: relative;
  border: 1px solid #2c3034;
  border-radius: 12px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 12px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(0, #ebdedc, transparent);
    pointer-events: none;
  }
`;

export const PickerList = styled.div`
  background: #ebdedc;
  padding: 4px 0;
  border-radius: 12px;

  text-align: center;
  color: #000;

  height: 200px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Option = styled.div`
  padding: 4px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s background-color;
  gap: 8px;

  img {
    object-fit: contain;
    border-radius: 50%;
  }

  &:hover {
    background-color: #f4ebea;
  }

  &:last-child {
    margin-bottom: 18px;
  }
`;

export const Token = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  svg {
    margin-left: 4px;
  }
`;

export const CurrencyLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: -14px;
  font-size: 16px;
  color: #646464;
  padding: 0 13px;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 500;
  color: #6b6661;

  span {
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:last-child {
    width: 70%;
    text-align: right;
  }
`;

export const LeftButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  transition: 0.2s transform;

  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -8px;
  transform: rotate(90deg);
  z-index: 1000;

  &:hover {
    transform: rotate(90deg) scale(1.2);
  }
`;

export const RightButton = styled(LeftButton)`
  right: 0;
  left: initial;
  transform: rotate(-90deg);

  &:hover {
    transform: rotate(-90deg) scale(1.2);
  }
`;
