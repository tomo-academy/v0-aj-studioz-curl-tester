export async function validateAndFixCurl(curlCommand: string): Promise<{
  isValid: boolean
  issues: string[]
  suggestedFix?: string
  explanation: string
}> {
  try {
    const response = await fetch("/api/validate-curl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ curlCommand }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Validation error:", error)
      return {
        isValid: false,
        issues: ["Failed to validate curl command"],
        explanation: error.error || "Validation service error",
      }
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("[v0] Error validating curl:", error)
    return {
      isValid: false,
      issues: ["Failed to validate curl command"],
      explanation: "Validation service error",
    }
  }
}

export async function suggestCurlCorrections(curlCommand: string): Promise<string> {
  try {
    const result = await validateAndFixCurl(curlCommand)
    return result.suggestedFix || curlCommand
  } catch (error) {
    console.error("[v0] Error suggesting curl fix:", error)
    throw error
  }
}
