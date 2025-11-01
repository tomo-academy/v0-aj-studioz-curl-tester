"use client"

import { useState } from "react"
import { Copy, Send, Plus, Trash2, Code2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SnippetModal from "./snippet-modal"
import CurlInputModal from "./curl-input-modal"
import FormatSwitcher from "./format-switcher"

interface RequestBuilderProps {
  request: any
  onResponse: (response: any) => void
}

interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
}

export default function RequestBuilder({ request, onResponse }: RequestBuilderProps) {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("https://api.github.com/users/github")
  const [params, setParams] = useState<KeyValuePair[]>([{ id: "1", key: "per_page", value: "10", enabled: true }])
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { id: "1", key: "Content-Type", value: "application/json", enabled: true },
  ])
  const [body, setBody] = useState("")
  const [authType, setAuthType] = useState("none")
  const [bearerToken, setBearerToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSnippetModal, setShowSnippetModal] = useState(false)
  const [showCurlModal, setShowCurlModal] = useState(false)
  const [serverLocation, setServerLocation] = useState("us") // Server location selector

  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
  const serverLocations = [
    { id: "us", label: "United States" },
    { id: "eu", label: "Europe" },
    { id: "asia", label: "Asia" },
  ]

  const addParam = (setter: any, items: KeyValuePair[]) => {
    setter([...items, { id: Math.random().toString(), key: "", value: "", enabled: true }])
  }

  const updateParam = (setter: any, items: KeyValuePair[], id: string, field: string, val: string) => {
    setter(items.map((item) => (item.id === id ? { ...item, [field]: val } : item)))
  }

  const removeParam = (setter: any, items: KeyValuePair[], id: string) => {
    setter(items.filter((item) => item.id !== id))
  }

  const toggleParam = (setter: any, items: KeyValuePair[], id: string) => {
    setter(items.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)))
  }

  const buildQueryString = () => {
    const enabledParams = params.filter((p) => p.enabled && p.key)
    if (enabledParams.length === 0) return ""
    const query = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&")
    return "?" + query
  }

  const buildHeaders = () => {
    const headerObj: Record<string, string> = {}
    headers.forEach((h) => {
      if (h.enabled && h.key) {
        headerObj[h.key] = h.value
      }
    })
    if (authType === "bearer" && bearerToken) {
      headerObj["Authorization"] = `Bearer ${bearerToken}`
    }
    return headerObj
  }

  const generateCurlCommand = () => {
    let curl = `curl -X ${method} "${url}${buildQueryString()}"`
    const headersObj = buildHeaders()
    Object.entries(headersObj).forEach(([key, val]) => {
      curl += ` \\\n  -H "${key}: ${val}"`
    })
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      curl += ` \\\n  -d '${body}'`
    }
    return curl
  }

  const handleSendRequest = async () => {
    setIsLoading(true)
    try {
      const fullUrl = url + buildQueryString()
      const response = await fetch("/api/execute-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          url: fullUrl,
          headers: buildHeaders(),
          body: body || undefined,
        }),
      })
      const data = await response.json()
      onResponse(data)
    } catch (error) {
      onResponse({ error: "Failed to execute request", errorDetails: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyCurl = (parsed: any) => {
    setMethod(parsed.method)
    setUrl(parsed.url)
    setBody(parsed.body || "")

    // Convert headers object to KeyValuePair array
    const headerPairs = Object.entries(parsed.headers).map(([key, value], idx) => ({
      id: String(idx),
      key,
      value: value as string,
      enabled: true,
    }))
    setHeaders(headerPairs.length > 0 ? headerPairs : headers)

    // Convert params object to KeyValuePair array
    const paramPairs = Object.entries(parsed.params).map(([key, value], idx) => ({
      id: String(idx),
      key,
      value: value as string,
      enabled: true,
    }))
    if (paramPairs.length > 0) {
      setParams(paramPairs)
    }
  }

  const KeyValueInput = ({
    items,
    onChange,
    onToggle,
    onRemove,
  }: {
    items: KeyValuePair[]
    onChange: (id: string, field: string, val: string) => void
    onToggle: (id: string) => void
    onRemove: (id: string) => void
  }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={() => onToggle(item.id)}
            className="w-4 h-4 cursor-pointer"
          />
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => onChange(item.id, "key", e.target.value)}
            className="flex-1 px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => onChange(item.id, "value", e.target.value)}
            className="flex-1 px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(item.id)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <Card className="p-4 bg-card border-border">
        <div className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 flex gap-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded text-foreground text-sm font-medium min-w-24"
              >
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-sm"
              />
            </div>
            <select
              value={serverLocation}
              onChange={(e) => setServerLocation(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded text-foreground text-xs"
            >
              {serverLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="params" className="w-full">
            <TabsList className="bg-secondary border-b border-border w-full justify-start rounded-none">
              <TabsTrigger value="params">Params</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>

            <TabsContent value="params" className="mt-4 space-y-3">
              <KeyValueInput
                items={params}
                onChange={(id, field, val) => updateParam(setParams, params, id, field, val)}
                onToggle={(id) => toggleParam(setParams, params, id)}
                onRemove={(id) => removeParam(setParams, params, id)}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => addParam(setParams, params)}
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Parameter
              </Button>
            </TabsContent>

            <TabsContent value="headers" className="mt-4 space-y-3">
              <KeyValueInput
                items={headers}
                onChange={(id, field, val) => updateParam(setHeaders, headers, id, field, val)}
                onToggle={(id) => toggleParam(setHeaders, headers, id)}
                onRemove={(id) => removeParam(setHeaders, headers, id)}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => addParam(setHeaders, headers)}
                className="gap-2 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Header
              </Button>
            </TabsContent>

            <TabsContent value="body" className="mt-4">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-24 p-3 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-sm font-mono resize-none"
              />
            </TabsContent>

            <TabsContent value="auth" className="mt-4 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Auth Type</label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-sm"
                >
                  <option value="none">None</option>
                  <option value="bearer">Bearer Token</option>
                </select>
              </div>
              {authType === "bearer" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Token</label>
                  <input
                    type="password"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    placeholder="Enter your bearer token"
                    className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-sm"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-between">
            <Button variant="outline" size="sm" onClick={() => setShowCurlModal(true)} className="gap-2 bg-transparent">
              <Upload className="w-4 h-4" />
              Import cURL
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSnippetModal(true)}
                className="gap-2 bg-transparent"
              >
                <Code2 className="w-4 h-4" />
                Code Snippet
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Copy className="w-4 h-4" />
                Copy as cURL
              </Button>
              <Button
                onClick={handleSendRequest}
                disabled={isLoading}
                size="sm"
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4" />
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Format Switcher - show converted code in different languages */}
      <FormatSwitcher method={method} url={url} headers={buildHeaders()} body={body} />

      {/* cURL Preview */}
      <Card className="p-4 bg-card border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">cURL Preview</p>
        <pre className="bg-input p-3 rounded text-xs text-accent font-mono overflow-x-auto text-pretty whitespace-pre-wrap break-words">
          {generateCurlCommand()}
        </pre>
      </Card>

      {/* Modals */}
      <SnippetModal
        isOpen={showSnippetModal}
        onClose={() => setShowSnippetModal(false)}
        method={method}
        url={url}
        headers={buildHeaders()}
        body={body}
      />
      <CurlInputModal isOpen={showCurlModal} onClose={() => setShowCurlModal(false)} onApply={handleApplyCurl} />
    </div>
  )
}
