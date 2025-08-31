import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import UserContext from "../context/UserContext";

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
  margin-bottom: 20px;
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
  margin-bottom: 10px;
`;

const LocationButton = styled(Button)`
  background-color: #1d9bf0;
`;

const AttendanceList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AttendanceItem = styled.li`
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Attendance = () => {
  const [faceTemplate, setFaceTemplate] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [error, setError] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const { user } = useContext(UserContext);

  // Fetch attendance records when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      const fetchAttendance = async () => {
        try {
          const response = await api(
            `/api/attendance/employee/${user.id}`,
            "GET"
          );
          setAttendanceRecords(response.data.attendance);
        } catch (error) {
          setError(error.message);
          console.error("Error fetching attendance:", error);
        }
      };
      fetchAttendance();
    } else {
      setAttendanceRecords([]); // Clear records if user is not authenticated
    }
  }, [user]); // Re-run when user changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }
    try {
      await api("/api/attendance/facial", "POST", {
        faceTemplate,
        entryTime,
        location: {
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      });
      console.log("Attendance recorded");
      // Refresh attendance list after successful recording
      const response = await api(`/api/attendance/employee/${user.id}`, "GET");
      setAttendanceRecords(response.data.attendance);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  // Get current geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude.toString());
          setLatitude(position.coords.latitude.toString());
          setError(""); // Clear any previous error
        },
        (error) => {
          setError(`Error getting location: ${error.message}`);
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
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
            <LocationButton type="button" onClick={getLocation}>
              Get Current Location
            </LocationButton>
            <Button type="submit">Record Facial Attendance</Button>
          </Form>
          <h2>Attendance Records</h2>
          {attendanceRecords.length > 0 ? (
            <AttendanceList>
              {attendanceRecords.map((record) => (
                <AttendanceItem key={record._id}>
                  {new Date(record.entryTime).toLocaleString()} - Method:{" "}
                  {record.method}
                  {record.exitTime &&
                    ` - Exit: ${new Date(record.exitTime).toLocaleString()}`}
                </AttendanceItem>
              ))}
            </AttendanceList>
          ) : (
            <p>No attendance records found.</p>
          )}
        </Content>
      </AttendanceWrapper>
    </>
  );
};

export default Attendance;
