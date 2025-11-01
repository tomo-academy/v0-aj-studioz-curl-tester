"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Send, MessageCircle, Copy, Check, Upload } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface AiChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AiChatModal({ isOpen, onClose }: AiChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI assistant for AJ STUDIOZ cURL Tester. I can help you with:\n\n• Writing and fixing curl commands\n• Explaining API endpoints and methods\n• Providing example requests for popular APIs\n• Answering questions about HTTP methods, headers, and authentication\n• Giving you up-to-date information about API models and services\n• Debugging REST API issues\n• Converting between different request formats\n\nWhat would you like help with today?",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const apiMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
      apiMessages.push({
        role: "user",
        content: input,
      })

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)

      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const extractCurlCommands = (text: string): { before: string; curl: string; after: string }[] => {
    const parts: { before: string; curl: string; after: string }[] = []
    const curlRegex = /```(?:bash|sh|shell|curl)?\s*(curl\s+[^`]+?)```/gs

    let lastIndex = 0
    let match

    while ((match = curlRegex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index)
      const curl = match[1].trim()
      parts.push({ before, curl, after: "" })
      lastIndex = match.index + match[0].length
    }

    if (parts.length > 0) {
      parts[parts.length - 1].after = text.slice(lastIndex)
    }

    return parts.length > 0 ? parts : []
  }

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleLoadCurl = (curl: string) => {
    const textarea = document.querySelector("textarea[placeholder*='curl']") as HTMLTextAreaElement
    if (textarea) {
      textarea.value = curl
      textarea.dispatchEvent(new Event("input", { bubbles: true }))
      onClose()
    }
  }

  const renderMessageContent = (message: ChatMessage) => {
    const curlParts = extractCurlCommands(message.content)

    if (curlParts.length > 0) {
      return (
        <div className="space-y-2">
          {curlParts.map((part, idx) => (
            <div key={idx}>
              {part.before && (
                <div className="text-sm whitespace-pre-wrap break-words mb-2">
                  {formatText(part.before)}
                </div>
              )}
              <div className="relative group">
                <pre className="bg-black/80 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-green-500/30">
                  {part.curl}
                </pre>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyCode(part.curl, `${message.id}-${idx}`)}
                    className="p-1.5 bg-secondary hover:bg-secondary/80 rounded text-xs flex items-center gap-1"
                    title="Copy curl command"
                  >
                    {copiedCode === `${message.id}-${idx}` ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleLoadCurl(part.curl)}
                    className="p-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded text-xs flex items-center gap-1"
                    title="Load in curl tester"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {part.after && (
                <div className="text-sm whitespace-pre-wrap break-words mt-2">
                  {formatText(part.after)}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    return <div className="text-sm whitespace-pre-wrap break-words">{formatText(message.content)}</div>
  }

  const formatText = (text: string) => {
    // Format inline code
    const parts = text.split(/(`[^`]+`)/)
    return parts.map((part, idx) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={idx} className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl h-[700px] flex flex-col bg-card border border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">AJ STUDIOZ AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded transition-colors" title="Close chat">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-foreground rounded-bl-none border border-border"
                }`}
              >
                {renderMessageContent(message)}
                <span className="text-xs opacity-70 mt-2 block">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-foreground rounded-lg rounded-bl-none px-4 py-2 border border-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background rounded-b-lg">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Ask me about APIs, curl commands, HTTP methods, authentication..."
              className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="sm"
              className="bg-primary hover:bg-primary/90 h-auto py-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Ask about popular APIs like OpenAI, Anthropic, GitHub, Stripe, or get help with curl syntax
          </p>
        </div>
      </Card>
    </div>
  )
}
