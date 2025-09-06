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
  top: 10px; /* small offset from top for shadow effect */
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px); /* leave some margin on sides */
  max-width: 1200px; /* limit max width for professional look */
  z-index: 9999;
  box-sizing: border-box;

  border-radius: 12px; /* smooth rounded edges */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* soft shadow */
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); /* subtle hover effect */
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${"#FFD700"}; // you can pick a subtle highlight color
    transform: scale(1.2); // slight grow effect
  }
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
