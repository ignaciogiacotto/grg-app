import { useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshToken as refreshTokenService } from "../services/authService";

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface DecodedToken {
  exp: number;
  id: string;
  role: string;
  name: string;
  username: string;
  email: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isSessionWarningModalOpen, setIsSessionWarningModalOpen] =
    useState(false);

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionWarningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (sessionWarningTimerRef.current)
      clearTimeout(sessionWarningTimerRef.current);
    setIsSessionWarningModalOpen(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleRefreshToken = async () => {
    if (!token) return;
    try {
      const { token: newToken } = await refreshTokenService(token);
      const decodedToken: DecodedToken = jwtDecode(newToken);
      login(newToken, {
        _id: decodedToken.id,
        name: decodedToken.name,
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
      });
      setIsSessionWarningModalOpen(false);
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expiresIn = decodedToken.exp - currentTime;

      if (expiresIn <= 0) {
        logout();
        return;
      }

      const warningTime = expiresIn - 60; // 1 minute before expiration

      if (warningTime > 0) {
        sessionWarningTimerRef.current = setTimeout(() => {
          console.log("Showing session warning modal");
          setIsSessionWarningModalOpen(true);
        }, warningTime * 1000);
      }

      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, expiresIn * 1000);
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (sessionWarningTimerRef.current)
        clearTimeout(sessionWarningTimerRef.current);
    };
  }, [token, logout]);

  return {
    token,
    user,
    login,
    logout,
    isSessionWarningModalOpen,
    handleRefreshToken,
  };
};
