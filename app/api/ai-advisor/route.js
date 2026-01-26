import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req) {
  const { message, context } = await req.json();

  try {
    const systemPrompt = `
You are a financial wellness assistant for salaried employees in India.

RULES:
- No investment advice
- No loans or credit cards
- Only salary, withdrawal, and budgeting guidance
- Answer clearly and practically
- Max 3–4 lines
`;

    const userPrompt = `
Employee data:
Monthly salary: ₹${context.monthlySalary}
Earned salary: ₹${context.earnedSalary}
Available to withdraw: ₹${context.availableLimit}
Days worked: ${context.daysWorked}

User question:
${message}
`;

    const completion = await client.chat.completions.create({
      model: "o3-mini",           // free-tier friendly
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 200,            // IMPORTANT for free tier
      temperature: 0.4,
    });

    const aiReply =
      completion.choices?.[0]?.message?.content?.trim();

    // ✅ If AI replied properly, return it
    if (aiReply && aiReply.length > 5) {
      return new Response(
        JSON.stringify({ reply: aiReply }),
        { status: 200 }
      );
    }

    // ❗ If AI reply is empty, fall through to fallback
    throw new Error("Empty AI reply");

  } catch (err) {
    console.warn("AI unavailable, using fallback logic");

    // 🧠 SMART RULE-BASED FALLBACK
    let reply = "";

    if (context?.availableLimit >= 3000) {
      reply =
        "Yes, you can withdraw ₹3,000 safely based on your earned salary. Just keep upcoming expenses in mind before payday.";
    } else if (context?.availableLimit > 0) {
      reply =
        `You can withdraw up to ₹${Math.floor(
          context.availableLimit
        )} right now. Waiting a few more days will increase your limit.`;
    } else {
      reply =
        "You don’t have any withdrawable balance yet. Continue working days to unlock early salary access.";
    }

    return new Response(
      JSON.stringify({ reply }),
      { status: 200 }
    );
  }
}
