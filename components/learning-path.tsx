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
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
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
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
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
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    icon: Trophy,
    topics: ["Business", "Literature", "Idioms", "Culture", "Advanced Grammar"],
  },
]

export function LearningPath() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Your Learning Journey</h2>
        <p className="mx-auto max-w-2xl text-slate-300">
          Follow our structured learning paths designed by language experts to take you from beginner to fluent
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {learningPaths.map((path, index) => (
          <motion.div
            key={path.level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Card
              className={`border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all h-full ${path.borderColor} border-2`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className={`${path.bgColor} ${path.color}`}>
                    {path.level}
                  </Badge>
                  <div className={`p-2 rounded-lg ${path.bgColor}`}>
                    <path.icon className={`h-6 w-6 ${path.color}`} />
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{path.title}</CardTitle>
                <p className="text-slate-300 text-sm">{path.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{path.lessons}</div>
                    <div className="text-xs text-slate-400">Lessons</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.duration.split("-")[0]}
                    </div>
                    <div className="text-xs text-slate-400">Duration</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                      <Users className="h-4 w-4" />
                      {path.students}
                    </div>
                    <div className="text-xs text-slate-400">Students</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-white">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {path.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs border-white/20 text-slate-300">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className={`w-full ${path.bgColor} ${path.color} hover:bg-opacity-30 border-0`}>
                  Start {path.level} Path
                  <ArrowRight className="ml-2 h-4 w-4" />
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
        className="text-center mt-12"
      >
        <Card className="mx-auto max-w-2xl border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">Not sure where to start?</h3>
            <p className="text-slate-300 mb-4">Take our quick assessment to find the perfect learning path for you</p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
