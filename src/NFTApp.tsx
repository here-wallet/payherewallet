import styled from "styled-components";
import MintNFT from "./MintNFT";

const NFTApp = () => {
  return (
    <Container>
      <MintNFT />
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100vw;

  min-height: calc(var(--vh, 1vh) * 100);
`;

export default NFTApp;
