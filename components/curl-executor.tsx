"use client"

import { useState, useRef } from "react"
import { Copy, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { parseCurlCommand } from "@/lib/curl-parser-new"
import CurlValidatorModal from "./curl-validator-modal"

interface CurlExecutorProps {
  onResponse: (response: any) => void
  onLoadingChange: (isLoading: boolean) => void
  onError?: (error: string | null) => void
  onRequestData?: (data: { method: string; url: string; headers: Record<string, string> }) => void
}

export default function CurlExecutor({ onResponse, onLoadingChange, onError, onRequestData }: CurlExecutorProps) {
  const [curlCommand, setCurlCommand] = useState(
    'curl -X GET "https://api.github.com/users/github" \\\n  -H "Accept: application/vnd.github.v3+json"',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [showValidatorModal, setShowValidatorModal] = useState(false)
  const curlInputRef = useRef<HTMLTextAreaElement>(null)

  const handleCurlInput = (value: string) => {
    setCurlCommand(value)
    setParseError(null)
  }

  const handleExecute = async () => {
    try {
      setParseError(null)
      const parsed = parseCurlCommand(curlCommand)

      if (!parsed.url.trim()) {
        alert("Please enter a valid URL")
        return
      }

      setIsLoading(true)
      onLoadingChange(true)

      onRequestData?.({
        method: parsed.method,
        url: parsed.url,
        headers: parsed.headers || {},
      })

      const startTime = performance.now()

      const response = await fetch("/api/execute-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: parsed.method,
          url: parsed.url,
          headers: parsed.headers || {},
          body: parsed.body || undefined,
        }),
      })

      const data = await response.json()
      const endTime = performance.now()

      onResponse({
        ...data,
        time: `${Math.round(endTime - startTime)}ms`,
      })
      onError?.(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setParseError(errorMessage)
      onResponse({
        error: "Request failed",
        errorDetails: errorMessage,
      })
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
      onLoadingChange(false)
    }
  }

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand)
    alert("Copied to clipboard!")
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* cURL Preview Area - Top */}
      <div className="flex-1 border-b border-border bg-card/50 overflow-hidden flex flex-col min-h-0">
        <div className="p-2 md:p-3 lg:p-4 border-b border-border bg-card flex-shrink-0">
          <label className="text-xs font-semibold text-muted-foreground">cURL Preview</label>
        </div>
        <div className="flex-1 overflow-y-auto p-2 md:p-3 lg:p-4 min-h-0">
          <Card className="p-2 md:p-3 lg:p-4 bg-input border-border h-full min-h-[120px] md:min-h-[150px]">
            <pre className="text-xs md:text-sm text-accent font-mono overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
              {curlCommand}
            </pre>
          </Card>
        </div>
      </div>

      {/* cURL Input Area - Bottom */}
      <div className="p-2 md:p-3 lg:p-4 border-t border-border bg-card flex-shrink-0">
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Enter your cURL command</label>
        <div className="flex gap-2 flex-col">
          <textarea
            ref={curlInputRef}
            value={curlCommand}
            onChange={(e) => handleCurlInput(e.target.value)}
            placeholder="curl -X GET https://api.example.com"
            className="w-full min-h-16 md:min-h-20 lg:min-h-24 p-2 md:p-3 bg-input border border-border rounded text-foreground placeholder-muted-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation mobile-input mobile-text-select"
            style={{ 
              fontSize: '16px', 
              lineHeight: '1.4',
              WebkitAppearance: 'none',
              WebkitBorderRadius: '0.375rem'
            }}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {parseError && <p className="text-xs text-destructive mt-1">{parseError}</p>}
          <div className="flex gap-1.5 md:gap-2 flex-col sm:flex-row mt-2">
            <Button onClick={copyCurl} variant="outline" size="sm" className="gap-1.5 bg-transparent text-xs h-8 md:h-9">
              <Copy className="w-3 h-3" />
              Copy
            </Button>
            <Button
              onClick={() => setShowValidatorModal(true)}
              variant="outline"
              size="sm"
              className="gap-1.5 bg-transparent text-xs border-yellow-600 text-yellow-500 hover:bg-yellow-500/10 h-8 md:h-9"
            >
              <Sparkles className="w-3 h-3" />
              AI Check
            </Button>
            <Button
              onClick={handleExecute}
              disabled={isLoading}
              size="sm"
              className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none text-xs h-8 md:h-9 font-medium"
            >
              <Send className="w-3 h-3" />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Validator Modal */}
      <CurlValidatorModal
        curlCommand={curlCommand}
        isOpen={showValidatorModal}
        onClose={() => setShowValidatorModal(false)}
        onAcceptSuggestion={(fixedCurl) => setCurlCommand(fixedCurl)}
      />
    </div>
  )
}
