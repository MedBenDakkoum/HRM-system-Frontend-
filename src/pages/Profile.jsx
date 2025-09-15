import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
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

const ProfileWrapper = styled.div`
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
    background-color: #ccc;
    cursor: not-allowed;
  }
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

const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [hireDate, setHireDate] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setShowCamera(false);
      console.log("Camera stopped at", new Date().toLocaleTimeString());
    }
  }, [stream]);

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
        console.log("Models loaded successfully");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models from CDN:", error);
        setMessage({
          text: "Failed to load models. Refresh page.",
          type: "error",
        });
        stopCamera();
      }
    };
    loadModels();
  }, [stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    console.log("Starting camera...");
    if (!stream) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setShowCamera(true);
        console.log("Camera started successfully");
      } catch (err) {
        console.error("Camera error:", err);
        setMessage({
          text: "Camera access failed. Check permissions.",
          type: "error",
        });
        stopCamera();
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    if (!user?.id) {
      setMessage({ text: "User not authenticated", type: "error" });
      return;
    }
    try {
      const updateData = {
        name,
        email,
        position,
        hireDate: hireDate ? hireDate.toISOString() : undefined,
        qrCode,
      };
      await api(`/api/employees/${user.id}`, "PATCH", updateData);
      setMessage({ text: "Profile updated successfully", type: "success" });
      console.log("Profile updated successfully");
    } catch (error) {
      setMessage({ text: "Profile update failed. Try again.", type: "error" });
      console.error("Profile update failed:", error);
    }
  };

  const handleRegisterFace = async () => {
    console.log("Register Face button clicked");
    if (!modelsLoaded) {
      console.log("Models not loaded yet");
      setMessage({ text: "Models not loaded. Refresh page.", type: "error" });
      stopCamera();
      return;
    }
    console.log("Starting camera for face registration...");
    await startCamera();
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (videoRef.current?.readyState >= 2) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    try {
      console.log("Attempting face detection...");
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      console.log("Face detection completed, detections:", detections.length);
      if (detections.length === 0) {
        setMessage({
          text: "No face detected. Adjust and retry.",
          type: "error",
        });
        stopCamera();
        console.log("No face detected, camera stopped");
        return;
      }
      setMessage({ text: "Face detected. Saving data...", type: "success" });
      const faceDescriptor = Array.from(detections[0].descriptor);
      console.log("Registering face descriptor:", faceDescriptor);
      const response = await api(
        `/api/employees/face-template/${user.id}`,
        "PATCH",
        { faceDescriptor }
      );
      console.log("API response:", response);
      if (response.success) {
        setMessage({ text: "Face data saved successfully.", type: "success" });
        console.log("Face data saved successfully");
      } else {
        setMessage({ text: "Failed to save face data. Retry.", type: "error" });
        console.error("Failed to save face data");
      }
    } catch (error) {
      console.error("Error in face detection or registration:", error);
      setMessage({ text: "Error occurred. Please retry.", type: "error" });
    } finally {
      stopCamera();
      console.log("Camera stopped after registration attempt");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <ProfileWrapper>
        <Sidebar />
        <Content>
          <FormCard onSubmit={handleUpdateProfile}>
            <FormHeader>
              <Title>Update Profile</Title>
            </FormHeader>
            <InputStyled
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputStyled
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputStyled
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <DateInputWrapper>
              <DatePicker
                selected={hireDate}
                onChange={(date) => setHireDate(date)}
                placeholderText="Hire Date"
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                isClearable
              />
              <DateIcon />
            </DateInputWrapper>
            <InputStyled
              placeholder="QR Code"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
            />
            <ButtonStyled type="submit" disabled={!name || !email}>
              Update Profile
            </ButtonStyled>
          </FormCard>
          <FormCard>
            <FormHeader>
              <Title>Register Face</Title>
            </FormHeader>
            <VideoContainer $show={showCamera}>
              <Video ref={videoRef} autoPlay muted />
              <Canvas ref={null} />
            </VideoContainer>
            <Alert show={!!message.text} type={message.type}>
              {message.text}
            </Alert>
            <ButtonStyled
              type="button"
              onClick={handleRegisterFace}
              disabled={!modelsLoaded || user?.faceDescriptor?.length === 128}
            >
              Register Face
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
        </Content>
      </ProfileWrapper>
    </>
  );
};

export default Profile;
