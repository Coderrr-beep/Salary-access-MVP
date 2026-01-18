"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      setUser(u);

      // Skip onboarding if already verified
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists() && snap.data().documentVerified) {
        router.push("/employee");
      }
    });

    return () => unsub();
  }, []);

  /* ---------------- FILE VALIDATION ---------------- */

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.type.startsWith("image/")
    ) {
      setStatus("❌ Please upload a PDF or image file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setStatus("❌ File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setStatus("");
  };

  /* ---------------- MOCK VERIFICATION (FREE) ---------------- */

  const handleUpload = async () => {
    if (!file || !user) {
      setStatus("❌ Please select a file");
      return;
    }

    setUploading(true);
    setStatus("🔍 Verifying document with AI...");

    try {
      // ⏳ Simulate AI processing delay
      await new Promise((res) => setTimeout(res, 1500));

      // ✅ Mock extracted values
      const extractedSalary = 30000;
      const extractedEmployer = "Kanper Startup";

      setStatus(
        `✅ Document verified! Extracted: Salary ₹${extractedSalary}, Employer: ${extractedEmployer}`
      );

      // ✅ Update Firestore (FREE)
      await updateDoc(doc(db, "users", user.uid), {
        documentVerified: true,
        documentVerifiedAt: new Date(),
        monthlySalary: extractedSalary,
        employerName: extractedEmployer,
        daysWorked: 0,
      });

      // ➡️ Redirect to employee dashboard
      setTimeout(() => {
        router.push("/employee");
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("❌ Verification failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Complete Your Onboarding
          </h1>
          <p className="text-gray-400">
            Upload your Offer Letter or Pay Slip to verify your employment
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              📄 Document Upload
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Our AI verifies your employment details (simulated for MVP).
            </p>

            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                {file ? (
                  <div>
                    <p className="text-green-400 mb-2">✓ File selected</p>
                    <p className="text-sm text-gray-400">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl mb-4">📎</p>
                    <p className="text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF or Image (Max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {status && (
            <div
              className={`p-4 rounded-lg ${
                status.startsWith("✅")
                  ? "bg-green-900/30 border border-green-700"
                  : status.startsWith("🔍")
                  ? "bg-blue-900/30 border border-blue-700"
                  : "bg-red-900/30 border border-red-700"
              }`}
            >
              <p className="text-sm">{status}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Processing..." : "Verify Document"}
          </button>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-300">
              🔒 Privacy & Security
            </h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Documents are handled securely</li>
              <li>• Verification is simulated for MVP</li>
              <li>• Real AI verification is part of roadmap</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
