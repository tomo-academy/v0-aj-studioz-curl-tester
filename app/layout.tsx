import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AJ STUDIOZ - Professional cURL Tester & API Client",
  description: "Test and debug API requests with AJ STUDIOZ - the professional online curl command testing platform",
  generator: "v0.app",
  keywords: ["curl", "api", "testing", "http", "rest", "ajax", "developer", "tools", "postman", "insomnia"],
  authors: [{ name: "AJ STUDIOZ" }],
  creator: "AJ STUDIOZ",
  publisher: "AJ STUDIOZ",
  icons: {
    icon: [
      { url: "/aj-logo.png", sizes: "16x16", type: "image/png" },
      { url: "/aj-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/aj-logo.png", sizes: "96x96", type: "image/png" },
      { url: "/aj-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/aj-logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/aj-logo.png",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/aj-logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/aj-logo.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/aj-logo.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
