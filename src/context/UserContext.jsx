import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true to handle initial fetch

  useEffect(() => {
    // Attempt to restore user session on mount (e.g., using existing cookie/session)
    const restoreUserSession = async () => {
      try {
        const response = await api("/api/employees/me", "GET");
        setUser({
          id: response.data.user._id,
          role: response.data.user.role,
        });
      } catch (error) {
        console.error("Error restoring user session:", error);
        setUser(null); // No session, user remains null
      } finally {
        setLoading(false);
      }
    };

    restoreUserSession();
  }, []); // Run once on mount

  const setUserFromLogin = (userData) => {
    setLoading(true);
    try {
      setUser({
        id: userData._id,
        role: userData.role,
      });
    } catch (error) {
      console.error("Error setting user from login:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      const response = await api("/api/employees/me", "GET");
      setUser({
        id: response.data.user._id,
        role: response.data.user.role,
      });
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{ user, setUserFromLogin, refreshUser, clearUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
