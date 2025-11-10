"use client"

import { useState } from "react"
import CurlExecutor from "@/components/curl-executor"
import ResponseViewerNew from "@/components/response-viewer-new"
import Header from "@/components/header-new"
import HistorySidebar from "@/components/history-sidebar"

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

    </div>
  )
}
