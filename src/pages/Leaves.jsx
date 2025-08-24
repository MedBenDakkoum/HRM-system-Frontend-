import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";

const LeavesWrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Form = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #657786;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  background-color: #ff4500;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Leaves = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/api/leaves", "POST", {
        employeeId,
        startDate,
        endDate,
        reason,
      });
      console.log("Leave requested");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <LeavesWrapper>
        <Sidebar />
        <Content>
          <h1>Leaves</h1>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Start Date (ISO)"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="text"
              placeholder="End Date (ISO)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Button type="submit">Request Leave</Button>
          </Form>
        </Content>
      </LeavesWrapper>
    </>
  );
};

export default Leaves;
