import styled from "styled-components";
import { Amount } from "../../uikit/Title";

export const Section = styled.div`
  margin: auto;
  display: flex;
  gap: 64px;

  padding: 48px;
  background: #ebdedc;
  border-radius: 24px;

  border: 1px solid #2c3034;
  box-shadow: 4px 4px 0px #2c3034;
  border-radius: 16px;

  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
  }

  @media (max-width: 720px) {
    padding: 16px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 24px;

    margin: 16px;
    text-align: center;

    ${Amount} {
      display: block;
      margin: 0 auto;
    }

    img {
      width: 100px;
      height: 100px;
    }
  }
`;

export const Card = styled.div`
  max-width: 426px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #2c3034;
    text-align: center;
  }
`;
