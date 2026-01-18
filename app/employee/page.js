"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  /* ---------------- AUTH + DATA ---------------- */

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      const userSnap = await getDoc(doc(db, "users", u.uid));
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      const q = query(
        collection(db, "withdrawals"),
        where("userId", "==", u.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const unsubWithdrawals = onSnapshot(q, (snap) => {
        const list = snap.docs.map((d) => d.data());
        setWithdrawals(list);
        setLoading(false);
      });

      return () => unsubWithdrawals();
    });

    return () => unsubAuth();
  }, []);

  /* ---------------- CALCULATIONS ---------------- */

  if (!userData || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your salary dashboard...
      </div>
    );
  }

  const monthlySalary = userData.monthlySalary || 30000;
  const daysWorked = userData.daysWorked || 0;
  const dailySalary = monthlySalary / 30;
  const earnedSalary = dailySalary * daysWorked;

  const totalWithdrawn = withdrawals.reduce(
    (sum, w) => sum + (w.amount || 0),
    0
  );

  const availableLimit = Math.max(
    earnedSalary * 0.5 - totalWithdrawn,
    0
  );

  const progressPercent = Math.min(
    (earnedSalary / monthlySalary) * 100,
    100
  );

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          👋 Hi, {user.email.split("@")[0]}
        </h1>
        <p className="text-gray-400">
          {userData.employerName || "Kanper Startup"}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
        <div className="flex justify-between text-sm mb-2 text-gray-400">
          <span>Salary Earned</span>
          <span>
            ₹{earnedSalary.toFixed(0)} / ₹{monthlySalary}
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {daysWorked} days worked · ₹{dailySalary.toFixed(0)}/day
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Monthly Salary" value={`₹${monthlySalary}`} />
        <StatCard title="Earned Till Date" value={`₹${earnedSalary.toFixed(0)}`} />
        <StatCard
          title="Available to Withdraw"
          value={`₹${availableLimit.toFixed(0)}`}
          highlight
        />
      </div>

      {/* Withdraw CTA */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-2">
          Access Your Salary Early
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Withdraw up to 50% of earned salary · ₹20 flat fee · No interest
        </p>

        <button
          onClick={() => router.push("/withdraw")}
          disabled={availableLimit <= 0}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          Withdraw Now
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Repayment automatically adjusted on next payday
        </p>
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Withdrawals
        </h2>

        {withdrawals.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No withdrawals yet
          </p>
        ) : (
          <ul className="space-y-3">
            {withdrawals.map((w, i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-800 px-4 py-2 rounded"
              >
                <span>₹{w.amount}</span>
                <span className="text-gray-400 text-sm">
                  Fee ₹{w.fee || 20}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

/* ---------------- CARD ---------------- */

function StatCard({ title, value, highlight }) {
  return (
    <div
      className={`rounded-xl p-6 border ${
        highlight
          ? "bg-green-900/20 border-green-700"
          : "bg-gray-900 border-gray-700"
      }`}
    >
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}
