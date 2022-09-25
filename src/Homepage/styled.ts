import styled from "styled-components";

export const Section = styled.div`
  margin: auto;
  max-width: 800px;

  @media (max-width: 780px) {
    padding: 16px;
  }
`;

export const Title = styled.h1`
  font-family: "CabinetGrotesk";
  font-style: normal;
  font-weight: 900;
  font-size: 64px;
  line-height: 79px;
  text-align: center;
  color: #2c3034;
  margin: 0;

  @media (max-width: 780px) {
    font-size: 42px;
    line-height: 48px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    line-height: 38px;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 16px;
  margin: 56px auto 0;

  button {
    font-size: 1.2em;
  }

  a {
    flex: 1;
    text-decoration: none;
  }

  @media (max-width: 780px) {
    flex-direction: column;

    button {
      height: 52px;
      font-size: 1em;
    }
  }
`;
