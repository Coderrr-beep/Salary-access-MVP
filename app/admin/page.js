"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    demoRequests: 0,
    acceptedEmployers: 0,
    activeEmployers: 0,
    totalWithdrawn: 0,
    revenue: 0,
  });

  const [recentEmployers, setRecentEmployers] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      /* ================= DEMO REQUESTS ================= */
      const demoSnap = await getDocs(
        query(collection(db, "demoRequests"), orderBy("createdAt", "desc"))
      );

      const demoRequests = demoSnap.docs.map((d) => d.data());
      const accepted = demoRequests.filter(
        (r) => r.status === "accepted"
      ).length;

      /* ================= EMPLOYERS ================= */
      const employerSnap = await getDocs(
        query(collection(db, "employers"), orderBy("createdAt", "desc"))
      );

      const employers = employerSnap.docs.map((d) => d.data());

      const activeEmployers = employers.filter(
        (e) => e.status === "active"
      ).length;

      const totalWithdrawn = employers.reduce(
        (sum, e) => sum + (e.totalWithdrawn || 0),
        0
      );

      const revenue = totalWithdrawn > 0
        ? Math.floor(totalWithdrawn / 1000) * 20
        : 0;

      setStats({
        demoRequests: demoRequests.length,
        acceptedEmployers: accepted,
        activeEmployers,
        totalWithdrawn,
        revenue,
      });

      setRecentEmployers(employers.slice(0, 5));
      setRecentRequests(demoRequests.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-white px-10 py-16">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">
            SalarySync platform overview
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/demo-requests" className="adminBtn">
            Demo Requests
          </Link>
          <Link href="/admin/employers" className="adminBtn">
            Employers
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPI title="Demo Requests" value={stats.demoRequests} />
        <KPI title="Accepted Startups" value={stats.acceptedEmployers} />
        <KPI title="Active Employers" value={stats.activeEmployers} />
        <KPI title="Total Withdrawn" value={`₹${stats.totalWithdrawn}`} />
        <KPI title="Platform Revenue" value={`₹${stats.revenue}`} />
      </div>

      {/* TABLES */}
      <div className="max-w-7xl mx-auto mt-14 grid lg:grid-cols-2 gap-10">
        {/* RECENT EMPLOYERS */}
        <Section title="Recent Employers">
          {loading ? (
            <Loader />
          ) : recentEmployers.length === 0 ? (
            <Empty />
          ) : (
            recentEmployers.map((e, i) => (
              <Row
                key={i}
                left={e.company}
                right={`₹${e.totalWithdrawn || 0}`}
              />
            ))
          )}
        </Section>

        {/* RECENT DEMO REQUESTS */}
        <Section title="Recent Demo Requests">
          {loading ? (
            <Loader />
          ) : recentRequests.length === 0 ? (
            <Empty />
          ) : (
            recentRequests.map((r, i) => (
              <Row
                key={i}
                left={r.company}
                right={r.status?.toUpperCase() || "PENDING"}
              />
            ))
          )}
        </Section>
      </div>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function KPI({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-700 rounded-2xl p-6"
    >
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ left, right }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-300">{left}</span>
      <span className="font-medium">{right}</span>
    </div>
  );
}

function Loader() {
  return (
    <div className="h-20 bg-gray-800 rounded-lg animate-pulse" />
  );
}

function Empty() {
  return (
    <p className="text-sm text-gray-500">No data available</p>
  );
}
