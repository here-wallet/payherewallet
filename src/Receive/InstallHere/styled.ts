import styled from "styled-components";
export const Section = styled.div`
  max-width: 520px;
  width: 100%;
  margin: auto;
  padding: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ul {
    padding: 0 16px;
    margin: 24px 0;
  }

  li {
    margin: auto;
    width: fit-content;
    text-align: center;
  }

  @media (max-width: 620px) {
    li {
      text-align: left;
      margin: 0;
    }

    img {
      width: 120px;
    }
  }
`;

export const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 8px 16px 16px;
  gap: 8px;

  margin: 16px auto 16px;

  width: 354px;
  height: 72px;
  border: 2px solid #d9cdcb;
  border-radius: 8px;
  flex: none;
  order: 0;
  flex-grow: 0;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #2c3034;
`;
