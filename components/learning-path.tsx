"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Brain, Trophy, ArrowRight, Clock, Users } from "lucide-react"

const learningPaths = [
  {
    level: "Beginner",
    title: "Foundation Builder",
    description: "Master basic vocabulary, greetings, and essential phrases",
    lessons: 15,
    duration: "2-3 weeks",
    students: "45K",
    progress: 0,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: BookOpen,
    topics: ["Greetings", "Numbers", "Family", "Colors", "Food Basics"],
  },
  {
    level: "Intermediate",
    title: "Conversation Master",
    description: "Build conversational skills and grammar understanding",
    lessons: 25,
    duration: "4-6 weeks",
    students: "32K",
    progress: 0,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Brain,
    topics: ["Past Tense", "Travel", "Shopping", "Directions", "Hobbies"],
  },
  {
    level: "Advanced",
    title: "Fluency Expert",
    description: "Achieve fluency with complex grammar and cultural nuances",
    lessons: 35,
    duration: "8-12 weeks",
    students: "18K",
    progress: 0,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Trophy,
    topics: ["Business", "Literature", "Idioms", "Culture", "Advanced Grammar"],
  },
]

export function LearningPath() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Learning Journey</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Follow our structured learning paths designed by language experts to take you from beginner to fluent
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card
                className={`border-2 ${path.borderColor} bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full group`}
              >
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <Badge className={`${path.bgColor} ${path.color} border-0 px-3 py-1 text-sm font-semibold`}>
                      {path.level}
                    </Badge>
                    <div
                      className={`p-3 rounded-xl ${path.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <path.icon className={`h-8 w-8 ${path.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900 text-2xl mb-3">{path.title}</CardTitle>
                  <p className="text-slate-600 leading-relaxed">{path.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{path.lessons}</div>
                      <div className="text-sm text-slate-600">Lessons</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1">
                        <Clock className="h-5 w-5" />
                        {path.duration.split("-")[0]}
                      </div>
                      <div className="text-sm text-slate-600">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1">
                        <Users className="h-5 w-5" />
                        {path.students}
                      </div>
                      <div className="text-sm text-slate-600">Students</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-slate-900 font-semibold">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-3" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="text-xs border-slate-300 text-slate-600 hover:bg-slate-50"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className={`w-full ${path.bgColor} ${path.color} hover:opacity-80 border-0 py-3 font-semibold`}
                  >
                    Start {path.level} Path
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-center mt-16"
        >
          <Card className="mx-auto max-w-2xl border-slate-200 bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Not sure where to start?</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Take our quick assessment to find the perfect learning path for you
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 font-semibold">
                Take Assessment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
