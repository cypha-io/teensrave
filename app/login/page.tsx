"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Token is now set server-side in cookie
        // Store in localStorage for client-side access
        localStorage.setItem("admin_token", data.token);
        // Redirect to dashboard or the intended page
        const redirect = searchParams.get("redirect") || "/admin/dashboard";
        window.location.href = redirect;
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat">
      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg">
              <Image
                src="/logo.png"
                alt="TeensRave Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            TeensRave Admin
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Sign in to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@teensrave.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white relative z-10"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}