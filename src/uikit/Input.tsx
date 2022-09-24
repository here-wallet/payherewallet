import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  background: #ebdedc;
  box-sizing: border-box;
  height: 56px;
  outline: none;

  border: 1px solid #2c3034;
  border-radius: 16px;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #2c3034;

  padding: 0 16px;
  /* transform: translate(-4px, -4px); */

  border: 1px solid #2c3034;
  box-shadow: 4px 4px 0px #2c3034;
  border-radius: 16px;
  transition: 0.2s box-shadow, 0.2s transform;

  /* &:hover {
    box-shadow: 0 0 0 #2c3034;
    transform: translate(0, 0);
  } */
`;
