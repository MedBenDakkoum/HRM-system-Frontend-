import React from "react";
import styled from "styled-components";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.primary};
  padding: 10px 20px;
  color: white;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Icons = styled.div`
  display: flex;
  gap: 15px;
`;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <Logo>FLESK HR</Logo>
      <Icons>
        <FaBell />
        <FaUserCircle />
      </Icons>
    </NavbarWrapper>
  );
};

export default Navbar;
