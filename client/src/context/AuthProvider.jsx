import { useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("medibridge_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(() => !!localStorage.getItem("medibridge_token"));

  useEffect(() => {
    const token = localStorage.getItem("medibridge_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((data) => {
        setUser(data.user ?? data);
        localStorage.setItem(
          "medibridge_user",
          JSON.stringify(data.user ?? data)
        );
      })
      .catch(() => {
        localStorage.removeItem("medibridge_token");
        localStorage.removeItem("medibridge_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);

    localStorage.setItem("medibridge_token", data.token);
    localStorage.setItem("medibridge_user", JSON.stringify(data.user));

    setUser(data.user);

    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("medibridge_token");
    localStorage.removeItem("medibridge_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}