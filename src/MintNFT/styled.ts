import styled, { css, keyframes } from "styled-components";

const translateShow = keyframes`
    0% {
		transform: translateY(50px);
    }

    100% {
		transform: translateY(0);
    }
`;

const blinkAnim = keyframes`
    0% {
        opacity: 0.8;
		transform: scale(1);
    }

    50% {
        opacity: 1;
		transform: scale(1.01);
    }

    100% {
        opacity: 0.8;
		transform: scale(1);
    }
`;

const translate2Show = keyframes`
    0% {
        opacity: 0;
		transform: translateY(20px);
    }

    100% {
        opacity: 1;
		transform: translateY(0);
    }
`;

const opacityShow = keyframes`
    0% {
		opacity:0;
    }

    100% {
		opacity:1;
    }
`;

export const NFTCard = styled.div`
  position: relative;
  width: 320px;
  height: 480px;
  animation: ${translateShow} 1.5s;
  cursor: pointer;

  @media (max-width: 720px) {
    width: 280px;
    height: 440px;
  }

  @media (max-width: 480px) {
    width: 250px;
    height: 400px;
  }

  h1 {
    font-family: "CabinetGrotesk";
    font-style: normal;
    font-weight: 900;
    font-size: 40px;
    line-height: 50px;
    text-align: center;
    font-feature-settings: "liga" off;
    margin: 0;
  }

  p {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #2c3034;
    margin: 0;
  }

  img {
    position: absolute;
    bottom: 0;
    width: 60%;
    left: 50%;
    margin-left: -30%;
    user-select: none;
  }
`;

export const Content = styled.div`
  background: #f3ebea;
  border-radius: 24px;
  width: 100%;
  height: 100%;
  padding-top: 28px;
`;

export const Glow = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  z-index: -1;
  opacity: 0.5;

  background: linear-gradient(
    -45deg,
    #fdd65f 0%,
    #fca857 37.33%,
    #fc668b 70.66%,
    #c74ad5 100%
  );

  filter: blur(50px);
`;

export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  animation: ${opacityShow} 1s;
`;

export const CardContainer = styled.div`
  width: 360px;
  @media (max-width: 720px) {
    width: 100%;
  }
`;

export const Card = styled.div<{ isLoading: boolean }>`
  width: 100%;
  height: 480px;
  background: #ccc;
  border-radius: 24px;

  ${(p) =>
    p.isLoading &&
    css`
      animation: ${blinkAnim} 0.8s forwards;
    `}

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    border-radius: 24px;
    object-fit: cover;
  }

  @media (max-width: 720px) {
    height: 430px;
  }

  @media (max-width: 420px) {
    height: 380px;
  }
`;

export const Container = styled.div`
  display: flex;
  gap: 32px;
  padding: 32px;

  @media (max-width: 720px) {
    flex-direction: column;
    padding: 16px;
    gap: 0px;
  }
`;

export const Features = styled.div`
  width: 343px;
  @media (max-width: 720px) {
    width: 100%;
  }

  h1 {
    font-family: "CabinetGrotesk";
    font-style: normal;
    font-weight: 900;
    font-size: 32px;
    line-height: 40px;
    color: #2c3034;
    margin: 0;
    margin-bottom: 4px;
  }

  p {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #2c3034;
    margin: 0;
  }

  h2 {
    font-family: "CabinetGrotesk";
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 30px;
    color: #2c3034;
    margin-top: 24px;
    margin-bottom: 0;
  }
`;

export const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 16px;
  background: #ebdedc;
  border-radius: 8px;
  margin-top: 8px;

  --delay: 0s;
  opacity: 0;
  animation: ${translate2Show} 0.8s forwards;
  animation-delay: var(--delay);

  h2 {
    font-family: "CabinetGrotesk";
    font-style: normal;
    font-weight: 800;
    font-size: 24px;
    line-height: 30px;
    text-align: center;
    color: #359c2c;
    margin: 0;
  }

  p {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #2c3034;
    margin: 0;
  }
`;
