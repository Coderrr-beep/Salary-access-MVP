"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const loginAsEmployer = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/employer");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const loginAsEmployee = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/employee");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">

      <div className="bg-gray-800 p-8 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={loginAsEmployer}
            className="flex-1 bg-black text-white py-2 rounded"
          >
            Login as Employer
          </button>

          <button
            onClick={loginAsEmployee}
            className="flex-1 border py-2 rounded"
          >
            Login as Employee
          </button>
        </div>
      </div>
    </main>
  );
}
