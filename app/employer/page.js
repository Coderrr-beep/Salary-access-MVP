"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function EmployerDashboard() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const snapshot = await getDocs(collection(db, "companies"));
      snapshot.forEach((doc) => {
        setCompany({ id: doc.id, ...doc.data() });
      });
      setLoading(false);
    };

    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading employer dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Header */}
      <header className="border-b border-gray-700 px-10 py-6">
        <h1 className="text-3xl font-bold">
          {company.name}
        </h1>
        <p className="text-gray-400 mt-1">
          Employer Dashboard
        </p>

        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
          Employer Account
        </span>
      </header>

      {/* Main Content */}
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
            value="2"
            subtitle="Employees used early access"
          />
          <Card
            title="Total Advanced"
            value="₹2,000"
            subtitle="Recovered on payday"
          />
        </div>

        {/* Employer Assurance */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            Employer Assurance
          </h2>

          <ul className="space-y-3 text-gray-300">
            <li>✅ No impact on company cash flow</li>
            <li>✅ Salary advances auto-deducted on payroll day</li>
            <li>✅ No loans, no interest, no liability</li>
            <li>✅ Fully employee-driven withdrawals</li>
          </ul>
        </div>

        {/* Recent Withdrawals (Mock Table) */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            Recent Withdrawals
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-3 text-left">Employee</th>
                  <th className="py-3 text-left">Amount</th>
                  <th className="py-3 text-left">Date</th>
                  <th className="py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-3">Kanishk</td>
                  <td className="py-3">₹1,000</td>
                  <td className="py-3">Today</td>
                  <td className="py-3 text-green-400">Approved</td>
                </tr>
                <tr>
                  <td className="py-3">Aryan</td>
                  <td className="py-3">₹1,000</td>
                  <td className="py-3">Today</td>
                  <td className="py-3 text-green-400">Approved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Controls (UI only) */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            Employer Controls
          </h2>

          <div className="flex gap-4">
            <button
              disabled
              className="px-6 py-3 rounded-lg border border-gray-600 text-gray-400 cursor-not-allowed"
            >
              Pause Withdrawals (Coming Soon)
            </button>

            <button
              disabled
              className="px-6 py-3 rounded-lg border border-gray-600 text-gray-400 cursor-not-allowed"
            >
              Set Max Limit (Coming Soon)
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}

function Card({ title, value, subtitle }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow hover:shadow-md transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
