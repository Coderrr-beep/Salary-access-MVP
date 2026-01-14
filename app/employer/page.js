"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function EmployerDashboard() {
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    const fetchEmployer = async () => {
      const snapshot = await getDocs(collection(db, "employers"));
      snapshot.forEach((doc) => {
        setEmployer(doc.data());
      });
    };

    fetchEmployer();
  }, []);

  if (!employer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading employer data...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-gray-700 px-10 py-6">
        <h1 className="text-2xl font-bold">
          {employer.companyName}
        </h1>
        <p className="text-gray-400">
          Employer Dashboard
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-10 py-10 space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            title="Employees"
            value={employer.employeesCount}
          />
          <StatCard
            title="Subscription"
            value={
              employer.subscriptionActive ? "Active" : "Inactive"
            }
          />
          <StatCard
            title="Plan"
            value="₹50 / employee"
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl">
      <p className="text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
