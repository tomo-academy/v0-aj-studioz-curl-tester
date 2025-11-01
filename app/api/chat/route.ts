import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const apiKey = process.env.API_KEY_GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 })
    }

    console.log("[v0] Sending chat request to Groq API with messages:", messages.length)

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a helpful API and cURL expert assistant for AJ STUDIOZ cURL Tester. You help users with:
- Writing and debugging curl commands
- Explaining HTTP methods (GET, POST, PUT, DELETE, PATCH, etc.)
- Understanding API authentication (Bearer tokens, API keys, OAuth)
- Providing examples of popular API requests (OpenAI, Anthropic Claude, GitHub, Stripe, Google APIs, AWS, etc.)
- Explaining API response codes and errors
- Converting between different request formats
- Best practices for API integration

Provide clear, concise, and accurate responses. When showing curl examples, format them properly with line breaks. Always be helpful and encouraging.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Groq API error:", data)
      return NextResponse.json({ error: data.error?.message || "Chat API error" }, { status: response.status })
    }

    console.log("[v0] Chat response received successfully")
    return NextResponse.json({
      content: data.choices[0]?.message?.content || "No response generated",
    })
  } catch (error) {
    console.error("[v0] Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
