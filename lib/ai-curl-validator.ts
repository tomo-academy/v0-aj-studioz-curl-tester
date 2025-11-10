export async function validateAndFixCurl(curlCommand: string): Promise<{
  isValid: boolean
  issues: string[]
  suggestedFix?: string
  explanation: string
}> {
  // Client-side validation and auto-fixing
  const issues: string[] = []
  let fixedCurl = curlCommand.trim()
  let hasChanges = false

  // Check if command starts with curl
  if (!fixedCurl.toLowerCase().startsWith('curl')) {
    issues.push("Command doesn't start with 'curl'")
    fixedCurl = `curl ${fixedCurl}`
    hasChanges = true
  }

  // Fix common URL issues
  if (!/https?:\/\//.test(fixedCurl)) {
    const urlMatch = fixedCurl.match(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (urlMatch) {
      issues.push("URL missing protocol (http/https)")
      fixedCurl = fixedCurl.replace(urlMatch[0], `https://${urlMatch[0]}`)
      hasChanges = true
    }
  }

  // Fix header formatting
  if (fixedCurl.includes('-H') && !fixedCurl.match(/-H\s+["'][^"']*["']/)) {
    issues.push("Headers should be quoted")
    fixedCurl = fixedCurl.replace(/-H\s+([^"'\s][^"'\n]*)/g, (match, header) => {
      if (!header.startsWith('"') && !header.startsWith("'")) {
        return match.replace(header, `"${header.trim()}"`)
      }
      return match
    })
    hasChanges = true
  }

  // Add missing quotes around URLs with special characters
  const urlMatch = fixedCurl.match(/curl[^"'\n]*?(https?:\/\/[^\s"']+)/);
  if (urlMatch && urlMatch[1] && (urlMatch[1].includes('&') || urlMatch[1].includes('?'))) {
    if (!fixedCurl.includes(`"${urlMatch[1]}"`) && !fixedCurl.includes(`'${urlMatch[1]}'`)) {
      issues.push("URL with parameters should be quoted")
      fixedCurl = fixedCurl.replace(urlMatch[1], `"${urlMatch[1]}"`)
      hasChanges = true
    }
  }

  // Fix method formatting
  if (/-X\s+[A-Z]+\s+/.test(fixedCurl) && !/-X\s+["'][A-Z]+["']/.test(fixedCurl)) {
    fixedCurl = fixedCurl.replace(/-X\s+([A-Z]+)/, '-X "$1"')
    hasChanges = true
  }

  // Remove excessive whitespace and line breaks
  if (/\s{2,}/.test(fixedCurl)) {
    issues.push("Excessive whitespace detected")
    fixedCurl = fixedCurl.replace(/\s+/g, ' ').trim()
    hasChanges = true
  }

  // Add common headers if missing for POST/PUT requests
  if (/(POST|PUT|PATCH)/.test(fixedCurl) && !/-H.*[Cc]ontent-[Tt]ype/.test(fixedCurl)) {
    issues.push("POST/PUT request missing Content-Type header")
    fixedCurl += ' -H "Content-Type: application/json"'
    hasChanges = true
  }

  const isValid = issues.length === 0
  
  return {
    isValid,
    issues,
    suggestedFix: hasChanges ? fixedCurl : undefined,
    explanation: isValid 
      ? "✅ Your cURL command looks good! No issues found."
      : `🔧 Found ${issues.length} issue(s) and generated an auto-fix. The fixes include proper quoting, protocol addition, header formatting, and common best practices.`
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
