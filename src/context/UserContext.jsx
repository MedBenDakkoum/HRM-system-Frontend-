import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api("/api/employees/me", "GET");
        setUser({
          id: response.data.user._id,
          role: response.data.user.role,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, []); // Run once on mount

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
