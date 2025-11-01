"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateSnippet } from "@/lib/snippet-generator"

interface FormatSwitcherProps {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
}

export default function FormatSwitcher({ method, url, headers, body }: FormatSwitcherProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const requestData = { method, url, headers: headers || {}, body }

  const handleCopy = (format: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(format)
    setTimeout(() => setCopied(null), 2000)
  }

  const formats = [
    { id: "curl", label: "cURL", snippet: generateSnippet("curl", requestData) },
    { id: "http", label: "HTTP", snippet: generateSnippet("http", requestData) },
    { id: "javascript", label: "JavaScript", snippet: generateSnippet("javascript", requestData) },
    { id: "python", label: "Python", snippet: generateSnippet("python", requestData) },
    { id: "php", label: "PHP", snippet: generateSnippet("php", requestData) },
  ]

  return (
    <Card className="p-4 bg-card border-border">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">FORMAT SWITCHER</p>
        </div>

        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="bg-secondary border-b border-border w-full justify-start rounded-none grid grid-cols-5">
            {formats.map((fmt) => (
              <TabsTrigger key={fmt.id} value={fmt.id} className="text-xs">
                {fmt.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {formats.map((fmt) => (
            <TabsContent key={fmt.id} value={fmt.id} className="mt-3">
              <div className="relative">
                <pre className="bg-input p-3 rounded text-xs text-accent font-mono overflow-x-auto max-h-64 whitespace-pre-wrap break-words">
                  {fmt.snippet}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(fmt.id, fmt.snippet)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  {copied === fmt.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  )
}
