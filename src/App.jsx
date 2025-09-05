import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Documents from "./pages/Documents";
import Leaves from "./pages/Leaves";
import { UserProvider } from "./context/UserContext"; // Import UserProvider

function App() {
  return (
    <>
      <GlobalStyle />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/leaves" element={<Leaves />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
