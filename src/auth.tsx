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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export interface Response {
  status: Status;
}
interface ResponseLogin extends Response {
  id: string;
  token: string;
}

export type Status = "success" | "error";

export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logIn: (email: string, password: string) => Promise<Status>;
  signUp: (
    firstname: string,
    surname: string,
    role: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<Status>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);
const LOCAL_STORAGE_KEY = "auth.token";
const LOCAL_STORAGE_ID = "auth.id";

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

function getStoredID() {
  return localStorage.getItem(LOCAL_STORAGE_ID);
}

function setStoredID(id: string | null) {
  if (id) {
    localStorage.setItem(LOCAL_STORAGE_KEY, id);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_ID);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [id, setId] = useState<string | null>(getStoredID());
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!token;

  const signUp = useCallback(
    async (
      firstName: string,
      lastName: string,
      role: string,
      email: string,
      password: string,
      phone: string
    ) => {
      try {
        const response = await api<Response>("/api/signup", "POST", {
          firstName,
          lastName,
          role,
          email,
          password,
          phone,
        });

        if (response.status === "error") {
          throw new Error("Sign up failed");
        }

        return "success";
      } catch (error) {
        console.error("Sign up failed", error);
        return "error";
      }
    },
    []
  );

  const logIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await api<ResponseLogin>("/api/login", "POST", {
        email,
        password,
      });

      if (response.status === "error") {
        throw new Error("Login failed");
      }

      const { token, id } = response;
      setStoredToken(token);
      setStoredID(id);
      setToken(token);
      setId(id);

      return "success";
    } catch (error) {
      console.error("Login failed", error);
      return "error";
    }
  }, []);

  const logOut = useCallback(async () => {
    setStoredToken(null);
    setStoredID(null);
    setToken(null);
    setId(null);
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await api<User>(
            `/api/user/${id}`,
            "GET",
            undefined,
            token
          );
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setToken(null);
          setStoredToken(null);

          setId(null);
          setStoredID(null);
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
