import React, { useContext } from "react";
import styled from "styled-components";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

// Fixed Navbar wrapper
const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.primary};
  padding: 10px 30px;
  height: 52px; /* explicit navbar height */
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  box-sizing: border-box;
`;

// Spacer to prevent content from hiding behind navbar
export const NavbarSpacer = styled.div`
  height: 60px; /* match navbar height */
`;

// Logo image
const Logo = styled.img`
  height: 40px; /* adjust height as needed */
  object-fit: contain;
`;

// Icons container
const Icons = styled.div`
  display: flex;
  gap: 15px;
`;

// Each icon
const Icon = styled.div`
  cursor: pointer;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await api("/api/employees/logout", "POST");
      clearUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <NavbarWrapper>
      <Logo src="/flesk-logo.png" alt="FLESK HR Logo" />
      <Icons>
        <Icon>
          <FaBell />
        </Icon>
        <Icon>
          <FaUserCircle />
        </Icon>
        <Icon onClick={handleLogout}>
          <FaSignOutAlt />
        </Icon>
      </Icons>
    </NavbarWrapper>
  );
};

export default Navbar;
