import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Documents from "./pages/Documents";
import Leaves from "./pages/Leaves";
import Profile from "./pages/Profile"; // New import
import { UserProvider } from "./context/UserContext";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar, { NavbarSpacer } from "./components/Navbar";

// ProtectedRoute component to restrict access to authenticated routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) return null; // Wait for loading to complete
  if (!user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { loading } = useContext(UserContext);

  const handleUnauthorized = () => {
    if (!loading) {
      <Navigate to="/" replace />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <UserProvider onUnauthorized={handleUnauthorized}>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <NavbarSpacer />
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <NavbarSpacer />
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <NavbarSpacer />
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaves"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <NavbarSpacer />
                    <Leaves />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <NavbarSpacer />
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
