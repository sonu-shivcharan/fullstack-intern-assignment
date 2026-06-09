import React, { createContext, useContext } from "react";
import type { User, UserRole } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/helpers/auth-helpers";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = data ?? null;
  const isAuthenticated = user !== null;

  const setUser = (newUser: User | null) => {
    queryClient.setQueryData(["currentUser"], newUser);
  };
  const login = (newUser: User | null) => {
    console.log("newUser", newUser);
    queryClient.setQueryData(["currentUser"], newUser);
  };
  const logout = () => {
    queryClient.setQueryData(["currentUser"], null);
  };

  const checkRole = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        checkRole,
        setUser,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
