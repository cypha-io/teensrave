"use client";

import { Suspense, useState, type FormEvent } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:outline-none";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Only follow a redirect back into the admin area, and only for admins.
        const redirect = searchParams.get("redirect");
        window.location.href = redirect === "/pos" && data.home !== "/change-password" ? redirect : data.kind === "admin" && redirect?.startsWith("/admin/") ? redirect : data.home;
        return;
      }
      const data = await response.json();
      setError(data.message || "Login failed");
    } catch {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative w-full max-w-md rounded-[2rem] border border-white/15 bg-black/80 p-6 backdrop-blur-xl sm:p-8">
      <div className="mb-8 text-center">
        <Image src="/logo.png" alt="TeensRave logo" width={72} height={72} priority className="mx-auto mb-4 h-18 w-18 object-contain" />
        <h1
          className="text-4xl leading-none text-white uppercase"
          style={{ fontFamily: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif" }}
        >
          Sign In
        </h1>
        <p className="mt-2 text-sm text-neutral-400">Sign in to your TeensRave dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
            Email
          </label>
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-300">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black p-4">
      <Image src="/bg.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
