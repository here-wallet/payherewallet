import styled from "styled-components";
import { Link } from "react-router-dom";
import { PinkButton } from "../uikit/Button";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as LogoutIcon } from "../assets/icons/logout.svg";

const formatAccount = (account: string) => {
  return account.length > 12
    ? account.slice(0, 6) + "..." + account.slice(-6)
    : account;
};

export const Header = ({ account, onLogout, onLogin }: any) => {
  return (
    <SHeader>
      <Link to="/">
        <Logo />
      </Link>

      {account ? (
        <PinkButton onClick={onLogout}>
          {formatAccount(account)} <LogoutIcon />
        </PinkButton>
      ) : (
        <PinkButton onClick={onLogin}>Connect wallet</PinkButton>
      )}
    </SHeader>
  );
};

export const SHeader = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 32px 64px;

  @media (max-width: 780px) {
    padding: 16px 16px;

    a svg {
      width: 100px;
    }

    ${PinkButton} {
      height: 42px;
      border-radius: 12px;
      font-size: 1em;
    }
  }
`;
