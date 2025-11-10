"use client"

import { useState } from "react"
import CurlExecutor from "@/components/curl-executor"
import ResponseViewerNew from "@/components/response-viewer-new"
import Header from "@/components/header-new"
import HistorySidebar from "@/components/history-sidebar"
import AiChatModal from "@/components/ai-chat-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      {/* Main Content - Mobile-first responsive layout */}
      <div className="flex flex-1 overflow-hidden bg-background">
        <HistorySidebar onSelectHistory={handleSelectHistory} />

        {/* Mobile Layout - Tabbed Interface */}
        <div className="flex-1 flex flex-col overflow-hidden md:hidden">
          <Tabs defaultValue="request" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 bg-card border-b border-border rounded-none h-12">
              <TabsTrigger 
                value="request" 
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Request
              </TabsTrigger>
              <TabsTrigger 
                value="response" 
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Response
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="flex-1 overflow-hidden m-0">
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
            </TabsContent>
            
            <TabsContent value="response" className="flex-1 overflow-hidden m-0">
              <ResponseViewerNew response={response} isLoading={isLoading} requestData={requestData} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout - Side by side panels */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          {/* Left Panel - Curl Input */}
          <div className="w-full lg:w-1/2 flex flex-col border-r border-border overflow-hidden">
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

          {/* Right Panel - Response Viewer */}
          <div className="w-full lg:w-1/2 flex flex-col border-t lg:border-t-0 border-border overflow-hidden bg-card/30">
            <ResponseViewerNew response={response} isLoading={isLoading} requestData={requestData} />
          </div>
        </div>
      </div>

      {/* Mobile Floating AI Chat Button - Only shows on mobile when not in header */}
      <button
        onClick={() => setShowAIChat(true)}
        className="md:hidden fixed bottom-4 right-4 z-30 w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center mobile-safe-area touch-manipulation"
        title="Chat with AI Assistant"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* AI Chat Modal */}
      <AiChatModal isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  )
}
