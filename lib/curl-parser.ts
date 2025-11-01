export interface ParsedCurl {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  params: Record<string, string>
}

export function parseCurlCommand(curlCommand: string): ParsedCurl | null {
  try {
    // Remove 'curl' prefix and trim
    let cleaned = curlCommand.trim()
    if (cleaned.startsWith("curl")) {
      cleaned = cleaned.substring(4).trim()
    }

    const result: ParsedCurl = {
      method: "GET",
      url: "",
      headers: {},
      params: {},
    }

    // Extract URL (look for quoted URL or first non-flag argument)
    const urlMatch =
      cleaned.match(/"([^"]*(?:https?:\/\/|ftp:\/\/)[^"]*)"/) ||
      cleaned.match(/(?:^|\s)(['"`]?)([^\s'"`]+(?:https?:\/\/|ftp:\/\/)[^\s'"`]*)(['"`])?/)
    if (urlMatch) {
      result.url = urlMatch[1] || urlMatch[2]
    }

    // Extract method
    const methodMatch = cleaned.match(/-X\s+(\w+)/)
    if (methodMatch) {
      result.method = methodMatch[1].toUpperCase()
    }

    // Extract headers
    const headerMatches = cleaned.matchAll(/-H\s+(?:["'`]([^"'`]+)["'`]|(\S+))/g)
    for (const match of headerMatches) {
      const header = match[1] || match[2]
      const [key, ...valueParts] = header.split(":")
      const value = valueParts.join(":").trim()
      if (key && value) {
        result.headers[key.trim()] = value
      }
    }

    // Extract body
    const bodyMatch = cleaned.match(/-d\s+(?:["'`](.+?)["'`]|(\S+))/)
    if (bodyMatch) {
      result.body = bodyMatch[1] || bodyMatch[2]
    }

    // Extract data
    const dataMatch = cleaned.match(/--data\s+(?:["'`](.+?)["'`]|(\S+))/)
    if (dataMatch && !result.body) {
      result.body = dataMatch[1] || dataMatch[2]
    }

    // Extract query parameters from URL
    if (result.url && result.url.includes("?")) {
      const [baseUrl, queryString] = result.url.split("?")
      result.url = baseUrl
      const params = new URLSearchParams(queryString)
      params.forEach((value, key) => {
        result.params[key] = value
      })
    }

    return result
  } catch (error) {
    console.error("[v0] Failed to parse curl command:", error)
    return null
  }
}

export function validateCurlSyntax(curlCommand: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!curlCommand.trim()) {
    errors.push("Curl command is empty")
    return { valid: false, errors }
  }

  if (!curlCommand.includes("curl")) {
    errors.push("Command must start with 'curl'")
  }

  if (!curlCommand.match(/https?:\/\/|ftp:\/\//)) {
    errors.push("URL must contain a valid protocol (http://, https://, or ftp://)")
  }

  // Check for unclosed quotes
  const quoteCount = (curlCommand.match(/"/g) || []).length
  if (quoteCount % 2 !== 0) {
    errors.push("Unclosed quotes in command")
  }

  return { valid: errors.length === 0, errors }
}
