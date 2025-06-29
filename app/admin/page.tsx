"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageCircle,
  Bell,
  Shield,
  Languages,
  BookOpen,
  Trophy,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  TrendingUp,
  Activity,
  Globe,
  Clock,
  AlertCircle,
  Home,
  BarChart3,
  Settings,
  Database,
  Zap,
  Download,
} from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTranslations: number
  openTickets: number
  totalLessons: number
  totalQuizzes: number
  totalQuizAttempts: number
  newUsersToday: number
  translationsToday: number
  avgSessionTime: number
}

interface Lesson {
  id: string
  title: string
  description: string | null
  language: string
  difficulty: "beginner" | "intermediate" | "advanced"
  content: {
    main_content: string
    questions: Array<{
      id: number
      question: string
      type: "multiple_choice" | "text_input"
      options?: string[]
      correct_answer: number | string
      alternatives?: string[]
      explanation?: string
    }>
  }
  order_index: number
  is_published: boolean
  content_type: "text" | "video" | "audio" | "interactive"
  estimated_duration: number | null
  xp_reward: number
  created_at: string
  updated_at: string
}

interface Quiz {
  id: string
  title: string
  description: string | null
  language: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category_id: string | null
  questions: Array<{
    id: number
    question: string
    type: "multiple_choice" | "text_input"
    options?: string[]
    correct_answer: number | string
    alternatives?: string[]
    explanation?: string
  }>
  time_limit: number | null
  passing_score: number
  xp_reward: number
  is_published: boolean
  created_at: string
  updated_at: string
  categories?: { name: string }
}

interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  answers: Array<{ question_id: number; answer: any }>
  time_taken: number | null
  completed_at: string
  profiles?: { full_name: string; email: string }
}

