import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import UserContext from "../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { colors } from "../styles/GlobalStyle";
import { FaRegCalendarAlt } from "react-icons/fa";

const AttendanceWrapper = styled.div`
  display: flex;
  margin-left: 250px;
  margin-top: 40px;
  padding: 20px 60px 40px 60px;
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const FormCard = styled.form`
  background-color: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const InputStyled = styled.input`
  width: 90%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${colors.primary};
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${colors.tertialy};
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.2);
  }
`;

const ButtonStyled = styled.button`
  width: 99%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background-color: #f18500;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DatePickerStyled = styled(DatePicker)`
  width: 90%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #657786;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #f18500;
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.2);
  }
`;

const ReportCard = styled(FormCard)`
  width: 360px;
`;

const ReportDatePicker = styled(DatePicker)`
  width: 90%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${colors.primary};
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${colors.tertialy};
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.2);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  color: #657786;
`;

const LocationButton = styled(ButtonStyled)`
  width: 99%;
  background-color: ${colors.primary};
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 98%;
`;

const SelectStyled = styled.select`
  width: 100%;
  padding: 12px 40px 12px 12px;
  border-radius: 8px;
  border: 1px solid ${colors.primary};
  font-size: 0.95rem;
  outline: none;
  appearance: none;
  background-color: white;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${colors.tertialy};
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.2);
  }
`;

const SelectArrow = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.9rem;
  color: #657786;
`;

const DateInputWrapper = styled.div`
  position: relative;
  width: 90%;
`;

const DateIcon = styled(FaRegCalendarAlt)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #657786;
  pointer-events: none;
  font-size: 1rem;
`;

/* NEW Layout + Table styles */
const MainSection = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  width: 100%;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TableCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  padding: 25px 20px;
  overflow-x: auto;
`;

const TableTitle = styled.h2`
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  color: #333;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;

  th,
  td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    color: #374151;
    font-weight: 600;
  }

  tr:hover {
    background: #fef3e7;
  }
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
      const response = await api(`/api/attendance/employee/${user.id}`, "GET");
      setAttendanceRecords(response.data.attendance);
    } catch (error) {
      setError(error.message);
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
        (error) => setError(`Error getting location: ${error.message}`)
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
    }
  };

  if (loading) return <Loading>Loading user data...</Loading>;

  return (
    <>
      <Navbar />
      <AttendanceWrapper>
        <Sidebar />
        <Content>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <MainSection>
            {/* LEFT COLUMN */}
            <LeftColumn>
              <FormCard onSubmit={handleSubmit}>
                <FormHeader>
                  <Title>Record Attendance</Title>
                </FormHeader>

                <InputStyled
                  placeholder="Face Template"
                  value={faceTemplate}
                  onChange={(e) => setFaceTemplate(e.target.value)}
                />

                <DatePickerStyled
                  selected={entryTime ? new Date(entryTime) : null}
                  onChange={(date) =>
                    setEntryTime(date ? date.toISOString() : "")
                  }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="dd/MM/yyyy HH:mm"
                  placeholderText="Entry Time"
                />

                <InputStyled
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />

                <InputStyled
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />

                <LocationButton type="button" onClick={getLocation}>
                  Get Current Location
                </LocationButton>

                <ButtonStyled type="submit">Record Attendance</ButtonStyled>
              </FormCard>

              {user?.role === "admin" && (
                <ReportCard onSubmit={handleReportSubmit}>
                  <FormHeader>
                    <Title>Generate Employee Report</Title>
                  </FormHeader>

                  <InputStyled
                    placeholder="Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                  <SelectWrapper>
                    <SelectStyled
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="trimestrally">Trimestrally</option>
                      <option value="annually">Annually</option>
                    </SelectStyled>
                    <SelectArrow>▾</SelectArrow>
                  </SelectWrapper>

                  <ReportDatePicker
                    selected={startDate ? new Date(startDate) : null}
                    onChange={(date) =>
                      setStartDate(date ? date.toISOString().split("T")[0] : "")
                    }
                    placeholderText="Select Start Date"
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />

                  <ButtonStyled type="submit">Generate Report</ButtonStyled>
                </ReportCard>
              )}
            </LeftColumn>

            {/* RIGHT COLUMN */}
            <TableCard>
              <TableTitle>
                {user?.role === "admin" ? "All Reports" : "Attendance Records"}
              </TableTitle>

              {user?.role === "admin" ? (
                reports.length ? (
                  <StyledTable>
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Period</th>
                        <th>Start Date</th>
                        <th>Total Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...reports]
                        .sort(
                          (a, b) =>
                            new Date(b.startDate) - new Date(a.startDate)
                        )
                        .map((r, i) => (
                          <tr key={i}>
                            <td>{r.employeeId}</td>
                            <td>{r.period}</td>
                            <td>{r.startDate}</td>
                            <td>{r.totalHours}</td>
                          </tr>
                        ))}
                    </tbody>
                  </StyledTable>
                ) : (
                  <p>No reports found</p>
                )
              ) : attendanceRecords.length ? (
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Entry Time</th>
                      <th>Method</th>
                      <th>Exit Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...attendanceRecords]
                      .sort(
                        (a, b) => new Date(b.entryTime) - new Date(a.entryTime)
                      )
                      .map((a) => (
                        <tr key={a._id}>
                          <td>{new Date(a.entryTime).toLocaleString()}</td>
                          <td>{a.method}</td>
                          <td>
                            {a.exitTime
                              ? new Date(a.exitTime).toLocaleString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </StyledTable>
              ) : (
                <p>No attendance records found</p>
              )}
            </TableCard>
          </MainSection>
        </Content>
      </AttendanceWrapper>
    </>
  );
};

export default Attendance;
