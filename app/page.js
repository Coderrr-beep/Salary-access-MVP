"use client";

export default function HomePage() {
  const handleDemo = () => {
    alert(
      "Demo request received ✅\n\nWe will contact the employer shortly.\n"
    );
  };

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Top Nav */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">SalaryAccess</h1>

        <a
          href="/login"
          className="bg-white text-black px-5 py-2 rounded font-medium"
        >
          Login
        </a>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-10 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Access your earned salary
            <br /> before payday
          </h2>

          <p className="text-gray-400 mt-6 max-w-md">
            Not a loan. No interest. Employer-approved salary access
            for startups and SMEs in India.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleDemo}
              className="bg-black text-white px-6 py-3 rounded border border-gray-600"
            >
              Request Demo
            </button>

            <a
              href="/login"
              className="border border-gray-600 px-6 py-3 rounded text-gray-300"
            >
              Login
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Zero employer cash-flow impact • Auto-settled on payday
          </p>
        </div>

        {/* Mock Employee Card */}
        <div className="bg-white text-black rounded-xl p-8 shadow">
          <h3 className="font-semibold mb-4">Employee Snapshot</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Salary</span>
              <span>₹30,000</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Earned till date</span>
              <span>₹12,000</span>
            </div>
            <div className="flex justify-between">
              <span>Available now</span>
              <span>₹5,000</span>
            </div>
          </div>

          <button
            disabled
            className="mt-6 w-full bg-black text-white py-3 rounded opacity-80 cursor-not-allowed"
          >
            Withdraw (Mock)
          </button>
        </div>
      </section>
    </main>
  );
}
