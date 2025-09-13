"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [health, setHealth] = useState("");

  useEffect(() => {
    // Call health endpoint
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data.status))
      .catch(() => setHealth("error"));
  }, []);

   return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <h1 className="text-4xl font-semibold tracking-tight text-center">Notes App</h1>
        <p className="mt-2 text-center text-neutral-400">Multi-tenant SaaS Notes Application</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {/* Primary CTA — animated gradient (optional) */}
          <button
            onClick={() => router.push("/login")}
            className="h-11 px-5 rounded-lg bg-neutral-800 text-white text-sm font-medium
                       transition-all duration-200
                       hover:bg-neutral-700 hover:shadow-[0_6px_18px_-8px_rgba(255,255,255,0.2)]
                       active:scale-[0.98]
                       focus:outline-none focus:ring-4 focus:ring-white/10"
            title="Go to Login"
          >
            <span className="relative z-10">Go to Login</span>
          </button>

          {/* Secondary CTA — neutral */}
          <button
            onClick={() => router.push("/notes")}
            className="h-11 px-5 rounded-lg bg-neutral-800 text-white text-sm font-medium
                       transition-all duration-200
                       hover:bg-neutral-700 hover:shadow-[0_6px_18px_-8px_rgba(255,255,255,0.2)]
                       active:scale-[0.98]
                       focus:outline-none focus:ring-4 focus:ring-white/10"
            title="Open Notes"
          >
            Open Notes
          </button>
        </div>

        {/* Health check */}
        <div className="mt-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1 text-xs text-neutral-400">
            <span className={`h-2 w-2 rounded-full ${health === "ok" ? "bg-green-500" : health === "error" ? "bg-red-500" : "bg-neutral-600"}`} />
            Health: {health || "loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}
