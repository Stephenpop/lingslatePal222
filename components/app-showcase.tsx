"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, Wifi, WifiOff, Download, Zap } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Optimized for mobile learning on the go",
  },
  {
    icon: Monitor,
    title: "Desktop Ready",
    description: "Full-featured experience on desktop",
  },
  {
    icon: WifiOff,
    title: "Offline Mode",
    description: "Learn without internet connection",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant translations and responses",
  },
]

export function AppShowcase() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Learn Anywhere, Anytime</h2>
        <p className="mx-auto max-w-2xl text-slate-300">
          Our Progressive Web App works seamlessly across all devices and even offline
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <feature.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                      <p className="text-xs text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Download className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Install as App</h3>
                  <p className="text-sm text-slate-300">Get the native app experience</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Works offline after installation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Push notifications for reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Native app-like experience</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-sm">
            {/* Phone mockup */}
            <div className="relative bg-slate-800 rounded-[2.5rem] p-2 shadow-2xl">
              <div className="bg-slate-900 rounded-[2rem] p-4 h-[600px] overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between text-white text-xs mb-4">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-white rounded-full" />
                      <div className="w-1 h-3 bg-white rounded-full" />
                      <div className="w-1 h-3 bg-white/50 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* App content */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">L</span>
                    </div>
                    <h1 className="text-white font-bold text-lg">LingslatePal</h1>
                  </div>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-3">
                      <div className="text-xs text-slate-400 mb-2">English → Spanish</div>
                      <div className="text-white text-sm mb-2">Hello, how are you?</div>
                      <div className="text-blue-400 text-sm">Hola, ¿cómo estás?</div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-2">
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-3 text-center">
                        <div className="text-yellow-400 text-lg mb-1">🔥</div>
                        <div className="text-white text-sm font-bold">15</div>
                        <div className="text-xs text-slate-400">Day Streak</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-3 text-center">
                        <div className="text-blue-400 text-lg mb-1">⭐</div>
                        <div className="text-white text-sm font-bold">1,250</div>
                        <div className="text-xs text-slate-400">XP Points</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Badge className="w-full justify-center bg-green-500/20 text-green-400 border-green-500/30">
                    <WifiOff className="mr-1 h-3 w-3" />
                    Offline Mode Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
            >
              <Download className="h-4 w-4" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg"
            >
              <Zap className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
