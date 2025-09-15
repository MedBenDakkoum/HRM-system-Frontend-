import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";
import { COLORS } from "../utils/constants";

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

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/attendance", label: "Attendance", icon: <FaCalendarCheck /> },
    { to: "/documents", label: "Documents", icon: <FaFileAlt /> },
    { to: "/leaves", label: "Leaves", icon: <FaClipboardList /> },
  ];

  return (
    <SidebarWrapper>
      {links.map((link) => (
        <SidebarLink
          key={link.to}
          to={link.to}
          className={location.pathname === link.to ? "active" : ""}
        >
          {link.icon} {link.label}
        </SidebarLink>
      ))}
      {/* Profile link only for authenticated non-admin users */}
      {location.pathname !== "/" && (
        <SidebarLink
          to="/profile"
          className={location.pathname === "/profile" ? "active" : ""}
        >
          <FaUser /> Profile
        </SidebarLink>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;
