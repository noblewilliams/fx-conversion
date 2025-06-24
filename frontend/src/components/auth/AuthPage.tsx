"use client";

import { ArrowRight, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks";
import { Input } from "../ui/input";
import React from "react";

export function AuthPage() {
  const { login, register, isLoading } = useAuth();

  const [error, setError] = React.useState("");
  const [isLogin, setIsLogin] = React.useState(true);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            FX Conversion Hub
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg px-8 pt-6 pb-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                id="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
              />
            )}

            <Input
              id="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {error && (
              <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={isLoading}
              disabled={
                isLoading ||
                !formData.email ||
                !formData.password ||
                (isLogin && !formData.name && formData.password.length < 8)
              }
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({ email: "", password: "", name: "" });
              }}
              className="text-gray-700 hover:text-black text-sm font-medium cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
