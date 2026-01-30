"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      // 🔧 AUTO-FIX missing profile (IMPORTANT)
      if (!snap.exists()) {
        await setDoc(ref, {
          uid,
          email,
          role: "employer", // fallback for demo
          createdAt: new Date(),
        });
      }

      const userData = (await getDoc(ref)).data();

      if (userData.role === "employee") router.push("/employee");
      else router.push("/employer");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        role,
        employerId: null,
        verificationStatus: "not_started",
        createdAt: new Date(),
      });

      if (role === "employee") router.push("/onboarding");
      else router.push("/employer");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          SalarySync Login
        </h1>

        <div className="space-y-4">
          {role === "employee" && (
            <input
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-4 text-sm">
            <label>
              <input
                type="radio"
                checked={role === "employee"}
                onChange={() => setRole("employee")}
              />{" "}
              Employee
            </label>
            <label>
              <input
                type="radio"
                checked={role === "employer"}
                onChange={() => setRole("employer")}
              />{" "}
              Employer
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-white text-black py-2 rounded font-semibold"
          >
            Login
          </button>

          <button
            onClick={handleSignup}
            className="w-full border border-gray-600 py-2 rounded font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
