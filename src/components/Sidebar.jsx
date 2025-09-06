import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";

const SidebarWrapper = styled.div`
  position: fixed; /* Keep it fixed on the left */
  top: 52px;
  left: 0;
  width: 250px;
  height: 100vh; /* Full viewport height */
  background-color: white;
  padding: 20px;
  border-right: 1px solid ${colors.secondary};
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Scroll internally if items overflow */
  z-index: 1000; /* Make sure it stays above content */
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
    </SidebarWrapper>
  );
};

export default Sidebar;
