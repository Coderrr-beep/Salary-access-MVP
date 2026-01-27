"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, []);

  /* ---------------- FETCH COMPANY ---------------- */

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const snapshot = await getDocs(collection(db, "companies"));
        snapshot.forEach((doc) => {
          setCompany({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };

    fetchCompany();
  }, []);

  /* ---------------- FETCH EMPLOYEES ---------------- */

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "employee")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setEmployees(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ---------------- FETCH WITHDRAWALS ---------------- */

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "withdrawals"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data());
        setWithdrawals(list);
      }
    );

    return () => unsub();
  }, []);

  /* ---------------- ATTENDANCE ---------------- */

  const markAttendance = async (employeeId, status, currentDaysWorked) => {
    try {
      if (status === "present") {
        await updateDoc(doc(db, "users", employeeId), {
          daysWorked: (currentDaysWorked || 0) + 1,
        });
      }
    } catch (err) {
      console.error("Attendance error:", err);
      alert("Failed to mark attendance");
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading employer dashboard...
      </div>
    );
  }

  /* ---------------- STATS (REAL DATA) ---------------- */

  const totalEmployees = employees.length;

  // Withdrawals Today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const withdrawalsToday = withdrawals.filter((w) => {
    if (!w.createdAt?.toDate) return false;
    return w.createdAt.toDate() >= today;
  }).length;

  // Total Advanced (₹)
  const totalAdvanced = withdrawals.reduce(
    (sum, w) => sum + (w.amount || 0),
    0
  );

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800 px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight">
            {company.name}
          </h1>
          <p className="text-gray-400 mt-1">
            Employer Dashboard
          </p>

          <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
            Employer Account
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-10 py-12 space-y-12">
        {/* OVERVIEW */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Company Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              subtitle="Active employees"
            />
            <StatCard
              title="Withdrawals Today"
              value={withdrawalsToday}
              subtitle="Employees accessed salary"
            />
            <StatCard
              title="Total Advanced"
              value={`₹${totalAdvanced}`}
              subtitle="Recovered on payday"
              highlight
            />
          </div>
        </div>

        {/* ASSURANCE */}
        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            Employer Assurance
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <Assurance text="No impact on company cash flow" />
            <Assurance text="Auto-deducted on payroll day" />
            <Assurance text="No loans or employer liability" />
            <Assurance text="Employee-initiated withdrawals only" />
          </div>
        </div>

        {/* ATTENDANCE */}
        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-2">
            Attendance & Salary Sync
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Mark attendance to instantly update earned salary.
          </p>

          {employees.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No employees found.
            </p>
          ) : (
            <div className="space-y-3">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between bg-gray-800/60 px-5 py-4 rounded-xl border border-gray-700"
                >
                  <div>
                    <p className="font-medium">
                      {emp.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-400">
                      Days worked: {emp.daysWorked || 0}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        markAttendance(emp.id, "present", emp.daysWorked)
                      }
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 transition"
                    >
                      ✓ Present
                    </button>

                    <button
                      onClick={() =>
                        markAttendance(emp.id, "absent", emp.daysWorked)
                      }
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 transition"
                    >
                      ✗ Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, subtitle, highlight }) {
  return (
    <div
      className={`rounded-2xl p-6 border ${
        highlight
          ? "bg-green-900/20 border-green-700"
          : "bg-gray-900/60 border-gray-800"
      }`}
    >
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function Assurance({ text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-green-400">✔</span>
      <span>{text}</span>
    </div>
  );
}
