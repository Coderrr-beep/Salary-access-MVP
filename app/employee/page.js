"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      snapshot.forEach((doc) => {
        setEmployee(doc.data());
      });
    };

    fetchEmployee();
  }, []);

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
