"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Trophy, Flame, Star, Play, Lock, CheckCircle, Languages, Target, Zap } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import type { Lesson, Profile } from "@/lib/supabase"

export default function LearnPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (!currentUser) {
          window.location.href = "/auth/login"
          return
        }

        setUser(currentUser)
        setProfile(currentUser.profile || null)

        // Load lessons
        const { data: lessonsData } = await supabase
          .from("lessons")
          .select("*")
          .eq("is_published", true)
          .order("order_index")

        setLessons(lessonsData || [])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LingslatePal</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/translate">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Translate
                </Button>
              </Link>
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {profile?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.full_name || "Learner"}! 👋</h1>
          <p className="text-slate-300">Ready to continue your language learning journey?</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Stats Cards */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Flame className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{profile?.current_streak || 0}</div>
                      <div className="text-xs text-slate-400">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{profile?.xp_points || 0}</div>
                      <div className="text-xs text-slate-400">XP Points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-xs text-slate-400">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">B1</div>
                      <div className="text-xs text-slate-400">Level</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lessons Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Pick up where you left off with your Spanish lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="secondary"
                            className={`${
                              lesson.difficulty === "beginner"
                                ? "bg-green-500/20 text-green-400"
                                : lesson.difficulty === "intermediate"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {lesson.difficulty}
                          </Badge>
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            {index === 0 ? (
                              <Play className="h-4 w-4 text-blue-400" />
                            ) : (
                              <Lock className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                        <h3 className="font-semibold text-white mb-2">{lesson.title}</h3>
                        <p className="text-sm text-slate-400 mb-3">{lesson.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <Button
                          className="w-full mt-3"
                          variant={index === 0 ? "default" : "secondary"}
                          disabled={index !== 0}
                        >
                          {index === 0 ? "Start Lesson" : "Locked"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goal */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">2/5</div>
                  <p className="text-xs text-slate-400 mb-3">Lessons completed today</p>
                  <Progress value={40} className="h-2 mb-3" />
                  <Button size="sm" className="w-full">
                    <Zap className="mr-2 h-3 w-3" />
                    Keep Going!
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="text-sm font-semibold text-white">First Translation</div>
                    <div className="text-xs text-slate-400">+10 XP</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📚</div>
                  <div>
                    <div className="text-sm font-semibold text-white">First Lesson</div>
                    <div className="text-xs text-slate-400">+20 XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/translate">
                  <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                    Quick Translate
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                    Take Quiz
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                    View Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
