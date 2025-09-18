import React from "react";
import styled from "styled-components";
import { colors } from "../styles/GlobalStyle";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f7fa;
  gap: 15px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${colors.primary};
  border-top: 4px solid ${colors.tertialy};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #657786;
  font-size: 1rem;
  margin: 0;
`;

const Loading = ({ text = "Loading..." }) => {
  return (
    <LoadingContainer role="status" aria-live="polite">
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
