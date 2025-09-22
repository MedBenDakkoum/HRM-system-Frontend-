import React, { useContext } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";
import { COLORS } from "../utils/constants";
import UserContext from "../context/UserContext";

const SidebarWrapper = styled.div`
  position: fixed;
  top: 82px; /* start right below navbar height */
  left: 10px;
  width: 200px;
  height: calc(100vh - 52px); /* full height minus navbar */
  background-color: white;
  padding: 20px;
  border-right: 1px solid ${colors.secondary};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 999; /* below navbar */

  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  transition: all 0.3s ease;

  /* Smooth scroll */
  scroll-behavior: smooth;

  /* Thin scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  color: ${colors.text};
  text-decoration: none;
  border-radius: 5px;

  &.active {
    background-color: ${colors.background};
    color: ${COLORS.primary};
    font-weight: bold;
  }

  &:hover {
    background-color: ${colors.background};
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const { user, loading } = useContext(UserContext);

  const commonLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { to: "/documents", label: "Documents", icon: <FaFileAlt /> },
    { to: "/leaves", label: "Leaves", icon: <FaClipboardList /> },
  ];

  // Conditional profile/employees link based on user role
  const getProfileLink = () => {
    if (loading) {
      return null; // Don't render until user context is loaded
    }

    if (!user) {
      // No user (unauthenticated), show nothing
      return null;
    }

    // Same route (/profile) but different label and icon based on role
    const isActive = location.pathname === "/profile";
    const label = user.role === "admin" ? "Employees" : "Profile";
    const icon = user.role === "admin" ? <FaUsers /> : <FaUser />;

    return (
      <SidebarLink to="/profile" className={isActive ? "active" : ""}>
        {icon} {label}
      </SidebarLink>
    );
  };

  return (
    <SidebarWrapper>
      {commonLinks.map((link) => (
        <SidebarLink
          key={link.to}
          to={link.to}
          className={location.pathname === link.to ? "active" : ""}
        >
          {link.icon} {link.label}
        </SidebarLink>
      ))}

      {/* Conditional Profile/Employees link */}
      {getProfileLink()}
    </SidebarWrapper>
  );
};

export default Sidebar;
