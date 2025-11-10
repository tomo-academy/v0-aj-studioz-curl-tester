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
      
      // Auto-apply fix if available and command has issues
      if (result.suggestedFix && !result.isValid) {
        setTimeout(() => {
          onAcceptSuggestion(result.suggestedFix!)
          setValidationResult(null)
          onClose()
        }, 2000) // Auto-apply after 2 seconds to show the user what was fixed
      }
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
              <div className={`p-4 rounded-lg border-2 ${
                validationResult.isValid 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                  : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {validationResult.isValid ? "✅" : "🤖"}
                  </span>
                  <span className={`font-bold text-lg ${
                    validationResult.isValid ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    {validationResult.isValid ? 'Perfect cURL Command!' : 'AI Auto-Fixed Your Command!'}
                  </span>
                </div>
                
                {validationResult.issues.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      🔧 Fixed Issues:
                    </p>
                    <ul className="space-y-1">
                      {validationResult.issues.map((issue: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <span className="text-green-500">✓</span>
                          <span className="text-gray-600 dark:text-gray-400">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {validationResult.suggestedFix && !validationResult.isValid && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <span>✨</span>
                    <span className="text-sm font-medium">
                      Auto-applying fixed command in 2 seconds...
                    </span>
                  </div>
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700 p-4">
                    <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words overflow-x-auto">
                      {validationResult.suggestedFix}
                    </pre>
                  </Card>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        onAcceptSuggestion(validationResult.suggestedFix)
                        setValidationResult(null)
                        onClose()
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      🪄 Apply Now
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setValidationResult(null)}
                      className="px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {validationResult.isValid && (
                <div className="text-center">
                  <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    ✨ Awesome! Close
                  </Button>
                </div>
              )}

              {!validationResult.isValid && !validationResult.suggestedFix && (
                <div className="flex gap-2">
                  <Button onClick={() => setValidationResult(null)} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={onClose} variant="outline" className="flex-1">
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </div>
      </Card>
    </div>
  )
}
