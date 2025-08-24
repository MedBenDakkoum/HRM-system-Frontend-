import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";
import { colors } from "../styles/GlobalStyle";

const SidebarWrapper = styled.div`
  width: 250px;
  background-color: white;
  padding: 20px;
  border-right: 1px solid ${colors.secondary};
  height: 100vh;
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  color: ${colors.text};
  text-decoration: none;
  &:hover {
    background-color: ${colors.background};
  }
`;

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <SidebarLink to="/dashboard">
        <FaHome /> Dashboard
      </SidebarLink>
      <SidebarLink to="/attendance">
        <FaCalendarCheck /> Attendance
      </SidebarLink>
      <SidebarLink to="/documents">
        <FaFileAlt /> Documents
      </SidebarLink>
      <SidebarLink to="/leaves">
        <FaClipboardList /> Leaves
      </SidebarLink>
    </SidebarWrapper>
  );
};

export default Sidebar;
