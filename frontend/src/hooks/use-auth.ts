import React from "react";
import Cookies from "js-cookie";
import { AuthContext } from "@/components/providers/AuthProvider";
import { api, ErrorToast, parseError, SuccessToast } from "@/utils";

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const fetchUserProfile = async () => {
    try {
      const response = await api.auth.getProfile();

      if (response) {
        context.setUser(response);
      } else {
        logout();
      }
    } catch (error) {
      ErrorToast(parseError(error));
      logout();
    } finally {
      context.setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    context.setIsLoading(true);

    try {
      const response = await api.auth.login({ email, password });

      if (response.data.token) {
        SuccessToast("Login successful");

        context.setUser(response.data.user);
        context.setToken(response.data.token);
        Cookies.set("auth_token", response.data.token, { expires: 7 });
      } else {
        const errorMessage = response.message || "Login failed";
        ErrorToast(errorMessage);
      }
    } catch (error) {
      ErrorToast(parseError(error));
    } finally {
      context.setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    context.setIsLoading(true);
    try {
      const response = await api.auth.register({ email, password, name });

      if (response.data.token) {
        context.setUser(response.data.user);
        context.setToken(response.data.token);
        Cookies.set("auth_token", response.data.token, { expires: 7 });
      } else {
        ErrorToast(response.message);
      }
    } catch (error) {
      ErrorToast(parseError(error));
    } finally {
      context.setIsLoading(false);
    }
  };

  const logout = () => {
    context.setUser(null);
    context.setToken(null);
    Cookies.remove("auth_token");
    context.setIsLoading(false);
  };

  React.useEffect(() => {
    const storedToken = Cookies.get("auth_token");

    if (storedToken) {
      context.setToken(storedToken);
      if (context.user === null) {
        fetchUserProfile();
      }
    } else {
      context.setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user: context.user,
    token: context.token,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    login,
    logout,
    register,
    fetchUserProfile,
  };
};
