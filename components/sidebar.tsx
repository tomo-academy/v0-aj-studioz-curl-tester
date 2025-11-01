"use client"

import { Plus, Folder, Clock, Trash2, Save, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  getHistory,
  getCollections,
  clearHistory,
  type StoredRequest,
  type RequestCollection,
} from "@/lib/request-storage"

interface SidebarProps {
  onSelectRequest: (request: StoredRequest) => void
  selectedRequest: any
}

export default function Sidebar({ onSelectRequest, selectedRequest }: SidebarProps) {
  const [history, setHistory] = useState<StoredRequest[]>([])
  const [collections, setCollections] = useState<RequestCollection[]>([])
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Load data on mount
    setHistory(getHistory())
    setCollections(getCollections())
  }, [])

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "text-blue-400",
      POST: "text-green-400",
      PUT: "text-yellow-400",
      DELETE: "text-red-400",
      PATCH: "text-purple-400",
      HEAD: "text-gray-400",
      OPTIONS: "text-gray-400",
    }
    return colors[method] || "text-gray-400"
  }

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname + urlObj.search
    } catch {
      return url
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const toggleCollection = (id: string) => {
    setExpandedCollections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-sidebar-border">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Collections Section */}
        {collections.length > 0 && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2 mb-3">
              <Folder className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-sm text-sidebar-foreground">Collections</h3>
            </div>
            <div className="space-y-1">
              {collections.map((collection) => (
                <div key={collection.id}>
                  <button
                    onClick={() => toggleCollection(collection.id)}
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-sidebar-accent transition-colors text-left"
                  >
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        expandedCollections[collection.id] ? "" : "-rotate-90"
                      }`}
                    />
                    <span className="text-xs font-medium text-sidebar-foreground flex-1 truncate">
                      {collection.name}
                    </span>
                    <span className="text-xs text-sidebar-accent-foreground">{collection.requests.length}</span>
                  </button>
                  {expandedCollections[collection.id] && (
                    <div className="ml-4 space-y-1">
                      {collection.requests.length === 0 ? (
                        <p className="text-xs text-sidebar-accent-foreground p-2">No requests</p>
                      ) : (
                        collection.requests.map((_, idx) => (
                          <div key={idx} className="text-xs text-sidebar-accent-foreground p-2">
                            Request {idx + 1}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-sm text-sidebar-foreground">History</h3>
            </div>
            {history.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  clearHistory()
                  setHistory([])
                }}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-sidebar-accent-foreground p-2">No requests yet</p>
          ) : (
            <div className="space-y-1">
              {history.map((req) => (
                <div
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedRequest?.id === req.id
                      ? "bg-sidebar-primary/30 border border-sidebar-primary"
                      : "hover:bg-sidebar-accent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${getMethodColor(req.method)}`}>{req.method}</span>
                  </div>
                  <p className="text-xs text-sidebar-foreground truncate mt-1">{formatUrl(req.url)}</p>
                  <p className="text-xs text-sidebar-accent-foreground mt-1">{formatTime(req.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button variant="outline" size="sm" className="w-full text-xs gap-2 bg-transparent">
          <Save className="w-3 h-3" />
          Save Current
        </Button>
      </div>
    </aside>
  )
}
