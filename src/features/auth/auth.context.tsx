import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "../auth/services/auth.service";
import { tokenStore } from "../../shared/api/token.store";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}



const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 🔥 Auto refresh khi F5
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken } = await authService.refresh();
        tokenStore.set(accessToken);
        console.log("Access token refreshed:", accessToken);

        const userData = await authService.getProfile();
        console.log("Fetched user data:", userData);
        setUser(userData);

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    await authService.login({ email, password });
    setIsAuthenticated(true);
    const userData = await authService.getProfile();
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);