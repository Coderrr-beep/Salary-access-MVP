import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "SalarySync",
  description: "Earned Wage Access for Viksit Bharat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* Top Navbar */}
        <header className="w-full border-b border-gray-800 px-8 py-4 flex items-center justify-between">
          {/* App Name */}
          <Link href="/" className="text-xl font-bold">
            SalarySync
          </Link>

          {/* Right Actions */}
          <nav className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-gray-300 hover:text-white"
            >
              About Us
            </Link>

            <Link
              href="/"
              className="px-4 py-2 text-sm rounded bg-white text-black font-semibold hover:bg-gray-200"
            >
              Home
            </Link>
          </nav>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
