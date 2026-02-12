export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, refreshToken: string, username: string, role?: string) => void;
  logout: () => void;
}
