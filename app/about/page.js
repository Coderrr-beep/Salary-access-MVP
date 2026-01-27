"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-10 py-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        About SalarySync
      </h1>

      <p className="text-gray-400 mb-6 leading-relaxed">
        SalarySync is a financial wellness platform that modernizes the Indian
        payroll system by enabling Earned Wage Access (EWA). It allows employees
        to access their accrued salary in real time — anytime during the month —
        without loans or interest.
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            🚨 The Problem
          </h2>
          <p className="text-gray-400">
            Payroll is monthly, but expenses are daily. This liquidity mismatch
            forces employees to rely on predatory loans during emergencies.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            💡 Our Solution
          </h2>
          <p className="text-gray-400">
            SalarySync treats salary as a real-time stream. Employees can safely
            withdraw a portion of what they have already earned, with a flat fee
            and zero interest.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            ⚙️ Technology
          </h2>
          <p className="text-gray-400">
            Built using Next.js, Firebase, and Google Cloud-ready architecture,
            SalarySync provides real-time syncing, secure authentication, and
            AI-powered financial guidance.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">
            🌱 Vision
          </h2>
          <p className="text-gray-400">
            Our mission is to reduce financial stress and build the financial
            infrastructure for a more resilient and inclusive workforce in India.
          </p>
        </div>
      </section>
    </main>
  );
}
