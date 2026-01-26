const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require("openai");

// ⚠️ TEMPORARY: HARDCODED KEY (DO NOT COMMIT PUBLICLY)
const OPENROUTER_API_KEY = "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";

exports.aiAdvisor = onRequest(
  {
    region: "asia-south1",
  },
  async (req, res) => {
    try {
      const { message, context } = req.body;

      const client = new OpenAI({
        apiKey: OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });

      const systemPrompt = `
You are a financial wellness assistant for salaried employees in India.

RULES:
- No investment advice
- No loans or credit cards
- Only salary, withdrawals, and budgeting
- Short, clear, practical answers
`;

      const userPrompt = `
Monthly salary: ₹${context.monthlySalary}
Earned salary: ₹${context.earnedSalary}
Available to withdraw: ₹${context.availableLimit}
Days worked: ${context.daysWorked}

Question:
${message}
`;

      const completion = await client.chat.completions.create({
        model: "o3-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.4,
      });

      const aiReply =
        completion.choices?.[0]?.message?.content?.trim();

      // ✅ If AI reply exists, return it
      if (aiReply && aiReply.length > 5) {
        return res.json({ reply: aiReply });
      }

      throw new Error("Empty AI reply");

    } catch (err) {
      console.error("AI failed, using fallback:", err.message);

      const { context } = req.body;

      let reply = "";

      if (context.availableLimit >= 3000) {
        reply =
          "Yes, you can withdraw ₹3,000 safely based on your earned salary. Just keep upcoming expenses in mind before payday.";
      } else if (context.availableLimit > 0) {
        reply =
          `You can withdraw up to ₹${Math.floor(
            context.availableLimit
          )} right now. Waiting a few more days will increase your limit.`;
      } else {
        reply =
          "You don’t have any withdrawable balance yet. Continue working days to unlock early salary access.";
      }

      return res.json({ reply });
    }
  }
);
