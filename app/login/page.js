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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        setError("User profile not found. Please sign up.");
        setLoading(false);
        return;
      }

      const userData = snap.data();

      if (userData.role === "employee") {
        router.push("/employee");
      } else if (userData.role === "employer") {
        router.push("/employer");
      } else {
        setError("Invalid role assigned.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP (MVP) ---------------- */

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      // Create user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        role, // employee or employer
        employerName: role === "employee" ? "Kanper Startup" : null,
        employerId: role === "employee" ? "kanper" : null,
        monthlySalary: role === "employee" ? 30000 : null,
        daysWorked: 0,
        documentVerified: role === "employee" ? false : true,
        createdAt: new Date(),
      });

      if (role === "employee") {
        router.push("/onboarding");
      } else {
        router.push("/employer");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Salary Access Login
        </h1>

        <div className="space-y-4">
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

          {/* Role selector (MVP only) */}
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "employee"}
                onChange={() => setRole("employee")}
              />
              Employee
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "employer"}
                onChange={() => setRole("employer")}
              />
              Employer
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full border border-gray-600 py-2 rounded font-semibold"
          >
            {loading ? "Loading..." : "Sign Up (MVP)"}
          </button>
        </div>
      </div>
    </div>
  );
}
