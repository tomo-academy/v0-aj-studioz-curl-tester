"use client"

import { useState } from "react"
import Image from "next/image"
import AiChatModal from "./ai-chat-modal"

export default function Header() {
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <>
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-full bg-black flex items-center justify-center border-2 border-red-600 shadow-lg shadow-red-500/50">
            <Image
              src="/aj-logo.png"
              alt="AJ STUDIOZ"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold rgb-glow-text">AJ STUDIOZ</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Professional cURL Tester</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setShowAIChat(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium text-sm"
            title="Chat with AI Assistant"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="hidden md:inline">AI Chat</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors font-medium text-sm border border-border"
            title="Share this request"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C9.589 12.438 10 11.414 10 10c0-1.414-.411-2.438-1.316-3.342m0 6.684c.822.822 1.316 1.847 1.316 3.342 0 1.495-.494 2.52-1.316 3.342m0-6.684l6-6m-6 12l6 6M9 1.318C5.134 5.182 3 8.159 3 12c0 4.478 3.582 8.333 8 8.333 1.59 0 3.119-.266 4.581-.748"
              />
            </svg>
            <span className="hidden md:inline">Share</span>
          </button>

          <button
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium text-sm"
            title="Copy link to clipboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="hidden md:inline">Copy Link</span>
          </button>

          {/* Mobile menu icon */}
          <button className="sm:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Share Request</h2>
            <p className="text-muted-foreground mb-4">Copy the link below to share this request:</p>
            <div className="flex gap-2">
              <input type="text" value={window.location.href} readOnly className="input-field flex-1" />
              <button
                onClick={() => {
                  handleCopy()
                  setShowShareModal(false)
                }}
                className="btn-primary whitespace-nowrap"
              >
                Copy
              </button>
            </div>
            <button onClick={() => setShowShareModal(false)} className="w-full mt-4 btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      <AiChatModal isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  )
}
