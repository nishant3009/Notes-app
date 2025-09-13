"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // save token in localStorage
      localStorage.setItem("token", data.token);

      // redirect to notes page
      router.push("/notes");
    } catch (err) {
      setError("Something went wrong");
    }
  };

 return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-neutral-950/80 backdrop-blur p-6 rounded-xl border border-neutral-800 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
      >
        <h1 className="text-white text-center text-2xl font-semibold tracking-tight">
          Login
        </h1>

        {error && (
          <p className="mt-3 text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <div className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 rounded-lg bg-neutral-900/80 text-white placeholder-neutral-500 px-3 border border-neutral-800 focus:outline-none focus:border-neutral-200 focus:ring-4 focus:ring-white/5 transition-colors"
            required
            autoComplete="email"
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 rounded-lg bg-neutral-900/80 text-white placeholder-neutral-500 px-3 border border-neutral-800 focus:outline-none focus:border-neutral-200 focus:ring-4 focus:ring-white/5 transition-colors"
            required
            autoComplete="current-password"
            aria-label="Password"
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full h-11 rounded-lg bg-white text-black font-medium tracking-wide
                     transition-all duration-200
                     hover:bg-neutral-200 hover:shadow-[0_8px_20px_-8px_rgba(255,255,255,0.5)]
                     active:scale-[0.98] active:bg-neutral-300
                     focus:outline-none focus:ring-4 focus:ring-white/20"
        >
          Login
        </button>
      </form>
    </div>
  );
}
