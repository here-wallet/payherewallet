import styled from "styled-components";

export const Section = styled.div`
  margin: auto;
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
`;

export const Buttons = styled.div`
  display: flex;
  gap: 16px;
  margin: 56px auto;

  button {
    font-size: 1.2em;
  }
  a {
    flex: 1;
    text-decoration: none;
  }
`;
