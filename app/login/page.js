"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✅ Auth success, navigation handled by <a href>
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded font-medium"
        >
          {loading ? "Logging in..." : "Authenticate"}
        </button>

        {/* 🔴 IMPORTANT PART: HARD NAVIGATION */}
        <div className="flex gap-3 pt-2">
          <a
            href="/employer"
            className="flex-1 bg-black text-white py-2 rounded text-center border border-gray-600"
          >
            Go to Employer
          </a>

          <a
            href="/employee"
            className="flex-1 border border-gray-600 py-2 rounded text-gray-300 text-center"
          >
            Go to Employee
          </a>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Static export compatible navigation
        </p>
      </div>
    </main>
  );
}
