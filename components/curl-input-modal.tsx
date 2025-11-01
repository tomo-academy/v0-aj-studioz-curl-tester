"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { parseCurlCommand, validateCurlSyntax } from "@/lib/curl-parser"

interface CurlInputModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (curl: any) => void
}

export default function CurlInputModal({ isOpen, onClose, onApply }: CurlInputModalProps) {
  const [curlCommand, setCurlCommand] = useState("")
  const [validation, setValidation] = useState({ valid: true, errors: [] as string[] })

  const handleValidate = () => {
    const result = validateCurlSyntax(curlCommand)
    setValidation(result)
  }

  const handleApply = () => {
    handleValidate()
    const result = validateCurlSyntax(curlCommand)
    if (result.valid) {
      const parsed = parseCurlCommand(curlCommand)
      if (parsed) {
        onApply(parsed)
        setCurlCommand("")
        setValidation({ valid: true, errors: [] })
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-card border-border p-0 rounded-lg overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Import cURL Command</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Paste your cURL command</label>
            <textarea
              value={curlCommand}
              onChange={(e) => {
                setCurlCommand(e.target.value)
                setValidation({ valid: true, errors: [] })
              }}
              placeholder='curl -X GET "https://api.github.com/users/github" -H "Accept: application/json"'
              className="w-full h-32 p-3 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-sm font-mono resize-none"
            />
          </div>

          {validation.errors.length > 0 && (
            <div className="bg-destructive/20 border border-destructive rounded p-3 space-y-1">
              {validation.errors.map((error, i) => (
                <div key={i} className="flex gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              ))}
            </div>
          )}

          {validation.valid && curlCommand && (
            <div className="bg-green-500/20 border border-green-500 rounded p-3 flex gap-2 text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>cURL syntax looks good!</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={!curlCommand.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Apply
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
