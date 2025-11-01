"use client"

import { useState } from "react"
import CurlExecutor from "@/components/curl-executor"
import ResponseViewerNew from "@/components/response-viewer-new"
import Header from "@/components/header-new"

export default function Home() {
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestData, setRequestData] = useState<{
    method: string
    url: string
    headers: Record<string, string>
  } | null>(null) // Add requestData state to track API provider info

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
      <Header />
      {/* Main Content - Responsive split layout */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-0 bg-background">
        {/* Left Panel - Curl Input */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-border overflow-hidden">
          <CurlExecutor
            onResponse={setResponse}
            onLoadingChange={setIsLoading}
            onError={setError}
            onRequestData={setRequestData} // Pass callback to capture request data
          />
        </div>

        {/* Right Panel - Response Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col border-t lg:border-t-0 border-border overflow-hidden bg-card/30">
          <ResponseViewerNew
            response={response}
            isLoading={isLoading}
            requestData={requestData} // Pass request data for API provider detection
          />
        </div>
      </div>
    </div>
  )
}
