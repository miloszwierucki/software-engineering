import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// import { api } from "@/utils/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextState {
  // user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // logIn: (email: string, password: string) => Promise<void>;
  // signIn: (name: string, email: string, password: string) => Promise<void>;
  logIn: () => Promise<void>;
  signUp: () => Promise<void>;
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
  // const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!token;

  const signUp = useCallback(async () => {
    setStoredToken("123");
    setToken("123");
  }, []);

  const logIn = useCallback(async () => {
    setStoredToken("123");
    setToken("123");
  }, []);

  const logOut = useCallback(async () => {
    setStoredToken(null);
    setToken(null);
  }, []);

  // TODO: Conect to backend
  // Fetch user data when token changes
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (token) {
  //       try {
  //         const userData = await api<User>(
  //           "/api/auth/me",
  //           "GET",
  //           undefined,
  //           token
  //         );
  //         setUser(userData);
  //       } catch (error) {
  //         console.error("Failed to fetch user data:", error);
  //         setToken(null);
  //         localStorage.removeItem(LOCAL_STORAGE_KEY);
  //       }
  //     } else {
  //       setUser(null);
  //     }
  //   };

  //   fetchUserData();
  // }, [token]);

  useEffect(() => {
    setToken(getStoredToken());
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, logIn, signUp, logOut }}
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
