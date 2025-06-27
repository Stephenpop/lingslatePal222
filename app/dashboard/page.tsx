"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Star,
  Flame,
  Target,
  BookOpen,
  Brain,
  Languages,
  Settings,
  LogOut,
  Calendar,
  TrendingUp,
  Play,
  Clock,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [lessonsCompleted, setLessonsCompleted] = useState(0)
  const [quizzesCompleted, setQuizzesCompleted] = useState(0)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }
      setUser(currentUser)

      // Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single()
      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }
      setProfile(profileData)

      // Update streak and last_activity_date
      if (profileData) {
        const today = new Date().toISOString().split('T')[0]
        const lastActivity = profileData.last_activity_date
          ? new Date(profileData.last_activity_date).toISOString().split('T')[0]
          : null
        let updatedStreak = profileData.current_streak || 0
        let updatedLongestStreak = profileData.longest_streak || 0

        if (!lastActivity || lastActivity < today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          if (lastActivity === yesterdayStr) {
            updatedStreak += 1
          } else if (lastActivity < yesterdayStr) {
            updatedStreak = 1
          }
          updatedLongestStreak = Math.max(updatedLongestStreak, updatedStreak)

          const { error: streakError } = await supabase
            .from("profiles")
            .update({
              current_streak: updatedStreak,
              longest_streak: updatedLongestStreak,
              last_activity_date: today,
            })
            .eq("id", currentUser.id)
          if (streakError) throw streakError
          profileData.current_streak = updatedStreak
          profileData.longest_streak = updatedLongestStreak
          profileData.last_activity_date = today
        }
      }

      // Lessons completed
      const { count: lessonsCount } = await supabase
        .from("lesson_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)
      setLessonsCompleted(lessonsCount || 0)

      // Quizzes completed
      const { count: quizzesCount } = await supabase
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)
      setQuizzesCompleted(quizzesCount || 0)

      // Recent activity (last 5 from translations, lessons, quizzes)
      const [translations, lessonProgress, quizAttempts] = await Promise.all([
        supabase
          .from("translations")
          .select("id, source_text, created_at")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("lesson_completions")
          .select("id, lesson_id, completed_at, lessons(title)")
          .eq("user_id", currentUser.id)
          .order("completed_at", { ascending: false })
          .limit(5),
        supabase
          .from("quiz_attempts")
          .select("id, quiz_id, score, completed_at, quizzes(title)")
          .eq("user_id", currentUser.id)
          .order("completed_at", { ascending: false })
          .limit(5),
      ])

      // Merge and sort by date
      let activities: any[] = []
      if (translations.data) {
        activities = activities.concat(
          translations.data.map((t: any) => ({
            type: "translation",
            title: t.source_text,
            time: t.created_at,
            icon: Languages,
            color: "green",
            xp: 25,
          }))
        )
      }
      if (lessonProgress.data) {
        activities = activities.concat(
          lessonProgress.data
            .filter((l: any) => l.completed_at)
            .map((l: any) => ({
              type: "lesson",
              title: l.lessons?.title || "Lesson",
              time: l.completed_at,
              icon: BookOpen,
              color: "blue",
              xp: 50,
            }))
        )
      }
      if (quizAttempts.data) {
        activities = activities.concat(
          quizAttempts.data.map((q: any) => ({
            type: "quiz",
            title: q.quizzes?.title || "Quiz",
            time: q.completed_at,
            icon: Brain,
            color: "purple",
            xp: q.score || 100,
          }))
        )
      }
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecentActivity(activities.slice(0, 5))

      // Achievements
      const { data: userAchievements } = await supabase
        .from("user_achievements")
        .select("earned_at, achievements(name, description, icon, xp_reward)")
        .eq("user_id", currentUser.id)
      const allAchievements = (userAchievements || []).map((ua: any) => ({
        title: ua.achievements?.name,
        description: ua.achievements?.description,
        earned: !!ua.earned_at,
        xp: ua.achievements?.xp_reward,
        icon: ua.achievements?.icon || "🏆",
      }))
      setAchievements(allAchievements)
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push("/auth/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  const stats = {
    xp: profile?.xp_points || 0,
    streak: profile?.current_streak || 0,
    lessonsCompleted,
    quizzesCompleted,
    level: Math.floor((profile?.xp_points || 0) / 1000) + 1,
    nextLevelXP: (Math.floor((profile?.xp_points || 0) / 1000) + 1) * 1000 - (profile?.xp_points || 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <motion.nav
        className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Languages className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-slate-800">LingslatePal</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/profile">
                <div className="flex items-center space-x-2 hover:bg-slate-100 p-2 rounded transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-800">
                      {profile?.full_name || user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-slate-600">Level {stats.level}</p>
                  </div>
                </div>
              </Link>

              <Link href="/support">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100 p-2 sm:p-4">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Support</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="text-slate-700 hover:bg-slate-100 p-2 sm:p-4">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "Learner"}! 👋
              </h1>
              <p className="text-slate-600">Ready to continue your language learning journey?</p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
              <Flame className="mr-1 h-4 w-4" />
              {stats.streak} day streak
            </Badge>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total XP</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.xp.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Current Streak</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.streak} days</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Level</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.level}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Lessons Done</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.lessonsCompleted}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Level Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Level Progress
              </CardTitle>
              <CardDescription className="text-slate-600">
                {stats.nextLevelXP} XP needed to reach Level {stats.level + 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={((stats.xp % 1000) / 1000) * 100} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-slate-600">
                <span>Level {stats.level}</span>
                <span>Level {stats.level + 1}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid gap-4 md:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/learn">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Continue Learning</h3>
                  <p className="text-sm text-slate-600 mb-4">Pick up where you left off</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/quiz">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Take a Quiz</h3>
                  <p className="text-sm text-slate-600 mb-4">Test your knowledge</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Zap className="mr-2 h-4 w-4" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/translate">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Languages className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Translate</h3>
                  <p className="text-sm text-slate-600 mb-4">Practice with real text</p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Languages className="mr-2 h-4 w-4" />
                    Translate
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>

        {/* Tabs Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 border border-slate-200">
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Recent Activity
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Statistics
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="activity" key="activity">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Recent Activity</CardTitle>
                      <CardDescription className="text-slate-600">Your latest learning activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                          <div className="text-slate-600 text-center py-8">No recent activity yet.</div>
                        ) : (
                          recentActivity.map((activity, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                                  <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{activity.title}</p>
                                  <p className="text-sm text-slate-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {activity.time ? new Date(activity.time).toLocaleString() : ""}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">+{activity.xp} XP</Badge>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="achievements" key="achievements">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Achievements</CardTitle>
                      <CardDescription className="text-slate-600">Your learning milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {achievements.length === 0 ? (
                          <div className="text-slate-600 text-center py-8">No achievements earned yet.</div>
                        ) : (
                          achievements.map((achievement, index) => (
                            <motion.div
                              key={index}
                              className={`p-4 border rounded-lg transition-all ${
                                achievement.earned
                                  ? "border-green-200 bg-green-50 shadow-md"
                                  : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                              }`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`text-2xl ${achievement.earned ? "grayscale-0" : "grayscale"}`}>
                                  {typeof achievement.icon === "string" ? achievement.icon : <achievement.icon />}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-slate-800">{achievement.title}</h4>
                                  <p className="text-sm text-slate-600">{achievement.description}</p>
                                </div>
                                <Badge
                                  className={
                                    achievement.earned ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                                  }
                                >
                                  {achievement.xp} XP
                                </Badge>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="stats" key="stats">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-slate-800 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Learning Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Lessons Completed</span>
                          <span className="font-medium text-slate-800">{stats.lessonsCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Quizzes Completed</span>
                          <span className="font-medium text-slate-800">{stats.quizzesCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Average Score</span>
                          <span className="font-medium text-slate-800">87%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Study Time</span>
                          <span className="font-medium text-slate-800">24 hours</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-slate-800 flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          This Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Days Active</span>
                          <span className="font-medium text-slate-800">5/7</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">XP Earned</span>
                          <span className="font-medium text-slate-800">450 XP</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Time Studied</span>
                          <span className="font-medium text-slate-800">3.2 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Streak Status</span>
                          <Badge className="bg-orange-100 text-orange-800">
                            <Flame className="h-3 w-3 mr-1" />
                            {stats.streak} days
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
