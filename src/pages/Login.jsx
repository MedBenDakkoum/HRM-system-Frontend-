import React, { useState, useContext, useCallback } from "react";
import styled from "styled-components";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { colors } from "../styles/GlobalStyle";
import UserContext from "../context/UserContext";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

// --- Styled Components ---
const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, ${colors.background} 0%, #ffffff 100%);

  @media (max-width: 480px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const Form = styled.form`
  background-color: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 350px;
    padding: 32px 24px;
    gap: 18px;
  }

  @media (max-width: 360px) {
    padding: 28px 20px;
    gap: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconCard = styled.div`
  background: white;
  padding: 8px 10px;
  border-radius: 30%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 9px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    margin-bottom: 8px;
  }
`;

const Icon = styled(FaSignInAlt)`
  font-size: 2rem;
  color: black;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: ${colors.text};
  font-size: 1.5rem;
  margin-bottom: 15px;
  margin-top: 1px;

  @media (max-width: 480px) {
    font-size: 1.375rem;
    margin-bottom: 12px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${colors.secondary};
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  display: block;
  margin: 0 auto;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.2);
  }

  @media (max-width: 480px) {
    padding: 11px 12px;
    font-size: 0.9rem;
    width: 100%;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: ${colors.accent};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${colors.primary || "#1976d2"};
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 11px;
    font-size: 0.95rem;
  }
`;

const HelperText = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: ${colors.secondary};
  margin-top: 10px;

  a {
    color: ${colors.accent};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 8px;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 14px;
  border: 1px solid ${colors.secondary};
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  display: block;
  margin: 0 auto;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.2);
  }

  @media (max-width: 480px) {
    padding: 11px 38px 11px 12px;
    font-size: 0.9rem;
    width: 100%;
  }
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.1rem;
  color: ${colors.secondary};

  @media (max-width: 480px) {
    right: 8px;
    font-size: 1rem;
  }
`;

// --- Login Component ---
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("error");
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const { setUserFromLogin } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const showPopup = useCallback((type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  }, []);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation ---
    if (!email || !password) {
      showPopup("error", "Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      showPopup("error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api("/api/employees/login", "POST", {
        email,
        password,
      });

      if (response.success) {
        const userResponse = await api("/api/employees/me", "GET");
        setUserFromLogin(userResponse.data.user);
        navigate("/attendance");
      } else {
        showPopup("error", response.message || "Incorrect email or password.");
      }
    } catch (error) {
      console.error("Server error:", error);
      showPopup("error", "Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading text="Logging in..." />;

  return (
    <LoginWrapper>
      <Form onSubmit={handleSubmit}>
        <Header>
          <IconCard>
            <Icon />
          </IconCard>
          <Title>Sign In</Title>
        </Header>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordWrapper>
          <PasswordInput
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeIcon onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </EyeIcon>
        </PasswordWrapper>
        <Button type="submit">Login</Button>
        <HelperText>
          Don't have an account? <Link to="/register">Sign up</Link>
        </HelperText>
      </Form>

      <Popup
        show={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </LoginWrapper>
  );
};

export default Login;
