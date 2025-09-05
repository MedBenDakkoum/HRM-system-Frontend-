import React from "react";
import styled from "styled-components";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";

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
      <Logo>FLESK HR</Logo>
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
