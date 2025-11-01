export function highlightJSON(json: string): { spans: Array<{ text: string; type: string }> } {
  const spans: Array<{ text: string; type: string }> = []
  let current = ""
  let i = 0

  while (i < json.length) {
    const char = json[i]

    // Skip whitespace
    if (/\s/.test(char)) {
      if (current) {
        classifyToken(current, spans)
        current = ""
      }
      spans.push({ text: char, type: "whitespace" })
      i++
      continue
    }

    // String
    if (char === '"') {
      if (current) {
        classifyToken(current, spans)
        current = ""
      }
      let str = '"'
      i++
      while (i < json.length && json[i] !== '"') {
        if (json[i] === "\\") {
          str += json[i] + json[i + 1]
          i += 2
        } else {
          str += json[i]
          i++
        }
      }
      str += '"'
      spans.push({ text: str, type: "string" })
      i++
      continue
    }

    // Punctuation
    if (/[{}[\]:,]/.test(char)) {
      if (current) {
        classifyToken(current, spans)
        current = ""
      }
      spans.push({ text: char, type: "punctuation" })
      i++
      continue
    }

    current += char
    i++
  }

  if (current) {
    classifyToken(current, spans)
  }

  return { spans }
}

function classifyToken(token: string, spans: Array<{ text: string; type: string }>): void {
  if (token === "true" || token === "false") {
    spans.push({ text: token, type: "boolean" })
  } else if (token === "null") {
    spans.push({ text: token, type: "null" })
  } else if (/^-?\d+\.?\d*(?:[eE][+-]?\d+)?$/.test(token)) {
    spans.push({ text: token, type: "number" })
  } else {
    spans.push({ text: token, type: "key" })
  }
}

export function syntaxHighlightClass(type: string): string {
  const classes: Record<string, string> = {
    string: "text-green-400",
    number: "text-blue-400",
    boolean: "text-yellow-400",
    null: "text-red-400",
    key: "text-cyan-400",
    punctuation: "text-gray-300",
    whitespace: "",
  }
  return classes[type] || ""
}
