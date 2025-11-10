"use client"

import { useState } from "react"
import CurlExecutor from "@/components/curl-executor"
import ResponseViewerNew from "@/components/response-viewer-new"
import Header from "@/components/header-new"
import HistorySidebar from "@/components/history-sidebar"
import AiChatModal from "@/components/ai-chat-modal"

export default function Home() {
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestData, setRequestData] = useState<{
    method: string
    url: string
    headers: Record<string, string>
  } | null>(null)
  const [curlCommand, setCurlCommand] = useState("")
  const [showAIChat, setShowAIChat] = useState(false)

  const handleSelectHistory = (curl: string) => {
    setCurlCommand(curl)
    // Trigger a scroll to input for better UX
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.value = curl
      textarea.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
      <Header />
      {/* Main Content - Mobile-responsive layout */}
      <div className="flex flex-1 overflow-hidden bg-background">
        <HistorySidebar onSelectHistory={handleSelectHistory} />

        {/* Mobile Layout - Vertical Stack */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Curl Input Panel */}
          <div className="flex flex-col h-1/2 lg:h-full lg:w-1/2 border-r-0 lg:border-r border-b lg:border-b-0 border-border overflow-hidden">
            <CurlExecutor
              onResponse={(data) => {
                setResponse(data)
                if (window && (window as any).addCurlToHistory) {
                  const parsed = document.querySelector("textarea")?.value || ""
                  const url = requestData?.url || "unknown"
                  const method = requestData?.method || "GET"
                  ;(window as any).addCurlToHistory(parsed, method, url)
                }
              }}
              onLoadingChange={setIsLoading}
              onError={setError}
              onRequestData={setRequestData}
            />
          </div>

          {/* Response Viewer Panel */}
          <div className="flex flex-col h-1/2 lg:h-full lg:w-1/2 overflow-hidden bg-card/30">
            <ResponseViewerNew response={response} isLoading={isLoading} requestData={requestData} />
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button - Desktop only since mobile has header button */}
      <button
        onClick={() => setShowAIChat(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-30 w-12 h-12 lg:w-14 lg:h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all items-center justify-center group"
        title="Chat with AI Assistant"
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span className="absolute -top-10 right-0 bg-card border border-border px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
          Need help? Ask AI
        </span>
      </button>

      {/* AI Chat Modal */}
      <AiChatModal isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  )
}
