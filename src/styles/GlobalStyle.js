import { createGlobalStyle } from "styled-components";

const colors = {
  background: "#F8F7F6",
  primary: "#85929E",
  secondary: "#657786",
  text: "#000000",
  accent: "#FF4500 " /*#FF4500 , #f18500*/,
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${colors.background};
    color: ${colors.text};
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
  }

  button {
    background-color: ${colors.accent};
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
  }

  button:hover {
    background-color: ${colors.primary};
  }
`;

export default GlobalStyle;
export { colors };
