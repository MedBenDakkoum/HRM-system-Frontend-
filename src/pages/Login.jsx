import React, { useState } from "react";
import styled from "styled-components";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { colors } from "../styles/GlobalStyle";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  border: 1px solid ${colors.secondary};
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  background-color: ${colors.accent};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserFromLogin } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api("/api/employees/login", "POST", {
        email,
        password,
      });
      if (response.success) {
        // Fetch user data after login and set it
        const userResponse = await api("/api/employees/me", "GET");
        setUserFromLogin(userResponse.data.user);
        navigate("/attendance"); // Redirect to attendance after setting user
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
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </Form>
    </LoginWrapper>
  );
};

export default Login;
