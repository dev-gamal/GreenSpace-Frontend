import { useState } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const login = async (data) => {
    const response = await api.post("/auth/login", data);
    const { accessToken, user: userData } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data) => {
    await api.post("/auth/register", data);
    return login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
