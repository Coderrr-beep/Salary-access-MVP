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
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const router = useRouter();

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, []);

  /* ---------------- FETCH COMPANY ---------------- */

  const fetchCompany = async () => {
    try {
      const snapshot = await getDocs(collection(db, "companies"));
      snapshot.forEach((doc) => {
        setCompany({ id: doc.id, ...doc.data() });
      });
    } catch (err) {
      console.error("Error fetching company:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH EMPLOYEES ---------------- */

  useEffect(() => {
    fetchCompany();

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
    });

    return () => unsub();
  }, []);

  /* ---------------- MARK ATTENDANCE (CORE FIX) ---------------- */

  const markAttendance = async (employeeId, status, currentDaysWorked) => {
    try {
      if (status === "present") {
        await updateDoc(doc(db, "users", employeeId), {
          daysWorked: (currentDaysWorked || 0) + 1,
        });
      }

      setAttendanceStatus((prev) => ({
        ...prev,
        [employeeId]: status,
      }));
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance");
    }
  };

  /* ---------------- LOADING GUARD ---------------- */

  if (loading || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading employer dashboard...
      </div>
    );
  }

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-gray-700 px-10 py-6">
        <h1 className="text-3xl font-bold">{company.name}</h1>
        <p className="text-gray-400 mt-1">Employer Dashboard</p>
        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
          Employer Account
        </span>
      </header>

      <section className="max-w-6xl mx-auto px-10 py-10 space-y-10">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="Total Employees"
            value={company.employeesCount}
            subtitle="Active employees"
          />
          <Card
            title="Withdrawals Today"
            value="—"
            subtitle="Demo data"
          />
          <Card
            title="Total Advanced"
            value="—"
            subtitle="Recovered on payday"
          />
        </div>

        {/* Employer Assurance */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-4">Employer Assurance</h2>
          <ul className="space-y-3 text-gray-300">
            <li>✅ No impact on company cash flow</li>
            <li>✅ Auto-deducted on payroll day</li>
            <li>✅ No loans or employer liability</li>
            <li>✅ Employee-initiated withdrawals only</li>
          </ul>
        </div>

        {/* Attendance */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Mark Attendance</h2>

          {employees.length === 0 ? (
            <p className="text-gray-400 text-sm">No employees found.</p>
          ) : (
            <div className="space-y-3">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {emp.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-400">
                      Days worked: {emp.daysWorked || 0}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        markAttendance(
                          emp.id,
                          "present",
                          emp.daysWorked
                        )
                      }
                      className="px-4 py-2 rounded text-sm font-medium bg-green-600 text-white"
                    >
                      ✓ Present
                    </button>
                    <button
                      onClick={() =>
                        markAttendance(
                          emp.id,
                          "absent",
                          emp.daysWorked
                        )
                      }
                      className="px-4 py-2 rounded text-sm font-medium bg-gray-700 text-gray-300"
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

function Card({ title, value, subtitle }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
