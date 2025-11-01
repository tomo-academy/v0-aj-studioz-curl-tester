"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { generateSnippet } from "@/lib/snippet-generator"

interface SnippetModalProps {
  isOpen: boolean
  onClose: () => void
  method: string
  url: string
  headers: Record<string, string>
  body?: string
}

const LANGUAGES = [
  { id: "curl", name: "cURL" },
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "ruby", name: "Ruby" },
  { id: "php", name: "PHP" },
]

export default function SnippetModal({ isOpen, onClose, method, url, headers, body }: SnippetModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("curl")
  const [copied, setCopied] = useState(false)

  const snippet = generateSnippet(selectedLanguage, { method, url, headers, body })

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-card border-border max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Code Snippet</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Language Selection */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm font-medium text-foreground mb-3">Select Language</p>
          <div className="grid grid-cols-4 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedLanguage === lang.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-input text-foreground hover:bg-secondary"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="bg-input p-4 rounded text-xs text-accent font-mono overflow-x-auto whitespace-pre-wrap break-words">
            {snippet}
          </pre>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex justify-end gap-2">
          <Button onClick={handleCopy} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
