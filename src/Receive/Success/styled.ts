import styled from "styled-components";

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
  }
`;

export const Card = styled.div`
  width: 426px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h2 {
    display: flex;
    align-items: flex-end;

    font-family: "CabinetGrotesk";
    font-style: normal;
    font-weight: 900;
    font-size: 64px;
    line-height: 79px;
    color: #2c3034;
    margin: 0;

    span {
      margin-left: 8px;
      line-height: 62px;
      font-size: 32px;
    }
  }

  p {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #2c3034;
  }
`;
