"use client"

import { useState } from "react"
import { validateAndFixCurl } from "@/lib/ai-curl-validator"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CurlValidatorModalProps {
  curlCommand: string
  isOpen: boolean
  onClose: () => void
  onAcceptSuggestion: (fixedCurl: string) => void
}

export default function CurlValidatorModal({
  curlCommand,
  isOpen,
  onClose,
  onAcceptSuggestion,
}: CurlValidatorModalProps) {
  const [validationResult, setValidationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleValidate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await validateAndFixCurl(curlCommand)
      setValidationResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border max-h-96 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="rgb-glow-text">AI cURL Validator</span>
          </h2>

          {!validationResult ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Let AI analyze your curl command for issues and suggest fixes.
              </p>
              <Button onClick={handleValidate} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? "Analyzing..." : "Analyze with AI"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Status:</p>
                <p className={`text-sm font-mono ${validationResult.isValid ? "text-green-500" : "text-red-500"}`}>
                  {validationResult.isValid ? "✓ Valid" : "✗ Invalid"}
                </p>
              </div>

              {validationResult.issues.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Issues Found:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {validationResult.issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-2">Explanation:</p>
                <p className="text-sm text-muted-foreground">{validationResult.explanation}</p>
              </div>

              {validationResult.suggestedFix && (
                <div>
                  <p className="text-sm font-semibold mb-2">Suggested Fix:</p>
                  <Card className="bg-input border-border p-3 mb-3">
                    <pre className="text-xs font-mono text-accent whitespace-pre-wrap break-words overflow-x-auto">
                      {validationResult.suggestedFix}
                    </pre>
                  </Card>
                  <Button
                    onClick={() => {
                      onAcceptSuggestion(validationResult.suggestedFix)
                      setValidationResult(null)
                      onClose()
                    }}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Accept & Use This Fix
                  </Button>
                </div>
              )}

              <Button onClick={() => setValidationResult(null)} variant="outline" className="w-full">
                Validate Again
              </Button>
              <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
                Close
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </div>
      </Card>
    </div>
  )
}
