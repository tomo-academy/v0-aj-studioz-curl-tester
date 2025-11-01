export function parseCurlCommand(curlString: string): {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
} {
  const result = {
    method: "GET",
    url: "",
    headers: {} as Record<string, string>,
    body: undefined as string | undefined,
  }

  // Remove leading/trailing whitespace and newlines
  const cleanedCurl = curlString
    .trim()
    .replace(/\\\n\s*/g, " ") // Remove line continuations (backslash newline)
    .replace(/\s+/g, " ") // Normalize whitespace

  // Check if it starts with curl
  if (!cleanedCurl.toLowerCase().startsWith("curl")) {
    throw new Error("Must be a valid curl command starting with 'curl'")
  }

  // Remove 'curl ' prefix
  let remaining = cleanedCurl.slice(4).trim()

  // Parse method (-X flag)
  const methodMatch = remaining.match(/^-X\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+/i)
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase()
    remaining = remaining.slice(methodMatch[0].length)
  }

  // Parse URL (look for the first URL-like string - either quoted or unquoted)
  // URLs can start with http://, https://, or file://
  const urlMatch = remaining.match(/^(['"`]?)([a-zA-Z]+:\/\/[^'"`\s]+)\1\s*/)
  if (urlMatch) {
    result.url = urlMatch[2]
    remaining = remaining.slice(urlMatch[0].length)
  } else {
    throw new Error("URL not found. Make sure to include a valid URL (http://, https://, etc.)")
  }

  // Parse headers (-H or --header flags)
  const headerRegex = /(?:--header|-H)\s+(['"`])([^'"]*?)\1/g
  let headerMatch
  while ((headerMatch = headerRegex.exec(remaining)) !== null) {
    const headerLine = headerMatch[2]
    const colonIndex = headerLine.indexOf(":")
    if (colonIndex > 0) {
      const key = headerLine.substring(0, colonIndex).trim()
      const value = headerLine.substring(colonIndex + 1).trim()
      if (key && value) {
        result.headers[key] = value
      }
    }
  }

  // Parse body data (-d or --data flags)
  // Handle both single-line and multi-line JSON
  const dataMatch = remaining.match(/(?:--data|-d)\s+(['"`])([\s\S]*?)\1/)
  if (dataMatch) {
    result.body = dataMatch[2].trim()
    if (!methodMatch) {
      result.method = "POST"
    }
  }

  if (!result.url) {
    throw new Error("No valid URL found in curl command")
  }

  return result
}
