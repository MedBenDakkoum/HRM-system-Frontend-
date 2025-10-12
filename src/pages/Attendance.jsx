import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
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
import Popup from "../components/Popup";
import Loading from "../components/Loading";
import QrScanner from "qr-scanner";

const AttendanceWrapper = styled.div`
  display: flex;
  margin-left: 200px;
  margin-top: 40px;
  padding: 20px 60px 40px 60px;
  min-height: calc(100vh - 70px);
  background: #f5f7fa;

  @media (max-width: 1024px) {
    margin-left: 200px;
    padding: 20px 40px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 20px;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  @media (max-width: 480px) {
    margin-top: 10px;
    padding: 15px;
  }
`;

/* Content */
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
  }
`;

/* Card Form */
const FormCard = styled.form`
  background-color: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  width: 390px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  /* 🔽 Ensures all form elements take full width */
  input,
  select,
  .react-datepicker-wrapper {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 24px 18px;
    width: 100%;
    max-width: 100%;
  }
`;

/* Header */
const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

/* Title */
const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

/* Video */
const VideoContainer = styled.div`
  position: relative;
  width: 90%;
  margin-bottom: 10px;
  display: ${(props) => (props.$show ? "block" : "none")};

  @media (max-width: 480px) {
    width: 100%;
  }
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

/* Buttons */
const ButtonStyled = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background-color: #ff4500;
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 6px 12px rgba(0, 0, 0, 0.1)"};
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 10px;
  }
`;

/* DatePicker */
const DatePickerStyled = styled(DatePicker)`
  width: 100%;
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

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ReportCard = styled(FormCard)`
  /* width: 400px; */

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    align-self: center;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    align-self: center;
  }
`;

const ReportDatePicker = styled(DatePicker)`
  width: 100%;
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

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

/* Location button */
const LocationButton = styled(ButtonStyled)`
  width: 100%;
  background-color: ${colors.primary};
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

/* ATT button */
const AttButton = styled(ButtonStyled)`
  width: 100%;
  background-color: #ff4500;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

/* Select */
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
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

  @media (max-width: 480px) {
    font-size: 0.9rem;
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

/* Input and Date Icons */
const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const DateIcon = styled(FaRegCalendarAlt)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #657786;
  pointer-events: none;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const InputStyled = styled.input`
  width: 100%;
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

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

/* Layouts */
const MainSection = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 1024px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    align-items: center;
  }
`;

const TableCard = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  padding: 25px 20px;
  overflow-x: auto;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
    width: 100%;
    max-width: 100%;
    align-self: center;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
    width: 100%;
    max-width: 100%;
    align-self: center;
  }
`;

