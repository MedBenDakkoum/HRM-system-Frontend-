import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";

const AttendanceWrapper = styled.div`
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
  background-color: #f18500;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Attendance = () => {
  const [faceTemplate, setFaceTemplate] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      await api("/api/attendance/facial", "POST", {
        faceTemplate,
        entryTime,
        location: {
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      });
      console.log("Attendance recorded");
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <AttendanceWrapper>
        <Sidebar />
        <Content>
          <h1>Attendance</h1>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Face Template"
              value={faceTemplate}
              onChange={(e) => setFaceTemplate(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Entry Time (ISO)"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <Button type="submit">Record Facial Attendance</Button>
          </Form>
        </Content>
      </AttendanceWrapper>
    </>
  );
};

export default Attendance;
