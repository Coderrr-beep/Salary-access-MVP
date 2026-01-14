"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthenticated(true); // ✅ auth success
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md space-y-5">
        <h1 className="text-2xl font-bold text-center">
          Secure Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={authenticated}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={authenticated}
        />

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {/* Login Button */}
        {!authenticated && (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded font-medium"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        )}

        {/* Role Selection (ONLY after auth) */}
        {authenticated && (
          <>
            <p className="text-center text-sm text-gray-400">
              Select your role
            </p>

            <div className="flex gap-3">
              <a
                href="/employer/"
                className="flex-1 bg-black text-white py-2 rounded text-center border border-gray-600"
              >
                Employer Dashboard
              </a>

              <a
                href="/employee/"
                className="flex-1 border border-gray-600 py-2 rounded text-gray-300 text-center"
              >
                Employee Dashboard
              </a>
            </div>
          </>
        )}

        <p className="text-xs text-gray-500 text-center">
          Authentication required to continue
        </p>
      </div>
    </main>
  );
}
