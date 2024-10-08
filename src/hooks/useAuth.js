import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await axios.get(
      "https://restaurantfullstack-20d2bcfb0f21.herokuapp.com/api/users/me",
      {
        headers: { Authorization: `${token}` },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Session expired", error);
    } else {
      console.error("Error fetching user", error);
    }
    localStorage.removeItem("token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const userData = await fetchUser();
      setUser(userData);
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (userData) => {
    localStorage.setItem("token", userData.token);
    const fetchedUser = await fetchUser();
    setUser(fetchedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
