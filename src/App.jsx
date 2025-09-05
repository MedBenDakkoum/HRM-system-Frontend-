import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Documents from "./pages/Documents";
import Leaves from "./pages/Leaves";
import { UserProvider } from "./context/UserContext";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import ErrorBoundary from "./components/ErrorBoundary"; // Import the error boundary

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
      // Only redirect if not loading to avoid race conditions
      <Navigate to="/" replace />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <UserProvider onUnauthorized={handleUnauthorized}>
        <Router>
          <ErrorBoundary>
            {" "}
            {/* Wrap with ErrorBoundary */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Attendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaves"
                element={
                  <ProtectedRoute>
                    <Leaves />
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
