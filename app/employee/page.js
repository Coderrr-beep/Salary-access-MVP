"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      snapshot.forEach((doc) => {
        setEmployee({ id: doc.id, ...doc.data() });
      });
    };

    fetchEmployee();
  }, []);

  const handleWithdraw = async () => {
    if (!employee || employee.available < 1000) return;

    setLoading(true);

    const withdrawAmount = 1000;

    // 1️⃣ Write withdrawal record
    await addDoc(collection(db, "withdrawals"), {
      employeeName: employee.name,
      amount: withdrawAmount,
      createdAt: serverTimestamp(),
    });

    // 2️⃣ Update local state (demo-safe)
    setEmployee((prev) => ({
      ...prev,
      available: prev.available - withdrawAmount,
    }));

    setLoading(false);
    alert("Withdrawal successful ✅");
  };

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading employee data...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-gray-700 px-10 py-6">
        <h1 className="text-2xl font-bold">
          Welcome, {employee.name}
        </h1>
        <p className="text-gray-400">
          Employee Dashboard
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-10 py-10 space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <Card title="Monthly Salary" value={`₹${employee.salary}`} />
          <Card title="Earned" value={`₹${employee.earned}`} />
          <Card title="Available" value={`₹${employee.available}`} />
        </div>

        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="bg-white text-black px-6 py-3 rounded font-medium"
        >
          {loading ? "Processing..." : "Withdraw ₹1000"}
        </button>
      </section>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl">
      <p className="text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