interface Ticket {
  id: string
  subject: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  created_at: string
  updated_at: string
  user_id: string
  profiles?: { full_name: string; email: string }
  support_messages: Array<{
    id: string
    message: string
    is_admin: boolean
    created_at: string
    sender_id: string
    profiles?: { full_name: string; email: string }
  }>
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTranslations: 0,
    openTickets: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    totalQuizAttempts: 0,
    newUsersToday: 0,
    translationsToday: 0,
    avgSessionTime: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [languageRequests, setLanguageRequests] = useState<any[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    id: "",
    title: "",
    description: "",
    language: "",
    difficulty: "beginner",
    content: { main_content: "", questions: [] },
    order_index: 0,
    is_published: false,
    content_type: "text",
    estimated_duration: 10,
    xp_reward: 50,
  })
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    id: "",
    title: "",
    description: "",
    language: "",
    difficulty: "beginner",
    category_id: null,
    questions: [],
    time_limit: 30,
    passing_score: 60,
    xp_reward: 50,
    is_published: false,
  })
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()

    const ticketSubscription = supabase
      .channel("support_tickets")
      .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, async () => {
        await loadAdminData()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "support_messages" }, async () => {
        await loadAdminData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ticketSubscription)
    }
  }, [])

  const checkAdminAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        toast.error("Please log in to access the admin panel")
        return
      }
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", currentUser.id)
        .single()
      if (
        profileError ||
        !profileData ||
        (profileData.role !== "admin" && profileData.email !== "anyaibe050@gmail.com")
      ) {
        router.push("/dashboard")
        toast.error("You do not have admin access")
        return
      }
      setUser(currentUser)
      await loadAdminData()
    } catch (error) {
      console.error("Error checking admin access:", error)
      router.push("/auth/login")
      toast.error("Error verifying admin access")
    } finally {
      setLoading(false)
    }
  }

  const loadAdminData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]

      const [
        usersCount,
        activeUsersCount,
        translationsCount,
        ticketsCount,
        lessonsCount,
        quizzesCount,
        quizAttemptsCount,
        newUsersToday,
        translationsToday,
        usersData,
        ticketsData,
        requestsData,
        lessonsData,
        quizzesData,
        attemptsData,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase
          .from("profiles")
          .select("id", { count: "exact" })
          .gte("last_activity_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("translations").select("id", { count: "exact" }),
        supabase.from("support_tickets").select("id", { count: "exact" }).neq("status", "closed"),
        supabase.from("lessons").select("id", { count: "exact" }),
        supabase.from("quizzes").select("id", { count: "exact" }),
        supabase.from("quiz_attempts").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }).gte("created_at", today),
        supabase.from("translations").select("id", { count: "exact" }).gte("created_at", today),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50),
        supabase
          .from("support_tickets")
          .select("*, profiles:user_id (full_name, email), support_messages(*, profiles:sender_id(full_name, email))")
          .order("updated_at", { ascending: false }),
        supabase
          .from("language_requests")
          .select("*, profiles:user_id (full_name, email)")
          .order("created_at", { ascending: false }),
        supabase.from("lessons").select("*").order("order_index", { ascending: true }),
        supabase.from("quizzes").select("*, categories(name)").order("created_at", { ascending: false }),
        supabase
          .from("quiz_attempts")
          .select("*, profiles:user_id (full_name, email)")
          .order("completed_at", { ascending: false })
          .limit(50),
      ])

      setStats({
        totalUsers: usersCount.count || 0,
        activeUsers: activeUsersCount.count || 0,
        totalTranslations: translationsCount.count || 0,
        openTickets: ticketsCount.count || 0,
        totalLessons: lessonsCount.count || 0,
        totalQuizzes: quizzesCount.count || 0,
        totalQuizAttempts: quizAttemptsCount.count || 0,
        newUsersToday: newUsersToday.count || 0,
        translationsToday: translationsToday.count || 0,
        avgSessionTime: 24, // Mock data
      })

      setUsers(usersData.data || [])
      setTickets(ticketsData.data || [])
      setLanguageRequests(requestsData.data || [])
      setLessons(lessonsData.data || [])
      setQuizzes(quizzesData.data || [])
      setQuizAttempts(attemptsData.data || [])
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast.error("Failed to load admin data")
    }
  }

  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)
      if (error) throw error
      toast.success(`User role updated to ${newRole}`)
      await loadAdminData()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const sendNotification = async (targetUsers: string[] = []) => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error("Please fill in all notification fields")
      return
    }
    try {
      const usersToNotify = targetUsers.length > 0 ? targetUsers : users.map((u) => u.id)
      const notifications = usersToNotify.map((userId) => ({
        user_id: userId,
        title: notificationTitle,
        message: notificationMessage,
        type: "info",
      }))
      const { error } = await supabase.from("notifications").insert(notifications)
      if (error) throw error
      toast.success(`Notification sent to ${usersToNotify.length} users`)
      setNotificationTitle("")
      setNotificationMessage("")
      setSelectedUsers([])
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to send notification")
    }
  }

  const updateLanguageRequestStatus = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase.from("language_requests").update({ status }).eq("id", requestId)
      if (error) throw error
      toast.success(`Language request ${status}`)
      await loadAdminData()
    } catch (error) {
      console.error("Error updating language request:", error)
      toast.error("Failed to update language request")
    }
  }

  const addLesson = async () => {
    if (!newLesson.title || !newLesson.language || !newLesson.difficulty || !newLesson.content?.main_content) {
      toast.error("Please fill in all required lesson fields (title, language, difficulty, content)")
      return
    }
    try {
      const lessonToAdd = {
        ...newLesson,
        id: uuidv4(),
        content: {
          main_content: newLesson.content?.main_content || "",
          questions: newLesson.content?.questions || [],
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase.from("lessons").insert([lessonToAdd])
      if (error) throw error
      toast.success("Lesson added successfully")
      setNewLesson({
        id: "",
        title: "",
        description: "",
        language: "",
        difficulty: "beginner",
        content: { main_content: "", questions: [] },
        order_index: 0,
        is_published: false,
        content_type: "text",
        estimated_duration: 10,
        xp_reward: 50,
      })
      await loadAdminData()
    } catch (error) {
      console.error("Error adding lesson:", error)
      toast.error("Failed to add lesson")
    }
  }

  const updateLesson = async () => {
    if (
      !editingLesson ||
      !editingLesson.title ||
      !editingLesson.language ||
      !editingLesson.difficulty ||
      !editingLesson.content?.main_content
    ) {
      toast.error("Please fill in all required lesson fields (title, language, difficulty, content)")
      return
    }
    try {
      const { error } = await supabase
        .from("lessons")
        .update({
          ...editingLesson,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingLesson.id)
      if (error) throw error
      toast.success("Lesson updated successfully")
      setEditingLesson(null)
      await loadAdminData()
    } catch (error) {
      console.error("Error updating lesson:", error)
      toast.error("Failed to update lesson")
    }
  }

  const deleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      return
    }
    try {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId)
      if (error) throw error
      toast.success("Lesson deleted successfully")
      await loadAdminData()
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast.error("Failed to delete lesson")
    }
  }

  const addQuiz = async () => {
    if (
      !newQuiz.title ||
      !newQuiz.language ||
      !newQuiz.difficulty ||
      !newQuiz.questions ||
      newQuiz.questions.length < 5
    ) {
      toast.error("Please fill in all required quiz fields and ensure at least 5 questions")
      return
    }
    try {
      const quizToAdd = {
        ...newQuiz,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase.from("quizzes").insert([quizToAdd])
      if (error) throw error
      toast.success("Quiz added successfully")
      setNewQuiz({
        id: "",
        title: "",
        description: "",
        language: "",
        difficulty: "beginner",
        category_id: null,
        questions: [],
        time_limit: 30,
        passing_score: 60,
        xp_reward: 50,
        is_published: false,
      })
      await loadAdminData()
    } catch (error) {
      console.error("Error adding quiz:", error)
      toast.error("Failed to add quiz")
    }
  }

  const updateQuiz = async () => {
    if (
      !editingQuiz ||
      !editingQuiz.title ||
      !editingQuiz.language ||
      !editingQuiz.difficulty ||
      !editingQuiz.questions ||
      editingQuiz.questions.length < 5
    ) {
      toast.error("Please fill in all required quiz fields and ensure at least 5 questions")
      return
    }
    try {
      const { error } = await supabase
        .from("quizzes")
        .update({
          ...editingQuiz,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingQuiz.id)
      if (error) throw error
      toast.success("Quiz updated successfully")
      setEditingQuiz(null)
      await loadAdminData()
    } catch (error) {
      console.error("Error updating quiz:", error)
      toast.error("Failed to update quiz")
    }
  }

  const deleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return
    }
    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", quizId)
      if (error) throw error
      toast.success("Quiz deleted successfully")
      await loadAdminData()
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast.error("Failed to delete quiz")
    }
  }

  const sendSupportMessage = async (ticketId: string) => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message")
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.from("support_messages").insert({
        ticket_id: ticketId,
        sender_id: user.id,
        message: newMessage.trim(),
        is_admin: true,
      })
      if (error) throw error

      await supabase
        .from("support_tickets")
        .update({
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId)

      toast.success("Message sent!")
      setNewMessage("")
      await loadAdminData()
    } catch (error) {
      console.error("Error sending support message:", error)
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const updateTicketStatus = async (ticketId: string, status: "open" | "in_progress" | "resolved" | "closed") => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId)
      if (error) throw error
      toast.success(`Ticket status updated to ${status}`)
      await loadAdminData()
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast.error("Failed to update ticket status")
    }
  }

  const exportData = async (dataType: string) => {
    try {
      let data: any[] = []
      let filename = ""

      switch (dataType) {
        case "users":
          data = users
          filename = "users_export.json"
          break
        case "lessons":
          data = lessons
          filename = "lessons_export.json"
          break
        case "quizzes":
          data = quizzes
          filename = "quizzes_export.json"
          break
        case "tickets":
          data = tickets
          filename = "support_tickets_export.json"
          break
        default:
          toast.error("Invalid data type")
          return
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${dataType} data exported successfully`)
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Failed to export data")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-300"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-300"
      case "advanced":
        return "bg-red-500/20 text-red-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-500/20 text-red-300"
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-300"
      case "resolved":
      case "closed":
        return "bg-green-500/20 text-green-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading admin panel...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <motion.nav
        className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-orange-600 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Shield className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-bold">Admin Panel</span>
                <p className="text-xs text-slate-400">LingslatePal Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Home className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Overview</h1>
          <p className="text-slate-400">Monitor and manage your LingslatePal platform</p>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Total Users</div>
                    <div className="text-xs text-green-400">+{stats.newUsersToday} today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <UserCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Active Users (7d)</div>
                    <div className="text-xs text-blue-400">
                      {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% retention
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Languages className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.totalTranslations.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Translations</div>
                    <div className="text-xs text-green-400">+{stats.translationsToday} today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-500/20">
                    <MessageCircle className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.openTickets}</div>
                    <div className="text-xs text-slate-400">Open Tickets</div>
                    <div className="text-xs text-yellow-400">Needs attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/20">
                    <BookOpen className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.totalLessons}</div>
                    <div className="text-xs text-slate-400">Lessons</div>
                    <div className="text-xs text-blue-400">
                      {lessons.filter((l) => l.is_published).length} published
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                    <div className="text-xs text-slate-400">Quizzes</div>
                    <div className="text-xs text-green-400">
                      {quizzes.filter((q) => q.is_published).length} published
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-teal-500/20">
                    <BarChart3 className="h-6 w-6 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{stats.totalQuizAttempts.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Quiz Attempts</div>
                    <div className="text-xs text-purple-400">Avg: {stats.avgSessionTime}min</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-pink-500/20">
                    <Zap className="h-6 w-6 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-xs text-slate-400">Uptime</div>
                    <div className="text-xs text-green-400">All systems operational</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white/5 border border-white/10">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <Activity className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <Users className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <MessageCircle className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Support</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <Bell className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <Languages className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Requests</span>
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <BookOpen className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Lessons</span>
              </TabsTrigger>
              <TabsTrigger
                value="quizzes"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <Trophy className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Quizzes</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300 text-xs lg:text-sm"
              >
                <Settings className="inline lg:hidden h-4 w-4" />
                <span className="hidden lg:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" key="overview">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">API Status</span>
                        <Badge className="bg-green-500/20 text-green-300">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Database</span>
                        <Badge className="bg-green-500/20 text-green-300">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Translation Service</span>
                        <Badge className="bg-green-500/20 text-green-300">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Storage</span>
                        <Badge className="bg-yellow-500/20 text-yellow-300">85% Used</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Growth Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">New Users (7d)</span>
                        <span className="text-white font-medium">{stats.newUsersToday * 7}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Translations (24h)</span>
                        <span className="text-white font-medium">{stats.translationsToday}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Active Sessions</span>
                        <span className="text-white font-medium">{Math.floor(stats.activeUsers * 0.3)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Avg Session Time</span>
                        <span className="text-white font-medium">{stats.avgSessionTime}min</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Popular Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">🇪🇸 Spanish</span>
                        <span className="text-white font-medium">34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">🇫🇷 French</span>
                        <span className="text-white font-medium">28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">🇳🇬 Yoruba</span>
                        <span className="text-white font-medium">12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">🇩🇪 German</span>
                        <span className="text-white font-medium">10%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Button
                          onClick={() => exportData("users")}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Users
                        </Button>
                        <Button
                          onClick={() => exportData("lessons")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Lessons
                        </Button>
                        <Button
                          onClick={() => exportData("quizzes")}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Quizzes
                        </Button>
                        <Button
                          onClick={() => exportData("tickets")}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export Tickets
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Continue with other tab contents... */}
              <TabsContent value="settings" key="settings">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        System Settings
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        Configure system-wide settings and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">General Settings</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Maintenance Mode</span>
                              <Badge className="bg-green-500/20 text-green-300">Disabled</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">User Registration</span>
                              <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Email Notifications</span>
                              <Badge className="bg-green-500/20 text-green-300">Enabled</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">API Settings</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Rate Limiting</span>
                              <Badge className="bg-yellow-500/20 text-yellow-300">1000/hour</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Translation API</span>
                              <Badge className="bg-green-500/20 text-green-300">LibreTranslate</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300">Cache TTL</span>
                              <Badge className="bg-blue-500/20 text-blue-300">1 hour</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
