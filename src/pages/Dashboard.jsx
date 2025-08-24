import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardWrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <DashboardWrapper>
        <Sidebar />
        <Content>
          <h1>Welcome to FLESK HR Dashboard</h1>
          <p>Use the sidebar to navigate.</p>
        </Content>
      </DashboardWrapper>
    </>
  );
};

export default Dashboard;
