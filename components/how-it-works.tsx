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
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: BookOpen,
    title: "Learn with Lessons",
    description:
      "Dive deeper with interactive lessons, vocabulary building, and pronunciation practice with native audio.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Monitor your learning journey with detailed analytics, streaks, achievements, and personalized insights.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How LingslatePal Works</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Get started in three simple steps and begin your language learning journey today
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              className="relative"
            >
              <Card
                className={`border-2 ${step.borderColor} bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full group`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className={`h-10 w-10 ${step.color}`} />
                  </div>

                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shadow-md">
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
