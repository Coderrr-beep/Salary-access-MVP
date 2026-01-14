export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white border-b">
        <h1 className="text-xl font-bold">SalaryAccess</h1>
        <div className="space-x-6">
          <button className="text-gray-600">Employers</button>
          <button className="text-gray-600">Employees</button>
          <button className="bg-black text-white px-4 py-2 rounded">
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-10 py-20 grid grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Access your earned salary <br /> before payday
          </h2>

          <p className="text-xl text-gray-600">
            Not a loan. No interest. Employer-approved salary access
            for startups and SMEs in India.
          </p>

          <div className="flex gap-4">
            <button className="bg-black text-white px-6 py-3 rounded text-lg">
              Request Demo
            </button>
            <a
              href="/employer"
              className="border px-6 py-3 rounded text-lg"
            >
              Employer Dashboard
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Zero employer cash-flow impact • Auto-settled on payday
          </p>
        </div>

        {/* MOCK CARD */}
        <div className="bg-white p-8 rounded-xl shadow space-y-4">
          <h3 className="font-semibold text-lg">Employee Snapshot</h3>

          <div className="flex justify-between text-gray-600">
            <span>Monthly Salary</span>
            <span className="font-medium text-black">₹30,000</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Earned till date</span>
            <span className="font-medium text-green-600">₹12,000</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Available now</span>
            <span className="font-medium text-black">₹5,000</span>
          </div>

          <button className="w-full bg-black text-white py-3 rounded">
            Withdraw (Mock)
          </button>
        </div>
      </section>
    </main>
  );
}
