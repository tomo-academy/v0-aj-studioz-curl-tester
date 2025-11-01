"use client"

import { useState } from "react"
import { Copy, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CURL_EXAMPLES, getCategories } from "@/lib/curl-examples"
import { parseCurlCommand } from "@/lib/curl-parser"

interface ExamplesPanelProps {
  onSelectExample: (curl: any) => void
}

export default function ExamplesPanel({ onSelectExample }: ExamplesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = getCategories()
  const examples = selectedCategory ? CURL_EXAMPLES.filter((ex) => ex.category === selectedCategory) : CURL_EXAMPLES

  const handleSelectExample = (curlCmd: string) => {
    const parsed = parseCurlCommand(curlCmd)
    if (parsed) {
      onSelectExample(parsed)
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-3 bg-card border-border">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">CATEGORIES</h3>
        <div className="space-y-2">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant={selectedCategory === null ? "default" : "ghost"}
            className="w-full justify-start text-sm"
          >
            All Examples
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? "default" : "ghost"}
              className="w-full justify-start text-sm"
            >
              {cat}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-3 bg-card border-border space-y-2 max-h-96 overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground sticky top-0 bg-card pb-2">EXAMPLES</h3>
        {examples.map((example) => (
          <div key={example.id} className="p-2 bg-input rounded border border-border hover:border-primary/50 group">
            <p className="text-xs font-medium text-foreground mb-2">{example.name}</p>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSelectExample(example.curl)}
                className="text-xs flex-1 text-accent hover:text-accent/80 gap-1"
              >
                <Play className="w-3 h-3" />
                Use
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(example.curl)}
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
