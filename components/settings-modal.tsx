"use client"

import { useState } from "react"
import { X, Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed?: string
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("api-keys")
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "GitHub API",
      key: "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      created: "2 days ago",
      lastUsed: "30 mins ago",
    },
  ])
  const [newKeyName, setNewKeyName] = useState("")
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const handleAddKey = () => {
    if (!newKeyName.trim()) return

    const newKey: ApiKey = {
      id: Math.random().toString(),
      name: newKeyName,
      key: "sk_" + Math.random().toString(36).substring(2, 15),
      created: "just now",
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id))
  }

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const maskKey = (key: string) => {
    if (key.length <= 8) return key
    return key.substring(0, 4) + "*".repeat(key.length - 8) + key.substring(key.length - 4)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-card border-border max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("api-keys")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "api-keys"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "general"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            General
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "api-keys" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Add New API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Key name (e.g., GitHub API)"
                    className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-sm"
                  />
                  <Button
                    onClick={handleAddKey}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.id} className="bg-input p-4 rounded border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{key.name}</h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setShowKey({
                              ...showKey,
                              [key.id]: !showKey[key.id],
                            })
                          }
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyKey(key.key, key.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <code className="text-xs text-accent font-mono bg-background p-2 rounded block mb-3 break-all">
                      {showKey[key.id] ? key.key : maskKey(key.key)}
                    </code>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <p>Created: {key.created}</p>
                      <p>Last used: {key.lastUsed || "Never"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Theme</label>
                <select className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm">
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Default Request Timeout (seconds)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="follow-redirects" defaultChecked className="w-4 h-4 cursor-pointer" />
                <label htmlFor="follow-redirects" className="text-sm text-foreground cursor-pointer">
                  Follow redirects automatically
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
