import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";

const DocumentsWrapper = styled.div`
  display: flex;
  margin-left: 250px; /* Space for sidebar */
  min-height: 100vh; /* Ensure full viewport height */
  padding: 0px 60px 40px 60px;
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

const Documents = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [legalInfo, setLegalInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/api/documents/attestation", "POST", {
        employeeId,
        legalInfo,
      });
      console.log("Attestation generated");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <DocumentsWrapper>
        <Sidebar />
        <Content>
          <h1>Documents</h1>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Legal Info"
              value={legalInfo}
              onChange={(e) => setLegalInfo(e.target.value)}
            />
            <Button type="submit">Generate Attestation</Button>
          </Form>
        </Content>
      </DocumentsWrapper>
    </>
  );
};

export default Documents;
