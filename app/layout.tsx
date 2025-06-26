import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { FloatingInstallPrompt } from "@/components/floating-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LingslatePal - Language Learning & Translation",
  description: "Learn and translate languages with ease. Free translation tools and interactive language learning.",
  manifest: "/manifest.json",
  keywords: ["language learning", "translation", "lingslate", "education"],
  authors: [{ name: "LingslatePal Team" }],
  creator: "LingslatePal",
  publisher: "LingslatePal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LingslatePal" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <FloatingInstallPrompt />
          <PWAInstallPrompt />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
