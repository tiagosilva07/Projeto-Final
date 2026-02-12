import { useState, type ReactNode } from "react";
import { AuthContext } from "./auth.context";
import {jwtDecode} from "jwt-decode";

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
  sub: string;
  role?: string;
}

const getValidToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded: JwtPayload = jwtDecode(token);
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    return null;
  }
};

const getRefreshToken = (): string | null => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  return refreshToken;
};

const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.role || localStorage.getItem("role");
  } catch {
    return localStorage.getItem("role");
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getValidToken());
  const [refreshToken, setRefreshToken] = useState<string | null>(() => getRefreshToken());
  const [username, setUsername] = useState<string | null>(() => 
    token ? localStorage.getItem("username") : null
  );
  const [role, setRole] = useState<string | null>(() => getRoleFromToken(token));
  
  const login = (token: string, refreshToken: string, username: string, userRole?: string) => {
    const decodedRole = userRole || getRoleFromToken(token);
    setToken(token);
    setRefreshToken(refreshToken);
    setUsername(username);
    setRole(decodedRole);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("username", username);
    if (decodedRole) {
      localStorage.setItem("role", decodedRole);
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  };

  const isAuthenticated = !!token;
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  return (
    <AuthContext.Provider value={{ 
      token, 
      refreshToken, 
      username, 
      role,
      isAuthenticated, 
      isAdmin,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
