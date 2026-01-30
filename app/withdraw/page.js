"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  /* ---------------- AUTH & DATA ---------------- */

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        setUserData(snap.data());
      }

      const q = query(
        collection(db, "withdrawals"),
        where("userId", "==", u.uid)
      );

      const unsubWithdrawals = onSnapshot(q, (snap) => {
        const list = snap.docs.map((d) => d.data());
        setWithdrawals(list);
        setLoading(false);
      });

      return () => unsubWithdrawals();
    });

    return () => unsub();
  }, []);

  /* ---------------- CALCULATIONS ---------------- */

  if (!userData && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const monthlySalary = userData?.monthlySalary || 0;
  const daysWorked = userData?.daysWorked || 0;

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

  /* ---------------- WITHDRAW ---------------- */

  const handleWithdraw = async () => {
    setStatus("");

    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setStatus("❌ Enter a valid amount");
      return;
    }

    if (withdrawAmount > availableLimit) {
      setStatus("❌ Amount exceeds available limit");
      return;
    }

    try {
      setLoading(true);

      const repaymentDate = new Date();
      repaymentDate.setMonth(repaymentDate.getMonth() + 1);
      repaymentDate.setDate(1);

      await addDoc(collection(db, "withdrawals"), {
        userId: user.uid,
        employerId: userData.employerId, // 🔑 FIX (THIS WAS MISSING)
        amount: withdrawAmount,
        fee: 20,
        repaymentDate,
        createdAt: serverTimestamp(),
      });

      setStatus(
        `✅ ₹${withdrawAmount} withdrawal successful. ₹20 fee applied. Repayment scheduled on ${repaymentDate.toDateString()}`
      );
      setAmount("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Withdraw Salary</h1>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-2">
          <p className="text-sm text-gray-400">
            Earned till date
          </p>
          <p className="text-2xl font-bold">
            ₹{earnedSalary.toFixed(0)}
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Available to withdraw
          </p>
          <p className="text-xl font-semibold text-green-400">
            ₹{availableLimit.toFixed(0)}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Max 50% of earned salary · ₹20 flat fee
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded"
          />

          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded font-semibold"
          >
            {loading ? "Processing..." : "Withdraw Now"}
          </button>

          {status && (
            <p className="text-sm text-yellow-400">
              {status}
            </p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h2 className="font-semibold mb-2">
            ℹ️ How repayment works
          </h2>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Withdrawals are adjusted from next salary</li>
            <li>• No interest, no loans</li>
            <li>• ₹20 flat convenience fee</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
