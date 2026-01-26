"use client";
import { useState } from "react";

export default function AiAdvisor({ context }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi 👋 I’m your financial advisor. Ask me anything about your salary.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          context,
        }),
      });

      const data = await res.json();

      const cleanReply =
        data.reply && data.reply.trim().length > 0
          ? data.reply
          : "I’m here to help 😊 Can you rephrase your question?";

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: cleanReply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
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
          placeholder="Ask about withdrawals, salary, expenses…"
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
