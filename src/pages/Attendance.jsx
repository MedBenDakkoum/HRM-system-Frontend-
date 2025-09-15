import React, { useState, useEffect, useRef, useContext } from "react";
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
import * as faceapi from "face-api.js";

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

const VideoContainer = styled.div`
  position: relative;
  width: 90%;
  margin-bottom: 10px;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

const Video = styled.video`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${colors.primary};
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
`;

const ButtonStyled = styled.button`
  width: 99%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background-color: ${(props) => (props.$stop ? "#dc3545" : "#f18500")};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background-color: #ff4500; /*#ccc */
    cursor: not-allowed;
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

const Alert = styled.div`
  padding: 10px 15px;
  border-radius: 5px;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
  background-color: ${(props) =>
    props.type === "success" ? "#d4edda" : "#f8d7da"};
  color: ${(props) => (props.type === "success" ? "#155724" : "#721c24")};
  border: 1px solid
    ${(props) => (props.type === "success" ? "#c3e6cb" : "#f5c6cb")};
  display: ${(props) => (props.show ? "block" : "none")};
`;

const Attendance = () => {
  const [entryTime, setEntryTime] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [method, setMethod] = useState("manual");
  const { user, loading } = useContext(UserContext);
  const location = useLocation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

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
            console.error("Fetch reports failed:", error);
            setMessage({
              text: "Failed to fetch reports. Try again.",
              type: "error",
            });
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
            console.error("Failed to fetch attendance records", error);
            setMessage({
              text: "Failed to fetch attendance records. Try again.",
              type: "error",
            });
          }
        };
        fetchAttendance();
      }
    }
  }, [user, loading, location]);

  useEffect(() => {
    const loadModels = async () => {
      console.log("Loading face-api.js models from CDN...");
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(
          "https://justadudewhohacks.github.io/face-api.js/models"
        );
        await faceapi.nets.faceLandmark68Net.loadFromUri(
          "https://justadudewhohacks.github.io/face-api.js/models"
        );
        await faceapi.nets.faceRecognitionNet.loadFromUri(
          "https://justadudewhohacks.github.io/face-api.js/models"
        );
        console.log("Models loaded successfully from CDN");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models from CDN:", error.message);
        setMessage({
          text: "Failed to load face detection models. Refresh page.",
          type: "error",
        });
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setShowCamera(false);
      }
    };
  }, [stream]);

  const startCamera = async () => {
    console.log("Starting camera...");
    if (method === "facial" && !stream) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
        setShowCamera(true);
        console.log("Camera started successfully");
      } catch (error) {
        console.error("Camera error:", error.message);
        setMessage({
          text: "Error accessing camera. Check permissions.",
          type: "error",
        });
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
          setShowCamera(false);
        }
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
      setShowCamera(false);
      console.log("Camera stopped");
    }
  };

  const drawFaceBox = async () => {
    if (!videoRef.current || !canvasRef.current || !showCamera) return;
    const canvas = canvasRef.current;
    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.8 })
      )
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    resizedDetections.forEach((detection) => {
      const box = detection.detection.box;
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = detection.detection.score > 0.8 ? "green" : "red";
      context.rect(box.x, box.y, box.width, box.height);
      context.stroke();
      context.fillStyle = detection.detection.score > 0.8 ? "green" : "red";
      context.font = "16px Arial";
      context.fillText(
        `Score: ${detection.detection.score.toFixed(2)}`,
        box.x,
        box.y - 10
      );
    });

    if (showCamera) {
      requestAnimationFrame(drawFaceBox);
    }
  };

  useEffect(() => {
    if (showCamera && modelsLoaded) {
      drawFaceBox();
    }
  }, [showCamera, modelsLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle submit triggered, method:", method);
    setMessage({ text: "", type: "" });
    if (!user?.id) {
      setMessage({
        text: "User not authenticated. Please log in.",
        type: "error",
      });
      stopCamera();
      return;
    }

    if (method === "facial") {
      if (!modelsLoaded) {
        setMessage({
          text: "Face detection models are still loading. Please wait.",
          type: "error",
        });
        stopCamera();
        return;
      }
      if (!showCamera) await startCamera();
      await new Promise((resolve) => {
        const checkVideo = setInterval(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            clearInterval(checkVideo);
            resolve();
          }
        }, 100);
      });
      await new Promise((resolve) => requestAnimationFrame(resolve));

      try {
        console.log("Attempting face detection...");
        let bestDetection = null;
        let maxScore = 0;
        const maxAttempts = 5;
        for (let i = 0; i < maxAttempts; i++) {
          const detections = await faceapi
            .detectAllFaces(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.8 })
            )
            .withFaceLandmarks()
            .withFaceDescriptors();
          console.log(
            `Detection attempt ${i + 1}, detections:`,
            detections.length
          );
          if (
            detections.length > 0 &&
            detections[0].detection.score > maxScore
          ) {
            bestDetection = detections[0];
            maxScore = detections[0].detection.score;
          }
          if (maxScore > 0.9) break;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (!bestDetection || maxScore < 0.8) {
          setMessage({
            text: "No reliable face detected. Ensure good lighting, face the camera directly, or re-register in Profile.",
            type: "error",
          });
          stopCamera();
          return;
        }

        const faceTemplate = Array.from(bestDetection.descriptor);
        console.log("Best face template selected:", faceTemplate);

        await api("/api/attendance/facial", "POST", {
          employeeId: user.id,
          faceTemplate,
          entryTime,
          location: {
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        });
        console.log("API request successful");

        const response = await api(
          `/api/attendance/employee/${user.id}`,
          "GET"
        );
        setAttendanceRecords(response.data.attendance);
        setMessage({
          text: "Facial attendance recorded successfully.",
          type: "success",
        });
        stopCamera();
      } catch (error) {
        console.error("Error in face detection or API:", error.message);
        setMessage({
          text:
            error.response?.data?.message ||
            "Failed to record attendance. Ensure good lighting, face the camera directly, or re-register in Profile.",
          type: "error",
        });
        stopCamera();
      }
    } else if (method === "manual" || method === "qr") {
      try {
        console.log("Submitting manual/QR attendance...");
        await api("/api/attendance", "POST", {
          employeeId: user.id,
          entryTime,
          location: {
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          method,
        });
        const response = await api(
          `/api/attendance/employee/${user.id}`,
          "GET"
        );
        setAttendanceRecords(response.data.attendance);
        setMessage({
          text: `${
            method.charAt(0).toUpperCase() + method.slice(1)
          } attendance recorded successfully.`,
          type: "success",
        });
        stopCamera();
      } catch (error) {
        console.error("Error in manual/QR submission:", error.message);
        setMessage({
          text:
            error.response?.data?.message ||
            "Failed to record attendance. Please try again.",
          type: "error",
        });
        stopCamera();
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude.toString());
          setLatitude(position.coords.latitude.toString());
          setMessage({
            text: "Location retrieved successfully.",
            type: "success",
          });
        },
        (error) =>
          setMessage({
            text: `Error getting location: ${error.message}`,
            type: "error",
          })
      );
    } else {
      setMessage({
        text: "Geolocation is not supported by this browser.",
        type: "error",
      });
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    if (user?.role !== "admin") {
      setMessage({ text: "Only admins can generate reports.", type: "error" });
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
      setMessage({ text: "Report generated successfully.", type: "success" });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "Failed to generate report. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) return <Loading>Loading user data...</Loading>;

  return (
    <>
      <Navbar />
      <AttendanceWrapper>
        <Sidebar />
        <Content>
          <MainSection>
            <LeftColumn>
              <FormCard onSubmit={handleSubmit}>
                <FormHeader>
                  <Title>Record Attendance</Title>
                </FormHeader>

                <SelectWrapper>
                  <SelectStyled
                    value={method}
                    onChange={(e) => {
                      setMethod(e.target.value);
                      if (e.target.value !== "facial") stopCamera();
                    }}
                  >
                    <option value="manual">Manual</option>
                    <option value="facial">Facial</option>
                    <option value="qr">QR Code</option>
                  </SelectStyled>
                  <SelectArrow>▾</SelectArrow>
                </SelectWrapper>

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

                <VideoContainer $show={showCamera}>
                  <Video ref={videoRef} autoPlay muted />
                  <Canvas ref={canvasRef} />
                </VideoContainer>

                <Alert show={!!message.text} type={message.type}>
                  {message.text}
                </Alert>

                <LocationButton type="button" onClick={getLocation}>
                  Get Current Location
                </LocationButton>

                <ButtonStyled
                  type="submit"
                  disabled={!entryTime || !longitude || !latitude}
                >
                  Record Attendance
                </ButtonStyled>

                {showCamera && (
                  <ButtonStyled
                    type="button"
                    $stop
                    onClick={stopCamera}
                    disabled={!showCamera}
                  >
                    Stop Camera
                  </ButtonStyled>
                )}
              </FormCard>

              {user?.role === "admin" && (
                <ReportCard onSubmit={handleReportSubmit}>
                  <FormHeader>
                    <Title>Generate Employee Report</Title>
                  </FormHeader>
                  <Alert show={!!message.text} type={message.type}>
                    {message.text}
                  </Alert>
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
