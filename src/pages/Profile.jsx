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
import Popup from "../components/Popup";
import Loading from "../components/Loading";

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

const ProfileCard = styled.div`
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

const SelectStyled = styled.select`
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

const DetailText = styled.div`
  width: 90%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${colors.primary};
  font-size: 0.95rem;
  color: #333;
  background: #f9fafb;
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

const Profile = () => {
  const { user, loading } = useContext(UserContext);
  const [employeeData, setEmployeeData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [hireDate, setHireDate] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = useCallback((type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setShowCamera(false);
    }
  }, [stream]);

  useEffect(() => {
    const loadModels = async () => {
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
        setModelsLoaded(true);
      } catch (error) {
        console.log("Failed to load models. Refresh page.", error);
        showPopup("error", "Failed to load models. Refresh page.");
        stopCamera();
      }
    };
    loadModels();
  }, [stopCamera, showPopup]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || loading) return;
      try {
        if (user.role === "admin") {
          const response = await api("/api/employees", "GET");
          setEmployees(response.data.employees || []);
          const employeeId = selectedEmployeeId || user.id;
          const employeeResponse = await api(
            `/api/employees/${employeeId}`,
            "GET"
          );
          const data = employeeResponse.data.employee;
          setEmployeeData(data);
          setName(data.name || "");
          setEmail(data.email || "");
          setPosition(data.position || "");
          setHireDate(data.hireDate ? new Date(data.hireDate) : null);
          setQrCode(data.qrCode || "");
        } else {
          const response = await api(`/api/employees/${user.id}`, "GET");
          const data = response.data.employee;
          setEmployeeData(data);
        }
      } catch (error) {
        console.log("Failed to fetch employee data.", error);
        showPopup("error", "Failed to fetch employee data.");
      }
    };
    fetchData();
  }, [user, loading, selectedEmployeeId, showPopup]);

  const startCamera = useCallback(async () => {
    if (!stream) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setShowCamera(true);
      } catch (error) {
        console.log("Camera access failed. Check permissions.", error);
        showPopup("error", "Camera access failed. Check permissions.");
        stopCamera();
      }
    }
  }, [stream, showPopup, stopCamera]);

  const handleUpdateProfile = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user?.id) {
        showPopup("error", "User not authenticated");
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
        const employeeId =
          user.role === "admin" ? selectedEmployeeId || user.id : user.id;
        await api(`/api/employees/${employeeId}`, "PATCH", updateData);
        showPopup("success", "Profile updated successfully");
        const response = await api(`/api/employees/${employeeId}`, "GET");
        const data = response.data.employee;
        setEmployeeData(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPosition(data.position || "");
        setHireDate(data.hireDate ? new Date(data.hireDate) : null);
        setQrCode(data.qrCode || "");
      } catch (error) {
        console.log("Profile update failed. Try again.", error);
        showPopup("error", "Profile update failed. Try again.");
      }
    },
    [
      user,
      selectedEmployeeId,
      name,
      email,
      position,
      hireDate,
      qrCode,
      showPopup,
    ]
  );

  const handleRegisterFace = useCallback(async () => {
    if (!modelsLoaded) {
      showPopup("error", "Models not loaded. Refresh page.");
      stopCamera();
      return;
    }
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
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      if (detections.length === 0) {
        showPopup("error", "No face detected. Adjust and retry.");
        stopCamera();
        return;
      }
      const faceDescriptor = Array.from(detections[0].descriptor);
      const employeeId =
        user.role === "admin" ? selectedEmployeeId || user.id : user.id;
      await api(`/api/employees/face-template/${employeeId}`, "PATCH", {
        faceDescriptor,
      });
      showPopup("success", "Face data saved successfully.");
      const response = await api(`/api/employees/${employeeId}`, "GET");
      setEmployeeData(response.data.employee);
    } catch (error) {
      console.log("Error occurred. Please retry.", error);
      showPopup("error", "Error occurred. Please retry.");
    } finally {
      stopCamera();
    }
  }, [
    user,
    selectedEmployeeId,
    modelsLoaded,
    startCamera,
    stopCamera,
    showPopup,
  ]);

  if (loading || !employeeData)
    return <Loading text="Loading profile data..." />;

  return (
    <>
      <Navbar />
      <ProfileWrapper>
        <Sidebar />
        <Content>
          {user.role === "admin" ? (
            <>
              <FormCard>
                <FormHeader>
                  <Title>Select Employee</Title>
                </FormHeader>
                <SelectStyled
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="">Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </SelectStyled>
              </FormCard>
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
              <FormCard as="div">
                <FormHeader>
                  <Title>Register Face</Title>
                </FormHeader>
                <VideoContainer $show={showCamera}>
                  <Video ref={videoRef} autoPlay muted />
                  <Canvas ref={null} />
                </VideoContainer>
                <ButtonStyled
                  type="button"
                  onClick={handleRegisterFace}
                  disabled={!modelsLoaded || !selectedEmployeeId}
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
            </>
          ) : (
            <ProfileCard>
              <FormHeader>
                <Title>Your Profile</Title>
              </FormHeader>
              <DetailText>Name: {employeeData.name}</DetailText>
              <DetailText>Email: {employeeData.email}</DetailText>
              <DetailText>
                Position: {employeeData.position || "N/A"}
              </DetailText>
              <DetailText>
                Hire Date:{" "}
                {employeeData.hireDate
                  ? new Date(employeeData.hireDate).toLocaleDateString()
                  : "N/A"}
              </DetailText>
              <DetailText>
                QR Code: {employeeData.qrCode || "Not set"}
              </DetailText>
              <DetailText>
                Face Template:{" "}
                {employeeData.faceDescriptor ? "Registered" : "Not registered"}
              </DetailText>
            </ProfileCard>
          )}
        </Content>
      </ProfileWrapper>
      <Popup
        show={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </>
  );
};

export default Profile;
