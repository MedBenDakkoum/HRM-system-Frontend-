import React, { useState, useContext } from "react";
import styled from "styled-components";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { colors } from "../styles/GlobalStyle";
import UserContext from "../context/UserContext";
import { FaSignInAlt } from "react-icons/fa"; // ✅ login icon
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ icons

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(
    135deg,
    ${colors.background} 0%,
    #ffffff 100%
  ); /* subtle gradient */
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
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-bottom: 0px; */
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
`;

const Icon = styled(FaSignInAlt)`
  font-size: 2rem;
  color: black;
`;

const Title = styled.h2`
  text-align: center;
  color: ${colors.text};
  font-size: 1.5rem;
  margin-bottom: 15px;
  margin-top: 1px;
`;

const Input = styled.input`
  width: 90%;
  padding: 12px 14px;
  border: 1px solid ${colors.secondary};
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.2);
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
`;

// wrapper for password input + icon
const PasswordWrapper = styled.div`
  position: relative;
  width: 99%; /* matches your email input */
  display: flex;
  justify-content: center; /* keeps the input centered */
`;

const PasswordInput = styled.input`
  width: 90%; /* take full width inside wrapper */
  padding: 12px 40px 12px 14px; /* padding-right for the eye */
  border: 1px solid ${colors.secondary};
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.2);
  }
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 10px; /* stays on the right */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.1rem;
  color: ${colors.secondary};
`;


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserFromLogin } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        console.error("Login failed:", response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
          Don’t have an account? <a href="/register">Sign up</a>
        </HelperText>
      </Form>
    </LoginWrapper>
  );
};

export default Login;
