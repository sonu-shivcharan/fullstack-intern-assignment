export type UserRole = "ADMIN" | "USER" | "STORE_OWNER";

export interface User {
  id: number;
  name: string;
  address: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}
