"use client"

import { useState } from "react"
import Image from "next/image"
import { Sparkles, Share2, Link } from "lucide-react"

export default function Header() {
  const [showShareModal, setShowShareModal] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <>
      <header className="bg-card border-b border-border px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 flex items-center justify-between flex-shrink-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 overflow-hidden rounded-full bg-black flex items-center justify-center border-2 border-red-600 shadow-lg shadow-red-500/50">
            <Image
              src="/aj-logo.png"
              alt="AJ STUDIOZ"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base md:text-lg lg:text-2xl font-bold rgb-glow-text truncate">AJ STUDIOZ</h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Professional cURL Tester</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2 lg:gap-3 flex-shrink-0">
          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium text-xs md:text-sm shadow-md hover:shadow-lg"
            title="Share this request"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden lg:inline">Share</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all duration-200 font-medium text-xs md:text-sm shadow-md hover:shadow-lg"
            title="Copy link to clipboard"
          >
            <Link className="w-4 h-4" />
            <span className="hidden md:inline">Copy Link</span>
          </button>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-md">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Online</span>
          </div>
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

    </>
  )
}
