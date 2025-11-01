"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResponseViewerProps {
  data: any
  isLoading?: boolean
}

interface TreeNode {
  key: string
  value: any
  expanded: boolean
  children?: TreeNode[]
}

export default function ResponseViewer({ data, isLoading }: ResponseViewerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["root"]))
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const togglePath = (path: string) => {
    const newSet = new Set(expandedPaths)
    if (newSet.has(path)) {
      newSet.delete(path)
    } else {
      newSet.add(path)
    }
    setExpandedPaths(newSet)
  }

  const isExpandable = (value: any): boolean => {
    return typeof value === "object" && value !== null
  }

  const renderValue = (value: any, path = "root", depth = 0): React.ReactNode => {
    if (value === null) {
      return <span className="text-red-400">null</span>
    }

    if (typeof value === "boolean") {
      return <span className="text-yellow-400">{String(value)}</span>
    }

    if (typeof value === "number") {
      return <span className="text-blue-400">{value}</span>
    }

    if (typeof value === "string") {
      return <span className="text-green-400">"{value}"</span>
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path)
      return (
        <div>
          <button
            onClick={() => togglePath(path)}
            className="inline-flex items-center gap-1 text-cyan-400 hover:opacity-75 transition-opacity"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
            <span>Array({value.length})</span>
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1">
              {value.map((item, index) => (
                <div key={index} className="text-xs">
                  <span className="text-gray-400">[{index}]: </span>
                  {renderValue(item, `${path}.${index}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (typeof value === "object") {
      const isExpanded = expandedPaths.has(path)
      const keys = Object.keys(value)
      return (
        <div>
          <button
            onClick={() => togglePath(path)}
            className="inline-flex items-center gap-1 text-cyan-400 hover:opacity-75 transition-opacity"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
            <span>Object({keys.length})</span>
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1">
              {keys.map((key) => (
                <div key={key} className="text-xs">
                  <span className="text-purple-400">"{key}"</span>
                  <span className="text-gray-400">: </span>
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return String(value)
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-foreground gap-1"
        >
          <Copy className="w-3 h-3" />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <div className="text-xs font-mono text-foreground space-y-1">{renderValue(data)}</div>
    </div>
  )
}
