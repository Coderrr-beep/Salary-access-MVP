"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const [employer, setEmployer] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const router = useRouter();

  /* -------- AUTH -------- */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, []);

  /* -------- FETCH EMPLOYER -------- */
  useEffect(() => {
    const fetchEmployer = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "employers"),
        where("uid", "==", user.uid)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        setEmployer(snap.docs[0].data());
      }
    };

    fetchEmployer();
  }, []);

  /* -------- FETCH EMPLOYEES -------- */
  useEffect(() => {
    if (!employer) return;

    const q = query(
      collection(db, "users"),
      where("role", "==", "employee"),
      where("employerId", "==", employer.employerId)
    );

    return onSnapshot(q, (snap) => {
      setEmployees(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
  }, [employer]);

  /* -------- FETCH WITHDRAWALS -------- */
  useEffect(() => {
    if (!employer) return;

    const q = query(
      collection(db, "withdrawals"),
      where("employerId", "==", employer.employerId)
    );

    return onSnapshot(q, (snap) => {
      setWithdrawals(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
  }, [employer]);

  if (!employer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading employer dashboard...
      </div>
    );
  }

  /* -------- CALCULATIONS -------- */

  const totalAdvanced = withdrawals.reduce(
    (sum, w) => sum + (w.amount || 0),
    0
  );

  const pendingVerifications = employees.filter(
    (e) => e.verificationStatus === "pending"
  ).length;

  const activeEmployees = employees.filter(
    (e) => e.verificationStatus === "approved"
  ).length;

  const totalEarned = employees.reduce((sum, e) => {
    const daily = (e.monthlySalary || 0) / 30;
    return sum + daily * (e.daysWorked || 0);
  }, 0);

  /* -------- ATTENDANCE -------- */

  const markPresent = async (emp) => {
    if (emp.verificationStatus !== "approved") return;

    await updateDoc(doc(db, "users", emp.id), {
      daysWorked: (emp.daysWorked || 0) + 1,
    });
  };

  return (
    <main className="min-h-screen bg-black text-white px-10 py-12">
      {/* HEADER */}
      <h1 className="text-3xl font-bold">{employer.company}</h1>
      <p className="text-gray-400 mb-6">Employer Dashboard</p>

      {/* VERIFY BUTTON */}
      <button
        onClick={() => router.push("/employer/verification")}
        className="mb-10 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
      >
        Verify Employees
      </button>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-6 mb-12">
        <Stat title="Total Employees" value={employees.length} />
        <Stat title="Active Employees" value={activeEmployees} />
        <Stat title="Pending Verifications" value={pendingVerifications} />
        <Stat title="Withdrawals" value={withdrawals.length} />
        <Stat title="Total Advanced" value={`₹${totalAdvanced}`} />
      </div>

      {/* EMPLOYER ASSURANCE */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">
          Employer Assurance
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-gray-300">
          <Assurance text="No upfront capital required" />
          <Assurance text="Salary auto-deducted on payroll day" />
          <Assurance text="Zero interest, zero loans" />
          <Assurance text="Employee-initiated withdrawals only" />
          <Assurance text="No balance-sheet or compliance risk" />
          <Assurance text="Fully auditable & transparent" />
        </div>
      </div>

      {/* MONTHLY SNAPSHOT */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">
          This Month at a Glance
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Stat
            title="Total Salary Earned"
            value={`₹${Math.round(totalEarned)}`}
          />
          <Stat
            title="Withdrawn by Employees"
            value={`₹${totalAdvanced}`}
          />
          <Stat
            title="Net Payroll Adjustment"
            value={`₹${Math.max(totalEarned - totalAdvanced, 0)}`}
          />
        </div>
      </div>

      {/* ATTENDANCE */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6">
          Attendance & Salary Sync
        </h2>

        {employees.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No employees found.
          </p>
        ) : (
          <div className="space-y-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between bg-gray-800 px-5 py-4 rounded-xl border border-gray-700"
              >
                <div>
                  <p className="font-medium">
                    {emp.name || emp.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    Days worked: {emp.daysWorked || 0}
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                      emp.verificationStatus === "approved"
                        ? "bg-green-800 text-green-300"
                        : "bg-yellow-800 text-yellow-300"
                    }`}
                  >
                    {emp.verificationStatus}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => markPresent(emp)}
                    disabled={emp.verificationStatus !== "approved"}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 disabled:opacity-50"
                  >
                    ✓ Present
                  </button>

                  <button
                    disabled
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 opacity-60 cursor-not-allowed"
                  >
                    ✗ Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ title, value }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
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
