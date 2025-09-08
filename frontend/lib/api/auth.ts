import apiClient from "./client";
import { jwtDecode } from "jwt-decode";

export interface LoginCredentials {
  usuario: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await apiClient.post<string>("/auth/login", credentials);
      const token = response.data;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      return token;
    } catch (error) {
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem("authToken");
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode the token to check expiration
      const decoded = jwtDecode<{ exp: number }>(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      // If token is expired, remove it
      if (isExpired) {
        console.log("Token expired");
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      this.logout();
      return false;
    }
  },
};
