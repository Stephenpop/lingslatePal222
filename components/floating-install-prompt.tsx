"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Monitor, Wifi, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function FloatingInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
        setIsInstalled(true)
        return
      }

      // Show floating button after 10 seconds if not installed
      const timer = setTimeout(() => {
        if (!isInstalled) {
          setShowFloatingButton(true)
        }
      }, 10000)

      return () => clearTimeout(timer)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after 5 seconds
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 5000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    checkInstalled()

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        alert("To install this app on your iOS device, tap the Share button and then 'Add to Home Screen'")
      } else {
        alert("To install this app, look for the install option in your browser's menu")
      }
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
      setShowFloatingButton(false)
      setIsInstalled(true)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Show floating button instead
    setTimeout(() => setShowFloatingButton(true), 2000)
  }

  const handleFloatingClick = () => {
    setShowFloatingButton(false)
    setShowPrompt(true)
  }

  if (isInstalled) return null

  return (
    <>
      {/* Main Install Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <Card className="w-full max-w-md border-blue-200 bg-white shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900">Install LingslatePal</CardTitle>
                <CardDescription className="text-slate-600">
                  Get the full app experience with offline access and native features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <Wifi className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Works Offline</p>
                  </div>
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Mobile Ready</p>
                  </div>
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Monitor className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Desktop App</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    App Features:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>• Instant access from home screen</li>
                    <li>• Offline translation & lessons</li>
                    <li>• Push notifications for streaks</li>
                    <li>• Faster loading & better performance</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install App
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-center text-xs text-slate-500">Free • No ads • Works on all devices</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Install Button */}
      <AnimatePresence>
        {showFloatingButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                boxShadow: [
                  "0 10px 25px rgba(59, 130, 246, 0.3)",
                  "0 15px 35px rgba(59, 130, 246, 0.5)",
                  "0 10px 25px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Button
                onClick={handleFloatingClick}
                size="lg"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-lg"
            >
              Install LingslatePal
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-4 border-transparent border-l-slate-900" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
