import styled from "styled-components";
export const Section = styled.div`
  max-width: 490px;
  width: 100%;
  margin: auto;
  padding: 16px;
`;

export const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 8px 16px 16px;
  gap: 8px;

  cursor: pointer;
  transition: 0.2s box-shadow;
  margin: 16px auto 16px;

  max-width: 354px;
  width: 100%;
  height: 72px;
  box-shadow: 0 0 0 2px #d9cdcb;
  border: none;
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

  @media (max-width: 720px) {
    text-align: left;
  }

  &:hover {
    box-shadow: 0 0 0 4px #fd84e3;
  }
`;
