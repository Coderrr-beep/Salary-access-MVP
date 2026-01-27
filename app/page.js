"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const handleDemo = () => {
    alert("Demo request received ✅\n\nWe’ll reach out shortly.");
  };

  return (
    <main className="min-h-screen bg-background text-white overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-10 py-4 flex items-center justify-between">
          {/* LEFT: BRAND (ONLY ONE LOGO) */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent"
          >
            SalarySync
          </motion.div>

          {/* RIGHT: NAV LINKS */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition"
            >
              About Us
            </Link>

            <Link
              href="/login"
              className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:scale-105 transition"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-10 py-28 grid md:grid-cols-2 gap-20 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Your salary,
            <br />
            <span className="text-green-400">available every day</span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-lg text-lg leading-relaxed">
            SalarySync lets employees access the money they’ve already earned.
            No loans. No interest. Zero employer risk.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDemo}
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold shadow-xl"
            >
              Request Demo
            </motion.button>

            <p className="text-sm text-gray-500 mt-4">
              Built for startups & SMEs • Auto-settled on payday
            </p>
          </div>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />

          <div className="relative bg-white text-black rounded-2xl p-8 shadow-2xl">
            <h3 className="font-semibold text-lg mb-6">
              Employee Snapshot
            </h3>

            <div className="space-y-3 text-sm">
              <Row label="Monthly Salary" value="₹30,000" />
              <Row label="Earned till date" value="₹12,000" highlight />
              <Row label="Available now" value="₹5,000" />
            </div>

            <button
              disabled
              className="mt-8 w-full bg-black text-white py-3 rounded-lg opacity-80 cursor-not-allowed"
            >
              Withdraw (Demo)
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Flat ₹20 fee • No interest • No debt
            </p>
          </div>
        </motion.div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="border-t border-gray-800 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-10 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Why SalarySync?
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Payroll runs monthly, but life runs daily. SalarySync bridges this
            gap by turning salary into a real-time stream — empowering workers
            without pushing them into debt.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Feature title="Zero Interest" desc="Access your own earned money" />
            <Feature title="Real-Time Sync" desc="Instant balance updates" />
            <Feature title="Employer Safe" desc="No cash-flow impact" />
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-10 py-10 text-sm text-gray-400">
          <p className="text-white font-semibold">SalarySync</p>
          <p className="mt-2">
            Team: Kanishk, Aryan, Manya, Paresha, Animish
          </p>
          <p className="mt-2">📞 2354677285</p>
          <p>✉️ GFG@gmail.com</p>
          <p className="mt-4 text-xs text-gray-500">
            Hackathon MVP • FinTech for Viksit Bharat
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ===== Helper Components ===== */

function Row({ label, value, highlight }) {
  return (
    <div className={`flex justify-between ${highlight ? "text-green-600 font-medium" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
