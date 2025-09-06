import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import UserContext from "../context/UserContext";

const AttendanceWrapper = styled.div`
  display: flex;
  margin-left: 250px;
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
  background-color: #f18500; /* #ff4500;*/
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const LocationButton = styled(Button)`
  background-color: #85929e; /* #f18500*/
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

const ReportForm = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  margin-top: 20px;
`;

const ReportList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const ReportItem = styled.li`
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  color: #657786;
`;

const Attendance = () => {
  const [faceTemplate, setFaceTemplate] = useState("");
  const [entryTime, setEntryTime] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [error, setError] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    if (user?.id && !loading && location.pathname === "/attendance") {
      if (user.role === "admin") {
        const fetchReports = async () => {
          try {
            const response = await api(
              "/api/attendance/reports?period=monthly&startDate=2025-08-01",
              "GET"
            );
            setReports(response.data.reports || []);
          } catch (error) {
            setError(error.message);
            console.error("Error fetching reports:", error);
          }
        };
        fetchReports();
      } else {
        const fetchAttendance = async () => {
          try {
            const response = await api(
              `/api/attendance/employee/${user.id}`,
              "GET"
            );
            setAttendanceRecords(response.data.attendance || []);
          } catch (error) {
            setError(error.message);
            console.error("Error fetching attendance:", error);
          }
        };
        fetchAttendance();
      }
    }
  }, [user, loading, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      const response = await api(`/api/attendance/employee/${user.id}`, "GET");
      setAttendanceRecords(response.data.attendance);
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude.toString());
          setLatitude(position.coords.latitude.toString());
          setError("");
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

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") {
      setError("Only admins can generate reports");
      return;
    }
    try {
      const response = await api(
        `/api/attendance/report/${employeeId}?period=${period}&startDate=${startDate}`,
        "GET"
      );
      setReports([response.data.report, ...reports]);
      setEmployeeId("");
      setPeriod("weekly");
      setStartDate("");
    } catch (error) {
      setError(error.message);
      console.error("Error generating report:", error);
    }
  };

  if (loading) return <Loading>Loading user data...</Loading>;

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

          {user?.role === "admin" && (
            <ReportForm onSubmit={handleReportSubmit}>
              <h2>Generate Employee Report</h2>
              <Input
                type="text"
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Period (weekly/monthly)"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Button type="submit">Generate Report</Button>
            </ReportForm>
          )}

          <h2>
            {user?.role === "admin" ? "All Reports" : "Attendance Records"}
          </h2>
          {user?.role === "admin" ? (
            reports.length > 0 ? (
              <ReportList>
                {reports.map((report, index) => (
                  <ReportItem key={index}>
                    Employee ID: {report.employeeId}, Period: {report.period},
                    Start Date: {report.startDate}, Total Hours:{" "}
                    {report.totalHours}
                  </ReportItem>
                ))}
              </ReportList>
            ) : (
              <p>No reports found.</p>
            )
          ) : attendanceRecords.length > 0 ? (
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
