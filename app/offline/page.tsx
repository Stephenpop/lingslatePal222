"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw, Home, Languages } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mx-auto mb-4">
            <WifiOff className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">You're Offline</h1>
          <p className="text-slate-300">
            It looks like you've lost your internet connection. Some features may not be available.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Languages className="h-5 w-5" />
              PolyglotPal Offline
            </CardTitle>
            <CardDescription className="text-slate-300">
              You can still access some features while offline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-left space-y-2">
              <h3 className="font-semibold text-white">Available Offline:</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• View cached translations</li>
                <li>• Access downloaded lessons</li>
                <li>• Practice with offline quizzes</li>
                <li>• Review your progress</li>
              </ul>
            </div>

            <div className="text-left space-y-2">
              <h3 className="font-semibold text-white">Requires Internet:</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• New translations</li>
                <li>• Sync progress</li>
                <li>• Download new content</li>
                <li>• Account settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={handleRefresh}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
