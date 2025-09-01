import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ move fetchUser outside so it can be reused
  const fetchUser = useCallback(async () => {
    try {
      const response = await api("/api/employees/me", "GET");
      setUser({
        id: response.data.user._id,
        role: response.data.user.role,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null); // Ensure user is cleared on error
    }
  }, []);

  // Run once on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Check for token in cookies periodically
  useEffect(() => {
    const checkToken = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (token && !user) {
        fetchUser();
      }
    };

    checkToken(); // run immediately
    const interval = setInterval(checkToken, 5000); // run every 5s
    return () => clearInterval(interval);
  }, [user, fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
