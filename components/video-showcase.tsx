"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center mb-12"
        >
          <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">See LingslatePal in Action</h2>
          <p className="text-base sm:text-lg text-slate-600">
            Watch how easy it is to learn languages and translate text with our platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <Card className="border-slate-200 bg-white shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-blue-900">
                {/* Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Demo Video Coming Soon</h3>
                    <p className="text-white/80 text-sm">
                      We're creating an amazing demo video to show you all the features
                    </p>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button size="sm" variant="ghost" onClick={togglePlay} className="text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <span className="text-white text-sm">0:00 / 2:30</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full w-0 transition-all duration-300"></div>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-slate-900">
                    ✨ Instant Translation
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-slate-900">
                    📚 Interactive Lessons
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-slate-900">
                    🧠 Smart Quizzes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Features */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl">🎯</div>
              <h4 className="font-semibold text-slate-900">Quick Start</h4>
              <p className="text-sm text-slate-600">Get started in under 2 minutes</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">🌍</div>
              <h4 className="font-semibold text-slate-900">Global Languages</h4>
              <p className="text-sm text-slate-600">100+ languages supported</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl">📱</div>
              <h4 className="font-semibold text-slate-900">Any Device</h4>
              <p className="text-sm text-slate-600">Works on mobile, tablet, and desktop</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
