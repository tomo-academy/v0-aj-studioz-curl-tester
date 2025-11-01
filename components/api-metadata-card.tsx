"use client"

import type { APIProviderInfo } from "@/lib/api-provider-detector"
import { ExternalLink, Globe, Code, Server } from "lucide-react"

interface APIMetadataCardProps {
  info: APIProviderInfo
  status: number
  time: string
}

export default function APIMetadataCard({ info, status, time }: APIMetadataCardProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500/10 text-green-400 border-green-500/30"
    if (status >= 300 && status < 400) return "bg-blue-500/10 text-blue-400 border-blue-500/30"
    if (status >= 400 && status < 500) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
    return "bg-red-500/10 text-red-400 border-red-500/30"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 sm:p-4 bg-secondary/50 rounded-lg border border-border/50">
      {/* Provider Info */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">API Provider</p>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm sm:text-base font-bold text-foreground">{info.brand}</p>
            <p className="text-xs text-muted-foreground mt-1">{info.provider}</p>
          </div>
        </div>
      </div>

      {/* Model Info */}
      {info.model && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Model</p>
          <p className="text-sm sm:text-base font-mono text-foreground">{info.model}</p>
        </div>
      )}

      {/* Endpoint Info */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <Code className="w-3 h-3" />
          Endpoint
        </p>
        <p className="text-xs sm:text-sm font-mono text-foreground break-all">{info.endpoint}</p>
      </div>

      {/* Region/Hosting Info */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <Server className="w-3 h-3" />
          Hosted
        </p>
        <p className="text-xs sm:text-sm text-foreground">{info.region}</p>
      </div>

      {/* Response Status */}
      <div className={`space-y-2 p-2 rounded border ${getStatusColor(status)}`}>
        <p className="text-xs font-semibold uppercase tracking-wide">Status</p>
        <p className="text-sm sm:text-base font-bold">{status}</p>
      </div>

      {/* Response Time */}
      <div className="space-y-2 p-2 bg-primary/10 rounded border border-primary/30">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Response Time</p>
        <p className="text-sm sm:text-base font-mono text-primary font-bold">{time}</p>
      </div>

      {/* Documentation Link */}
      {info.documentationUrl && (
        <div className="sm:col-span-2">
          <a
            href={info.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors"
          >
            <Globe className="w-3 h-3" />
            View Documentation
            <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}
    </div>
  )
}
