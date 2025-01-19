import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/utils/api";

export interface User {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  phone: string;
}

export interface Response {
  id: string;
  token: string;
}

export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstname: string,
    surname: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);
const LOCAL_STORAGE_KEY = "auth.token";

function getStoredToken() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(LOCAL_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [id, setId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!token;

  const signUp = useCallback(
    async (name: string, email: string, password: string, phone: string) => {
      try {
        const response = await api<Response>("/api/auth", "POST", {
          name,
          email,
          password,
          phone,
        });

        const { token, id } = response;
        setStoredToken(token);
        setToken(token);
        setId(id);
      } catch (error) {
        console.error("Sign up failed", error);
        throw error;
      }
    },
    []
  );

  const logIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await api<Response>("/api/auth", "POST", {
        email,
        password,
      });
      const { token, id } = response;
      setStoredToken(token);
      setToken(token);
      setId(id);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    setStoredToken(null);
    setToken(null);
    setId(null);
  }, []);

  // TODO: Conect to backend
  // Fetch user data when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await api<User>(
            "/api/auth/me",
            "GET",
            { id },
            token
          );
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setToken(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } else {
        setUser(null);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    setToken(getStoredToken());
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, logIn, signUp, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