const TableTitle = styled.h2`
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
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

  @media (max-width: 768px) {
    font-size: 0.9rem;

    th,
    td {
      padding: 10px 8px;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;

    th,
    td {
      padding: 8px 6px;
    }
  }
`;
const Attendance = () => {
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [reports, setReports] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [period, setPeriod] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [method, setMethod] = useState("manual");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useContext(UserContext);
  const location = useLocation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // QR Scanner state
  const [qrScanner, setQrScanner] = useState(null);
  const [qrScanning, setQrScanning] = useState(false);
  const qrVideoRef = useRef(null);

  // NEW: Fetched flags
  const [attendanceFetched, setAttendanceFetched] = useState(false);
  const [reportsFetched, setReportsFetched] = useState(false);
  const [employeesFetched, setEmployeesFetched] = useState(false);
  const showPopup = useCallback((type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  }, []);

  // Professional time validation functions
  const validateEntryTime = (date) => {
    if (!date) return true;

    const now = new Date();
    const entryDate = new Date(date);

    // Check if entry time is more than 15 minutes in the future
    const timeDiff = entryDate.getTime() - now.getTime();
    if (timeDiff > 15 * 60 * 1000) {
      showPopup(
        "error",
        "Entry time cannot be more than 15 minutes in the future"
      );
      return false;
    }

    // For non-admins: cannot select past dates at all (only today with 15 min tolerance)
    if (user?.role !== "admin") {
      // Check if date is before today (ignoring time)
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const entryDateStart = new Date(
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate()
      );

      if (entryDateStart < todayStart) {
        showPopup("error", "Only admins can record attendance for past dates");
        return false;
      }

      // If recording past time today (more than 15 minutes ago), not allowed for non-admins
      if (timeDiff < -15 * 60 * 1000) {
        showPopup("error", "Only admins can record attendance for past times");
        return false;
      }
    }

    // For admins: check if entry time is more than 7 days in the past (very lenient)
    if (user?.role === "admin" && timeDiff < -7 * 24 * 60 * 60 * 1000) {
      showPopup("error", "Entry time cannot be more than 7 days in the past");
      return false;
    }

    return true;
  };

  const validateExitTime = (timeString) => {
    if (!timeString) return true;

    const now = new Date();
    const [hours, minutes] = timeString.split(":");
    const exitDateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes)
    );

    // Check if exit time is in the future (more than 15 minutes ahead)
    const timeDiff = exitDateTime.getTime() - now.getTime();
    if (timeDiff > 15 * 60 * 1000) {
      showPopup("error", "Exit time cannot be in the future");
      return false;
    }

    // For non-admins: cannot record past dates (only today with 15 min tolerance)
    if (user?.role !== "admin") {
      // If recording past exit time today (more than 15 minutes ago), not allowed for non-admins
      if (timeDiff < -15 * 60 * 1000) {
        showPopup("error", "Only admins can record exit time for past times");
        return false;
      }
    }

    // For admins: check if exit time is more than 7 days in the past
    if (user?.role === "admin" && timeDiff < -7 * 24 * 60 * 60 * 1000) {
      showPopup("error", "Exit time cannot be more than 7 days in the past");
      return false;
    }

    return true;
  };

  // Fetch data
  useEffect(() => {
    if (user?.id && !loading && location.pathname === "/attendance") {
      if (user.role === "admin") {
        const fetchReports = async () => {
          try {
            // Fetch all reports with default date range (hire date to today)
            const response = await api("/api/attendance/reports", "GET");
            setReports(response.data.reports || []);
          } catch (error) {
            console.error("Fetch reports failed:", error);
            showPopup("error", "Failed to fetch reports. Try again.");
            setReports([]);
          } finally {
            setReportsFetched(true);
          }
        };

        const fetchEmployees = async () => {
          try {
            const response = await api("/api/employees", "GET");
            setEmployees(response.data.employees || []);
          } catch (error) {
            console.error("Failed to fetch employees:", error);
            showPopup("error", "Failed to fetch employees. Try again.");
            setEmployees([]);
          } finally {
            setEmployeesFetched(true);
          }
        };

        fetchReports();
        fetchEmployees();
      } else {
        const fetchAttendance = async () => {
          try {
            const response = await api(
              `/api/attendance/employee/${user.id}`,
              "GET"
            );
            setAttendanceRecords(response.data.attendance || []);
          } catch (error) {
            console.error("Failed to fetch attendance records:", error);
            showPopup(
              "error",
              "Failed to fetch attendance records. Try again."
            );
            setAttendanceRecords([]);
          } finally {
            setAttendanceFetched(true);
          }
        };
        fetchAttendance();
      }
    }
  }, [user, loading, location, showPopup]);

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
        showPopup(
          "error",
          "Failed to load face detection models. Refresh page."
        );
      }
    };
    loadModels();
  }, [showPopup]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setShowCamera(false);
      }
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
        setQrScanner(null);
        setQrScanning(false);
      }
    };
  }, [stream, qrScanner]);

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
        showPopup("error", "Error accessing camera. Check permissions.");
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

  // QR Scanner functions
  const startQrScanner = async () => {
    try {
      if (qrVideoRef.current && !qrScanner) {
        let isProcessing = false; // Flag to prevent multiple submissions

        const scanner = new QrScanner(
          qrVideoRef.current,
          (result) => {
            // Prevent multiple submissions
            if (isProcessing) {
              console.log("QR Code already being processed, ignoring...");
              return;
            }

            isProcessing = true;
            console.log("QR Code detected:", result);

            // Stop scanner immediately
            scanner.stop();
            scanner.destroy();
            setQrScanner(null);
            setQrScanning(false);
            console.log("QR Scanner stopped");

            // Parse QR code data
            try {
              const qrData = JSON.parse(result.data);

              // Check if QR code has expired
              const now = Date.now();
              if (qrData.expiresAt && now > qrData.expiresAt) {
                showPopup(
                  "error",
                  "QR Code has expired. Please generate a new one from your Profile page."
                );
                isProcessing = false;
                return;
              }

              // Admin can scan any employee's QR code, regular users can only scan their own
              const isValidQr =
                user?.role === "admin"
                  ? qrData.employeeId // Admin: any valid QR code
                  : qrData.employeeId === user?.id; // Employee: only their own QR

              if (qrData.employeeId && isValidQr) {
                // For admin, set the employeeId from QR code if not already selected
                if (user?.role === "admin" && qrData.employeeId) {
                  setEmployeeId(qrData.employeeId);
                }

                showPopup(
                  "success",
                  "QR Code verified! Recording attendance..."
                );
                // Auto-submit attendance after QR verification
                setTimeout(() => {
                  handleQrAttendance(qrData);
                }, 1000);
              } else {
                showPopup(
                  "error",
                  "Invalid QR Code. Please scan your personal QR code."
                );
                isProcessing = false;
              }
            } catch (parseError) {
              console.error("QR Code parsing error:", parseError);
              showPopup(
                "error",
                "Invalid QR Code format. Please scan a valid attendance QR code."
              );
              isProcessing = false;
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        setQrScanner(scanner);
        await scanner.start();
        setQrScanning(true);
        console.log("QR Scanner started");
      }
    } catch (error) {
      console.error("Error starting QR scanner:", error);
      showPopup(
        "error",
        "Failed to start QR scanner. Please check camera permissions."
      );
    }
  };

  const stopQrScanner = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
      setQrScanning(false);
      console.log("QR Scanner stopped");
    }
  };

  const handleQrAttendance = async (qrData) => {
    try {
      console.log("Submitting QR attendance...");

      // Determine which employee ID to use
      // Priority: QR code's employeeId (for admin scanning employee QR) > selected employeeId > user's own ID
      const targetEmployeeId =
        qrData.employeeId ||
        (user?.role === "admin" && employeeId ? employeeId : user.id);

      await api("/api/attendance", "POST", {
        employeeId: targetEmployeeId,
        entryTime,
        location: {
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        method: "qr",
        qrData: qrData, // Include QR data for verification
      });

      const response = await api(
        `/api/attendance/employee/${targetEmployeeId}`,
        "GET"
      );
      setAttendanceRecords(response.data.attendance);
      showPopup(
        "success",
        `QR Code attendance recorded successfully at ${entryTime}.`
      );
    } catch (error) {
      console.error("Error in QR attendance submission:", error.message);
      showPopup(
        "error",
        error.response?.data?.message ||
          "Failed to record attendance. Please try again."
      );
    }
  };

  const drawFaceBox = useCallback(async () => {
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
  }, [showCamera]);

  useEffect(() => {
    if (showCamera && modelsLoaded) {
      drawFaceBox();
    }
  }, [showCamera, modelsLoaded, drawFaceBox]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle submit triggered, method:", method);
    if (!user?.id) {
      showPopup("error", "User not authenticated. Please log in.");
      stopCamera();
      return;
    }

    // Admin validation: must select an employee
    if (user?.role === "admin" && !employeeId) {
      showPopup("error", "Please select an employee to record attendance for.");
      return;
    }

    if (method === "facial") {
      if (!modelsLoaded) {
        showPopup(
          "error",
          "Face detection models are still loading. Please wait."
        );
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
          showPopup(
            "error",
            "No reliable face detected. Ensure good lighting, face the camera directly, or re-register in Profile."
          );
          stopCamera();
          return;
        }

        const faceTemplate = Array.from(bestDetection.descriptor);
        console.log("Best face template selected:", faceTemplate);

        await api("/api/attendance/facial", "POST", {
          employeeId:
            user?.role === "admin" && employeeId ? employeeId : user.id,
          faceTemplate,
          entryTime,
          location: {
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        });
        console.log("API request successful");

        const response = await api(
          `/api/attendance/employee/${
            user?.role === "admin" && employeeId ? employeeId : user.id
          }`,
          "GET"
        );
        setAttendanceRecords(response.data.attendance);
        showPopup("success", "Facial attendance recorded successfully.");
        stopCamera();
      } catch (error) {
        console.error("Error in face detection or API:", error.message);
        showPopup(
          "error",
          error.response?.data?.message ||
            "Failed to record attendance. Ensure good lighting, face the camera directly, or re-register in Profile."
        );
        stopCamera();
      }
    } else if (method === "manual") {
      try {
        console.log("Submitting manual attendance...");
        await api("/api/attendance", "POST", {
          employeeId:
            user?.role === "admin" && employeeId ? employeeId : user.id,
          entryTime,
          location: {
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          method,
        });
        const response = await api(
          `/api/attendance/employee/${
            user?.role === "admin" && employeeId ? employeeId : user.id
          }`,
          "GET"
        );
        setAttendanceRecords(response.data.attendance);
        showPopup("success", `Manual attendance recorded successfully.`);
        stopCamera();
      } catch (error) {
        console.error("Error in manual submission:", error.message);
        showPopup(
          "error",
          error.response?.data?.message ||
            "Failed to record attendance. Please try again."
        );
        stopCamera();
      }
    } else if (method === "qr") {
      // Start QR scanner instead of submitting directly
      if (!qrScanning) {
        await startQrScanner();
      } else {
        showPopup(
          "error",
          "QR scanner is already running. Please scan a QR code."
        );
      }
    }
  };

  const handleExitAttendance = async () => {
    if (!user?.id) {
      showPopup("error", "User not authenticated. Please log in.");
      return;
    }

    // Admin validation: must select an employee
    if (user?.role === "admin" && !employeeId) {
      showPopup("error", "Please select an employee to record exit for.");
      return;
    }

    if (!exitTime) {
      showPopup("error", "Please select exit time.");
      return;
    }

    if (!longitude || !latitude) {
      showPopup("error", "Please get your current location first.");
      return;
    }

    // Validate that exit time is after entry time if both are set
    if (entryTime && exitTime) {
      const entryDate = new Date(entryTime);
      const exitDate = new Date(exitTime);
      if (exitDate <= entryDate) {
        showPopup("error", "Exit time must be after entry time.");
        return;
      }
    }

    try {
      console.log("Submitting exit attendance...");

      // Convert time string to full ISO date
      const now = new Date();
      const [hours, minutes] = exitTime.split(":");
      const exitDateTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hours),
        parseInt(minutes)
      );

      await api("/api/attendance/exit", "POST", {
        employeeId: user?.role === "admin" && employeeId ? employeeId : user.id,
        exitTime: exitDateTime.toISOString(),
        location: {
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      });

      const response = await api(
        `/api/attendance/employee/${
          user?.role === "admin" && employeeId ? employeeId : user.id
        }`,
        "GET"
      );
      setAttendanceRecords(response.data.attendance);
      showPopup("success", "Exit time recorded successfully.");

      // Clear exit time after successful submission
      setExitTime("");
    } catch (error) {
      console.error("Error in exit submission:", error.message);
      showPopup(
        "error",
        error.response?.data?.message ||
          "Failed to record exit time. Please try again."
      );
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude.toString());
          setLatitude(position.coords.latitude.toString());
          showPopup("success", "Location retrieved successfully.");
        },
        (error) => {
          showPopup("error", `Error getting location: ${error.message}`);
        }
      );
    } else {
      showPopup("error", "Geolocation is not supported by this browser.");
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") {
      showPopup("error", "Only admins can generate reports.");
      return;
    }
    if (!employeeId) {
      showPopup("error", "Please select an employee.");
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
      showPopup("success", "Report generated successfully.");
    } catch (error) {
      showPopup(
        "error",
        error.response?.data?.message ||
          "Failed to generate report. Please try again."
      );
    }
  };

  // UPDATED: loading logic using fetched flags
  const isDataLoading =
    loading ||
    (user?.role === "admin"
      ? !(reportsFetched && employeesFetched)
      : !attendanceFetched);

  if (isDataLoading) {
    return <Loading text="Loading attendance data..." />;
  }

  const handleMenuToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Navbar onMenuToggle={handleMenuToggle} />
      <AttendanceWrapper>
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        <Content>
          <MainSection>
            <LeftColumn>
              <FormCard onSubmit={handleSubmit}>
                <FormHeader>
                  <Title>Record Attendance</Title>
                </FormHeader>

                {user?.role === "admin" && (
                  <SelectWrapper>
                    <SelectStyled
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </SelectStyled>
                    <SelectArrow>▾</SelectArrow>
                  </SelectWrapper>
                )}

                <SelectWrapper>
                  <SelectStyled
                    value={method}
                    onChange={(e) => {
                      setMethod(e.target.value);
                      if (e.target.value !== "facial") stopCamera();
                      if (e.target.value !== "qr") stopQrScanner();
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
                  onChange={(date) => {
                    if (validateEntryTime(date)) {
                      setEntryTime(date ? date.toISOString() : "");
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  dateFormat="dd/MM/yyyy HH:mm"
                  placeholderText="Entry Time"
                  maxDate={new Date()} // Prevent future dates
                  minDate={
                    user?.role === "admin"
                      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
                      : new Date()
                  } // Admin: 1 day ago, Employee: today only
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

                <VideoContainer $show={qrScanning}>
                  <Video ref={qrVideoRef} autoPlay muted />
                </VideoContainer>

                <LocationButton type="button" onClick={getLocation}>
                  Get Current Location
                </LocationButton>

                <ButtonStyled
                  type="submit"
                  disabled={!entryTime || !longitude || !latitude}
                >
                  Record Entry
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

                {qrScanning && (
                  <ButtonStyled
                    type="button"
                    $stop
                    onClick={stopQrScanner}
                    disabled={!qrScanning}
                  >
                    Stop QR Scanner
                  </ButtonStyled>
                )}
              </FormCard>

              <FormCard>
                <FormHeader>
                  <Title>Record Exit Time</Title>
                </FormHeader>

                {user?.role === "admin" && (
                  <SelectWrapper>
                    <SelectStyled
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </SelectStyled>
                    <SelectArrow>▾</SelectArrow>
                  </SelectWrapper>
                )}

                <DateInputWrapper>
                  <InputStyled
                    type="time"
                    value={exitTime}
                    onChange={(e) => {
                      if (validateExitTime(e.target.value)) {
                        setExitTime(e.target.value);
                      }
                    }}
                    placeholder="Exit Time"
                    max={new Date().toTimeString().slice(0, 5)} // Prevent future times
                  />
                </DateInputWrapper>

                <LocationButton type="button" onClick={getLocation}>
                  Get Current Location
                </LocationButton>

                <ButtonStyled
                  type="button"
                  onClick={handleExitAttendance}
                  disabled={!exitTime || !longitude || !latitude}
                  style={{ backgroundColor: "#FF4500" }} /* #dc3545*/
                >
                  Record Exit
                </ButtonStyled>
              </FormCard>

              {user?.role === "admin" && (
                <ReportCard onSubmit={handleReportSubmit}>
                  <FormHeader>
                    <Title>Generate Employee Report</Title>
                  </FormHeader>
                  <SelectWrapper>
                    <SelectStyled
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name}
                        </option>
                      ))}
                    </SelectStyled>
                    <SelectArrow>▾</SelectArrow>
                  </SelectWrapper>
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
                        <th>Employee Name</th>
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
                            <td>{r.employeeName || "Unknown"}</td>
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
      <Popup
        show={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </>
  );
};

export default Attendance;
