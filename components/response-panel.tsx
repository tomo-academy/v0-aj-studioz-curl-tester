"use client"

import { FileJson, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResponseViewer from "./response-viewer"
import { useState } from "react"

interface ResponsePanelProps {
  response: any
}

export default function ResponsePanel({ response }: ResponsePanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400"
    if (status >= 300 && status < 400) return "text-blue-400"
    if (status >= 400 && status < 500) return "text-yellow-400"
    return "text-red-400"
  }

  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="w-96 flex flex-col gap-4 overflow-hidden">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm text-foreground">Response</h3>
          </div>
          {response && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {!response ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">Send a request to see the response here</p>
          </div>
        ) : response.error ? (
          <div className="bg-destructive/20 border border-destructive rounded p-3">
            <p className="text-sm text-destructive">{response.error}</p>
            {response.errorDetails && <p className="text-xs text-destructive/80 mt-1">{response.errorDetails}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Response Metadata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-input p-2 rounded">
                <p className="text-muted-foreground">Status</p>
                <p className={`font-semibold ${getStatusColor(response.status)}`}>{response.status}</p>
              </div>
              <div className="bg-input p-2 rounded">
                <p className="text-muted-foreground">Time</p>
                <p className="text-foreground font-semibold">{response.time}</p>
              </div>
              <div className="bg-input p-2 rounded">
                <p className="text-muted-foreground">Size</p>
                <p className="text-foreground font-semibold">{formatFileSize(response.size || 0)}</p>
              </div>
              <div className="bg-input p-2 rounded">
                <p className="text-muted-foreground">Status</p>
                <p className={`font-semibold ${response.success ? "text-green-400" : "text-red-400"}`}>
                  {response.success ? "OK" : "Failed"}
                </p>
              </div>
            </div>

            {/* Response Content Tabs */}
            <Tabs defaultValue="body" className="w-full">
              <TabsList className="bg-secondary border-b border-border w-full justify-start rounded-none">
                <TabsTrigger value="body" className="text-xs">
                  Body
                </TabsTrigger>
                <TabsTrigger value="headers" className="text-xs">
                  Headers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="body" className="mt-3">
                {typeof response.data === "object" ? (
                  <ResponseViewer data={response.data} />
                ) : (
                  <pre className="bg-input p-3 rounded text-xs text-foreground font-mono overflow-auto max-h-96 whitespace-pre-wrap break-words">
                    {response.data}
                  </pre>
                )}
              </TabsContent>

              <TabsContent value="headers" className="mt-3">
                <pre className="bg-input p-3 rounded text-xs text-muted-foreground font-mono overflow-auto max-h-96 whitespace-pre-wrap break-words">
                  {formatHeaders(response.headers || {})}
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </Card>
    </div>
  )
}
