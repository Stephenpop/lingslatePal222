"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, BookOpen, BarChart3, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Globe,
    title: "Translate Instantly",
    description:
      "Start with our free translation tool. No signup required - just type and translate between 100+ languages.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  {
    icon: BookOpen,
    title: "Learn with Lessons",
    description:
      "Dive deeper with interactive lessons, vocabulary building, and pronunciation practice with native audio.",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Monitor your learning journey with detailed analytics, streaks, achievements, and personalized insights.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
]

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">How LingslatePal Works</h2>
        <p className="mx-auto max-w-2xl text-slate-300">
          Get started in three simple steps and begin your language learning journey today
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
            className="relative"
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm h-full">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} mb-4`}>
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>

                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>

            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-slate-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
