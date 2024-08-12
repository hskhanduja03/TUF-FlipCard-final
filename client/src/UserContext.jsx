import axios from "axios";
import React, { useEffect, useState } from "react";

export const UserContext = React.createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/profile", {
          withCredentials: true // Ensure cookies are sent with the request
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        console.error("Error details:", error.response ? error.response.data : error.message);
      } finally {
        setReady(true);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
