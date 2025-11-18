import { createContext, useState, useEffect } from "react";
import { authAPI } from "@/services/api";
import { toast } from "@/components/ui/sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await authAPI.getCurrentUser();
        const userWithRole = {
          ...userData.user,
          role: userData.roles?.[0] || "Student",
        };
        setUser(userWithRole);
      }
    } catch (error) {
      localStorage.removeItem("token");
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData, roles } = response.data.data;
      const userWithRole = { ...userData, role: roles?.[0] || "Student" };
      localStorage.setItem("token", token);
      setUser(userWithRole);
      toast.success("Login successful!");
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: u, role } = response.data.data;
      setUser({ ...u, role: role || "Student" });
      localStorage.setItem("token", token);
      toast.success("Registration successful!");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
