import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "cURL Tester - Online cURL Command Testing Tool | AJ STUDIOZ",
  description: "Free online cURL tester and API testing tool. Test HTTP requests, debug REST APIs, analyze cURL commands with real-time response preview. Professional cURL command executor and API client for developers.",
  keywords: ["curl tester", "online curl", "api tester", "curl command", "http client", "rest api tester", "curl online", "api testing tool", "curl executor", "http request tester"],
  authors: [{ name: "AJ STUDIOZ" }],
  creator: "AJ STUDIOZ",
  publisher: "AJ STUDIOZ",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://curl.ajstudioz.co.in/",
    siteName: "cURL Tester - AJ STUDIOZ",
    title: "cURL Tester - Online cURL Command Testing Tool",
    description: "Free online cURL tester and API testing tool. Test HTTP requests, debug REST APIs, and analyze cURL commands instantly.",
    images: [
      {
        url: "/AJ.svg",
        width: 300,
        height: 300,
        alt: "AJ STUDIOZ cURL Tester",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "cURL Tester - Online cURL Command Testing Tool",
    description: "Free online cURL tester and API testing tool. Test HTTP requests and debug REST APIs instantly.",
    images: ["/AJ.svg"],
    creator: "@ajstudioz",
  },
  alternates: {
    canonical: "https://curl.ajstudioz.co.in/",
  },
  icons: {
    icon: [
      {
        url: "/AJ.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/AJ.svg",
    shortcut: "/AJ.svg",
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/AJ.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/AJ.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "cURL Tester",
              "description": "Free online cURL command testing tool and API client for developers",
              "url": "https://curl.ajstudioz.co.in/",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "AJ STUDIOZ",
                "url": "https://curl.ajstudioz.co.in/"
              },
              "featureList": [
                "Test cURL commands online",
                "HTTP request testing",
                "REST API debugging",
                "Real-time response preview",
                "Request history tracking",
                "Headers and timing analysis"
              ]
            })
          }}
        />
        <style>
          {`
            /* Make favicon appear circular */
            link[rel="icon"],
            link[rel="apple-touch-icon"] {
              border-radius: 50%;
            }
            
            /* Fix mobile viewport height */
            :root {
              --vh: 1vh;
            }
            
            @supports (-webkit-touch-callout: none) {
              body {
                height: -webkit-fill-available;
              }
            }
          `}
        </style>
      </head>
      <body className={`font-sans antialiased overflow-hidden h-screen max-h-screen`} style={{ height: '100dvh' }}>{children}</body>
    </html>
  )
}
