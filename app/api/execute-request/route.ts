import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { method, url, headers, body } = await request.json()

    // Validate inputs
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    if (!method) {
      return NextResponse.json({ error: "Method is required" }, { status: 400 })
    }

    const startTime = Date.now()

    // Build request options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "User-Agent": "AJ-STUDIOZ-API-CLIENT",
        ...headers,
      },
    }

    // Add body if present
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = body
    }

    // Execute the request
    const response = await fetch(url, fetchOptions)
    const responseBody = await response.text()
    const endTime = Date.now()
    const duration = endTime - startTime

    // Try to parse as JSON, fallback to text
    let parsedBody: any
    try {
      parsedBody = JSON.parse(responseBody)
    } catch {
      parsedBody = responseBody
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      data: parsedBody,
      time: `${duration}ms`,
      size: responseBody.length,
      success: response.ok,
    })
  } catch (error) {
    console.error("[execute-request]", error)
    return NextResponse.json(
      {
        error: "Failed to execute request",
        errorDetails: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
