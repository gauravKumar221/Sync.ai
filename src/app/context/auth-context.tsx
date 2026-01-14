"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type User = {
  id?: number;
  name: string;
  email?: string;
  phone: string;
  location: string;
  city: string;
  address: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("Auth");
    document.cookie = "Auth=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
