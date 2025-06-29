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
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Monitor,
    title: "Desktop Ready",
    description: "Full-featured experience on desktop",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: WifiOff,
    title: "Offline Mode",
    description: "Learn without internet connection",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant translations and responses",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

export function AppShowcase() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Learn Anywhere, Anytime</h2>
          <p className="mx-auto max-w-3xl text-xl text-blue-100">
            Our Progressive Web App works seamlessly across all devices and even offline
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                        <p className="text-blue-100 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 border-emerald-500/30 bg-gradient-to-r from-emerald-600/80 to-blue-600/80">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-emerald-100">
                    <Download className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xl">Install as App</h3>
                    <p className="text-blue-100">Get the native app experience</p>
                  </div>
                </div>
                <div className="space-y-3 text-blue-100 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span>Works offline after installation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span>Push notifications for reminders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span>Native app-like experience</span>
                  </div>
                </div>
                <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600 font-semibold py-3 rounded-lg">
                  <Download className="mr-2 h-5 w-5" />
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
              <div className="relative bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-slate-800 rounded-[2rem] p-4 h-[600px] overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between text-white text-xs mb-6">
                    <span>9:41</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white rounded-full" />
                        <div className="w-1 h-4 bg-white rounded-full" />
                        <div className="w-1 h-4 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* App content */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">L</span>
                      </div>
                      <h1 className="text-white font-bold text-xl">LingslatePal</h1>
                    </div>

                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="text-xs text-blue-300 mb-2">English → Spanish</div>
                        <div className="text-white text-sm mb-3">Hello, how are you?</div>
                        <div className="text-blue-300 text-sm">Hola, ¿cómo estás?</div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                          <div className="text-orange-400 text-2xl mb-2">🔥</div>
                          <div className="text-white text-lg font-bold">15</div>
                          <div className="text-xs text-blue-200">Day Streak</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                          <div className="text-yellow-400 text-2xl mb-2">⭐</div>
                          <div className="text-white text-lg font-bold">1,250</div>
                          <div className="text-xs text-blue-200">XP Points</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Badge className="w-full justify-center bg-emerald-500/20 text-emerald-300 border-emerald-500/30 py-2">
                      <WifiOff className="mr-2 h-4 w-4" />
                      Offline Mode Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -top-6 -right-6 bg-emerald-500 text-white p-3 rounded-full shadow-xl"
              >
                <Download className="h-6 w-6" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-blue-500 text-white p-3 rounded Rounded-full shadow-xl">
                <Zap className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
