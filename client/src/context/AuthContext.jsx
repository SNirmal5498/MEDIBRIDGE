import { useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContextObject";

function persistUser(user) {
  if (user) {
    localStorage.setItem("medibridge_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("medibridge_user");
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("medibridge_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(() => !!localStorage.getItem("medibridge_token"));

  useEffect(() => {
    const token = localStorage.getItem("medibridge_token");
    if (!token) return;

    authService
      .getProfile()
      .then((data) => {
        const next = data.user ?? data;
        setUser(next);
        persistUser(next);
      })
      .catch(() => {
        localStorage.removeItem("medibridge_token");
        persistUser(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("medibridge_token", data.token);
    persistUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    if (data.token && data.user) {
      localStorage.setItem("medibridge_token", data.token);
      persistUser(data.user);
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("medibridge_token");
    persistUser(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await authService.updateProfile(payload);
    const next = data.user ?? data;
    persistUser(next);
    setUser(next);
    return next;
  }, []);

  const changePassword = useCallback(async (payload) => {
    return authService.changePassword(payload);
  }, []);

  const deleteAccount = useCallback(async () => {
    await authService.deleteAccount();
    localStorage.removeItem("medibridge_token");
    persistUser(null);
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
        updateProfile,
        changePassword,
        deleteAccount,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
