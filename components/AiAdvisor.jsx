"use client";
import { useState } from "react";

export default function AiAdvisor({ context }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi 👋 I’m your financial advisor. Ask me anything about your salary or withdrawals.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- INTENT DETECTION ----------
  function detectIntent(text) {
    const lower = text.toLowerCase();

    if (
      lower.includes("withdraw") ||
      lower.includes("take out") ||
      lower.includes("get") ||
      lower.includes("early")
    ) {
      return "withdraw";
    }

    if (
      lower.includes("how much") ||
      lower.includes("balance") ||
      lower.includes("available") ||
      lower.includes("earned")
    ) {
      return "balance";
    }

    if (
      lower.includes("wait") ||
      lower.includes("should i") ||
      lower.includes("okay") ||
      lower.includes("advice")
    ) {
      return "advice";
    }

    return "general";
  }

  // ---------- AMOUNT EXTRACTION ----------
  function extractAmount(text) {
    const match = text.replace(/,/g, "").match(/₹?\s?(\d{3,6})/);
    return match ? parseInt(match[1], 10) : null;
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    const intent = detectIntent(userText);
    const askedAmount = extractAmount(userText);

    // ---------- TRY AI FIRST ----------
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Salary Access MVP",
        },
        body: JSON.stringify({
          model: "o3-mini",
          max_tokens: 120,
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: `
You are a financial wellness assistant for salaried employees in India.

RULES:
- No investment advice
- No loans or credit cards
- Only salary, withdrawals, budgeting
- Be short and practical
`,
            },
            {
              role: "user",
              content: `
Monthly salary: ₹${context.monthlySalary}
Earned salary: ₹${context.earnedSalary}
Available to withdraw: ₹${context.availableLimit}
Days worked: ${context.daysWorked}

Question:
${userText}
`,
            },
          ],
        }),
      });

      const data = await res.json();
      const aiReply = data?.choices?.[0]?.message?.content?.trim();

      if (aiReply && aiReply.length > 5) {
        setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
        setLoading(false);
        return;
      }

      throw new Error("Empty AI reply");
    } catch (err) {
      // ---------- SMART RULE-BASED FALLBACK ----------
      let reply = "";

      if (intent === "withdraw") {
        if (askedAmount) {
          if (context.availableLimit >= askedAmount) {
            reply = `Yes, you can withdraw ₹${askedAmount} safely based on your earned salary. Just keep upcoming expenses in mind.`;
          } else if (context.availableLimit > 0) {
            reply = `You can withdraw up to ₹${Math.floor(
              context.availableLimit
            )} right now. You may want to wait a few more days to access ₹${askedAmount}.`;
          } else {
            reply =
              "You don’t have any withdrawable balance yet. Continue working days to unlock early salary access.";
          }
        } else {
          reply = `You can currently withdraw up to ₹${Math.floor(
            context.availableLimit
          )}. Let me know how much you’re planning to withdraw.`;
        }
      } else if (intent === "balance") {
        reply = `You’ve earned ₹${Math.floor(
          context.earnedSalary
        )} so far this month. You can withdraw up to ₹${Math.floor(
          context.availableLimit
        )} right now.`;
      } else if (intent === "advice") {
        reply =
          context.availableLimit > 0
            ? "If it’s not urgent, waiting a few more days can increase how much you can access. Withdraw only what you really need."
            : "It’s better to wait for a few more workdays before withdrawing, so you have a higher available balance.";
      } else {
        reply = `You’ve earned ₹${Math.floor(
          context.earnedSalary
        )} so far. Your current withdrawable amount is ₹${Math.floor(
          context.availableLimit
        )}.`;
      }

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mt-10">
      <h2 className="text-xl font-semibold mb-4">
        🤖 AI Financial Advisor
      </h2>

      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm p-3 rounded max-w-[80%] ${
              m.role === "ai"
                ? "bg-gray-800 text-gray-200"
                : "bg-green-700 text-black ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <p className="text-xs text-gray-400">Thinking…</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about withdrawals, balance, or advice…"
          className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-white text-black px-4 rounded font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        This is general financial guidance, not professional advice.
      </p>
    </div>
  );
}
