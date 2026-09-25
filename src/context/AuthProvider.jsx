import { useState } from "react";
import { loginUser, registerUser } from "../api/authService";
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
    const responseData = await loginUser(data);
    const { accessToken, user: userData } = responseData;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data) => {
    await registerUser(data);
    return login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
