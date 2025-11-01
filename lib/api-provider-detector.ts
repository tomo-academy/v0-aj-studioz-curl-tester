export interface APIProviderInfo {
  brand: string
  provider: string
  model?: string
  endpoint?: string
  region?: string
  documentationUrl?: string
}

export function detectAPIProvider(
  url: string,
  headers: Record<string, any> = {},
  responseData: any = {},
): APIProviderInfo {
  const urlLower = url.toLowerCase()
  const headerKeys = Object.keys(headers).map((k) => k.toLowerCase())

  // Anthropic
  if (urlLower.includes("api.anthropic.com")) {
    const model =
      extractFromHeaders(headers, ["x-model", "anthropic-model"]) ||
      extractFromBody(responseData, ["model"]) ||
      "claude"
    return {
      brand: "Anthropic",
      provider: "Claude AI",
      model: model,
      endpoint: extractEndpoint(url),
      region: "Global",
      documentationUrl: "https://docs.anthropic.com",
    }
  }

  // OpenAI
  if (urlLower.includes("api.openai.com")) {
    const model = extractFromHeaders(headers, ["openai-model"]) || extractFromBody(responseData, ["model"]) || "gpt"
    return {
      brand: "OpenAI",
      provider: "GPT API",
      model: model,
      endpoint: extractEndpoint(url),
      region: "Global",
      documentationUrl: "https://platform.openai.com/docs",
    }
  }

  // GitHub
  if (urlLower.includes("api.github.com")) {
    return {
      brand: "GitHub",
      provider: "GitHub REST API",
      endpoint: extractEndpoint(url),
      region: "Global",
      documentationUrl: "https://docs.github.com/api",
    }
  }

  // Stripe
  if (urlLower.includes("api.stripe.com")) {
    return {
      brand: "Stripe",
      provider: "Stripe API",
      endpoint: extractEndpoint(url),
      region: "Global",
      documentationUrl: "https://stripe.com/docs/api",
    }
  }

  // Google APIs
  if (urlLower.includes("googleapis.com")) {
    return {
      brand: "Google",
      provider: "Google APIs",
      endpoint: extractEndpoint(url),
      region: "Global",
      documentationUrl: "https://developers.google.com",
    }
  }

  // AWS
  if (urlLower.includes("amazonaws.com")) {
    const region = extractAWSRegion(url)
    return {
      brand: "AWS",
      provider: "Amazon Web Services",
      endpoint: extractEndpoint(url),
      region: region || "Global",
      documentationUrl: "https://docs.aws.amazon.com",
    }
  }

  // Azure
  if (urlLower.includes("azure.com")) {
    return {
      brand: "Microsoft Azure",
      provider: "Azure Services",
      endpoint: extractEndpoint(url),
      region: "Global",
      documentationUrl: "https://docs.microsoft.com/azure",
    }
  }

  // Default
  return {
    brand: extractBrandFromUrl(url),
    provider: "Custom API",
    endpoint: extractEndpoint(url),
    region: "Unknown",
    documentationUrl: undefined,
  }
}

function extractFromHeaders(headers: Record<string, any>, keys: string[]): string | undefined {
  for (const key of keys) {
    for (const [headerKey, headerValue] of Object.entries(headers)) {
      if (headerKey.toLowerCase() === key) {
        return String(headerValue)
      }
    }
  }
  return undefined
}

function extractFromBody(data: any, keys: string[]): string | undefined {
  if (!data || typeof data !== "object") return undefined

  for (const key of keys) {
    if (data[key]) {
      return String(data[key])
    }
  }
  return undefined
}

function extractEndpoint(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
      .split("/")
      .filter((p) => p)
      .slice(0, 3)
      .join("/")
    return `/${pathname}`
  } catch {
    return url
  }
}

function extractBrandFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.split(".").slice(-2).join(".")
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return "API Provider"
  }
}

function extractAWSRegion(url: string): string | undefined {
  const regionMatch = url.match(/\.([\w-]+)\.amazonaws\.com/)
  return regionMatch ? regionMatch[1] : undefined
}
