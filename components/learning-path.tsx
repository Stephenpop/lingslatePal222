"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Trophy, Target, ArrowRight, CheckCircle, Clock, Star } from "lucide-react"
import Link from "next/link"

const learningSteps = [
  {
    icon: BookOpen,
    title: "Start with Basics",
    description: "Begin your journey with fundamental vocabulary and grammar through interactive lessons.",
    duration: "2-3 weeks",
    difficulty: "Beginner",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    icon: Brain,
    title: "Practice with Quizzes",
    description: "Test your knowledge with adaptive quizzes that adjust to your learning pace.",
    duration: "Ongoing",
    difficulty: "All Levels",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: Target,
    title: "Real-world Application",
    description: "Apply your skills with practical translation exercises and conversation practice.",
    duration: "4-6 weeks",
    difficulty: "Intermediate",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    icon: Trophy,
    title: "Master the Language",
    description: "Achieve fluency through advanced lessons and earn certificates of completion.",
    duration: "3-6 months",
    difficulty: "Advanced",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
]

export function LearningPath() {
  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-12 sm:mb-16"
        >
          <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Your Learning Journey</h2>
          <p className="text-base sm:text-lg text-slate-600">
            Follow our structured path to language mastery, designed by language learning experts
          </p>
        </motion.div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {learningSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card
                className={`${step.borderColor} ${step.bgColor} border-2 hover:shadow-lg transition-all duration-300 h-full`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${step.color} shadow-lg`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs font-medium">
                      Step {index + 1}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{step.title}</CardTitle>
                  <CardDescription className="text-slate-600">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-4 w-4" />
                        {step.duration}
                      </div>
                      <Badge className={`bg-gradient-to-r ${step.color} text-white border-0`}>{step.difficulty}</Badge>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Recommended for all learners</span>
                    </div>

                    <Link href="/dashboard">
                      <Button
                        className={`w-full bg-gradient-to-r ${step.color} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-200 mt-4`}
                      >
                        {index === 0 ? "Start Learning" : "Continue Journey"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Connection Line */}
              {index < learningSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
            <CardContent className="p-8">
              <div className="mx-auto max-w-2xl">
                <h3 className="mb-4 text-2xl font-bold text-slate-900">Ready to Start Your Journey?</h3>
                <p className="mb-6 text-slate-600">
                  Join thousands of learners who have successfully mastered new languages with LingslatePal
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Start Free Today
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 bg-transparent"
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      Take Assessment
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
