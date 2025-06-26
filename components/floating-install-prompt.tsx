"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Monitor, Wifi } from "lucide-react"
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
      if (window.matchMedia("(display-mode: standalone)").matches) {
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
    if (!deferredPrompt) return

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
            <Card className="w-full max-w-md border-blue-500/20 bg-gradient-to-br from-slate-900/95 to-blue-900/95 backdrop-blur-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Install LingslatePal</CardTitle>
                <CardDescription className="text-slate-300">
                  Get the full app experience with offline access and native features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                      <Wifi className="h-6 w-6 text-green-400" />
                    </div>
                    <p className="text-xs text-slate-300">Works Offline</p>
                  </div>
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                      <Smartphone className="h-6 w-6 text-blue-400" />
                    </div>
                    <p className="text-xs text-slate-300">Mobile Ready</p>
                  </div>
                  <div className="space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                      <Monitor className="h-6 w-6 text-purple-400" />
                    </div>
                    <p className="text-xs text-slate-300">Desktop App</p>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-white/5 p-3">
                  <h4 className="text-sm font-semibold text-white">✨ App Features:</h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    <li>• Instant access from home screen</li>
                    <li>• Offline translation & lessons</li>
                    <li>• Push notifications for streaks</li>
                    <li>• Faster loading & better performance</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install App
                  </Button>
                  <Button variant="ghost" onClick={handleDismiss} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-center text-xs text-slate-400">Free • No ads • Works on all devices</p>
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
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-2 text-sm text-white backdrop-blur-sm"
            >
              Install LingslatePal
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-4 border-transparent border-l-black/80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
