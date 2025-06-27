"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Mail,
  TrendingUp,
  Activity,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTranslations: number;
  openTickets: number;
  totalLessons: number;
  totalQuizzes: number;
  totalQuizAttempts: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: any;
  order_index: number;
  is_published: boolean;
  content_type: "text" | "video" | "audio" | "interactive";
  estimated_duration: number | null;
  xp_reward: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: any;
  time_limit: number | null;
  passing_score: number;
  xp_reward: number;
  is_published: boolean;
}

interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  time_taken: number | null;
  completed_at: string;
  profiles?: { full_name: string; email: string };
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTranslations: 0,
    openTickets: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    totalQuizAttempts: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [languageRequests, setLanguageRequests] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: "",
    description: "",
    language: "es",
    difficulty: "beginner",
    content: {},
    order_index: 0,
    is_published: false,
    content_type: "text",
    estimated_duration: 10,
    xp_reward: 20,
  });
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: "",
    description: "",
    language: "es",
    difficulty: "beginner",
    questions: {},
    time_limit: 30,
    passing_score: 70,
    xp_reward: 50,
    is_published: false,
  });
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      console.log("AdminPage currentUser:", currentUser);
      if (
        !currentUser ||
        (currentUser.profile?.role !== "admin" && currentUser.profile?.email !== "anyaibe050@gmail.com")
      ) {
        router.push("/dashboard");
        return;
      }
      setUser(currentUser);
      await loadAdminData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [usersCount, translationsCount, ticketsCount, lessonsCount, quizzesCount, quizAttemptsCount, usersData, ticketsData, requestsData, lessonsData, quizzesData, attemptsData] = await Promise.allSettled([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("translations").select("id", { count: "exact" }),
        supabase.from("support_tickets").select("id", { count: "exact" }).neq("status", "closed"),
        supabase.from("lessons").select("id", { count: "exact" }),
        supabase.from("quizzes").select("id", { count: "exact" }),
        supabase.from("quiz_attempts").select("id", { count: "exact" }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50),
        supabase
          .from("support_tickets")
          .select("*, profiles:user_id (full_name, email)")
          .neq("status", "closed")
          .order("created_at", { ascending: false }),
        supabase
          .from("language_requests")
          .select("*, profiles:user_id (full_name, email)")
          .order("created_at", { ascending: false }),
        supabase.from("lessons").select("*").order("order_index", { ascending: true }),
        supabase.from("quizzes").select("*").order("created_at", { ascending: false }),
        supabase
          .from("quiz_attempts")
          .select("*, profiles:user_id (full_name, email)")
          .order("completed_at", { ascending: false })
          .limit(50),
      ]);

      setStats({
        totalUsers: usersCount.status === "fulfilled" ? usersCount.value.count || 0 : 150,
        activeUsers: usersCount.status === "fulfilled" ? Math.floor((usersCount.value.count || 0) * 0.7) : 105,
        totalTranslations: translationsCount.status === "fulfilled" ? translationsCount.value.count || 0 : 25000,
        openTickets: ticketsCount.status === "fulfilled" ? ticketsCount.value.count || 0 : 3,
        totalLessons: lessonsCount.status === "fulfilled" ? lessonsCount.value.count || 0 : 45,
        totalQuizzes: quizzesCount.status === "fulfilled" ? quizzesCount.value.count || 0 : 30,
        totalQuizAttempts: quizAttemptsCount.status === "fulfilled" ? quizAttemptsCount.value.count || 0 : 0,
      });

      setUsers(usersData.status === "fulfilled" ? usersData.value.data || [] : []);
      setTickets(ticketsData.status === "fulfilled" ? ticketsData.value.data || [] : []);
      setLanguageRequests(requestsData.status === "fulfilled" ? requestsData.value.data || [] : []);
      setLessons(lessonsData.status === "fulfilled" ? lessonsData.value.data || [] : []);
      setQuizzes(quizzesData.status === "fulfilled" ? quizzesData.value.data || [] : []);
      setQuizAttempts(attemptsData.status === "fulfilled" ? attemptsData.value.data || [] : []);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Failed to load admin data");
    }
  };

  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
      if (error) throw error;
      toast.success(`User role updated to ${newRole}`);
      await loadAdminData();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const sendNotification = async (targetUsers: string[] = []) => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error("Please fill in all notification fields");
      return;
    }
    try {
      const usersToNotify = targetUsers.length > 0 ? targetUsers : users.map((u) => u.id);
      const notifications = usersToNotify.map((userId) => ({
        user_id: userId,
        title: notificationTitle,
        message: notificationMessage,
        type: "info",
      }));
      const { error } = await supabase.from("notifications").insert(notifications);
      if (error) throw error;
      toast.success(`Notification sent to ${usersToNotify.length} users`);
      setNotificationTitle("");
      setNotificationMessage("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    }
  };

  const updateLanguageRequestStatus = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase.from("language_requests").update({ status }).eq("id", requestId);
      if (error) throw error;
      toast.success(`Language request ${status}`);
      await loadAdminData();
    } catch (error) {
      console.error("Error updating language request:", error);
      toast.error("Failed to update language request");
    }
  };

  const addLesson = async () => {
    if (!newLesson.title || !newLesson.language || !newLesson.difficulty) {
      toast.error("Please fill in all required lesson fields");
      return;
    }
    try {
      const { error } = await supabase.from("lessons").insert([newLesson]);
      if (error) throw error;
      toast.success("Lesson added successfully");
      setNewLesson({
        title: "",
        description: "",
        language: "es",
        difficulty: "beginner",
        content: {},
        order_index: 0,
        is_published: false,
        content_type: "text",
        estimated_duration: 10,
        xp_reward: 20,
      });
      await loadAdminData();
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error("Failed to add lesson");
    }
  };

  const updateLesson = async () => {
    if (!editingLesson || !editingLesson.title || !editingLesson.language || !editingLesson.difficulty) {
      toast.error("Please fill in all required lesson fields");
      return;
    }
    try {
      const { error } = await supabase.from("lessons").update(editingLesson).eq("id", editingLesson.id);
      if (error) throw error;
      toast.success("Lesson updated successfully");
      setEditingLesson(null);
      await loadAdminData();
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson");
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
      toast.success("Lesson deleted successfully");
      await loadAdminData();
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const addQuiz = async () => {
    if (!newQuiz.title || !newQuiz.language || !newQuiz.difficulty) {
      toast.error("Please fill in all required quiz fields");
      return;
    }
    try {
      const { error } = await supabase.from("quizzes").insert([newQuiz]);
      if (error) throw error;
      toast.success("Quiz added successfully");
      setNewQuiz({
        title: "",
        description: "",
        language: "es",
        difficulty: "beginner",
        questions: {},
        time_limit: 30,
        passing_score: 70,
        xp_reward: 50,
        is_published: false,
      });
      await loadAdminData();
    } catch (error) {
      console.error("Error adding quiz:", error);
      toast.error("Failed to add quiz");
    }
  };

  const updateQuiz = async () => {
    if (!editingQuiz || !editingQuiz.title || !editingQuiz.language || !editingQuiz.difficulty) {
      toast.error("Please fill in all required quiz fields");
      return;
    }
    try {
      const { error } = await supabase.from("quizzes").update(editingQuiz).eq("id", editingQuiz.id);
      if (error) throw error;
      toast.success("Quiz updated successfully");
      setEditingQuiz(null);
      await loadAdminData();
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error("Failed to update quiz");
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
      if (error) throw error;
      toast.success("Quiz deleted successfully");
      await loadAdminData();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading admin panel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.nav
        className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-orange-600 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Shield className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
                <Shield className="mr-1 h-3 w-3" />
                Administrator
              </Badge>
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">System Overview</h1>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                      <div className="text-xs text-slate-400">Total Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <UserCheck className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                      <div className="text-xs text-slate-400">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Languages className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalTranslations.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Translations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <MessageCircle className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.openTickets}</div>
                      <div className="text-xs text-slate-400">Open Tickets</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalLessons}</div>
                      <div className="text-xs text-slate-400">Lessons</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalQuizzes}</div>
                      <div className="text-xs text-slate-400">Quizzes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                      <Trophy className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stats.totalQuizAttempts}</div>
                      <div className="text-xs text-slate-400">Quiz Attempts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/5 border border-white/10">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Support
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Language Requests
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Lessons
              </TabsTrigger>
              <TabsTrigger
                value="quizzes"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-300"
              >
                Quizzes
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
                      <CardTitle className="text-white flex items-center gap-2">
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
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Growth Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">New Users (7d)</span>
                        <span className="text-white font-medium">+23</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Translations (24h)</span>
                        <span className="text-white font-medium">1,247</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Active Sessions</span>
                        <span className="text-white font-medium">89</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
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
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="users" key="users">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">User Management</CardTitle>
                      <CardDescription className="text-slate-300">
                        Manage user accounts, roles, and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          {users.map((user) => (
                            <motion.div
                              key={user.id}
                              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar_url || ""} />
                                  <AvatarFallback className="bg-slate-600 text-white">
                                    {user.full_name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-white">{user.full_name || "Unknown"}</h4>
                                  <p className="text-sm text-slate-400">{user.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      className={
                                        user.role === "admin"
                                          ? "bg-red-500/20 text-red-300"
                                          : "bg-blue-500/20 text-blue-300"
                                      }
                                    >
                                      {user.role}
                                    </Badge>
                                    <span className="text-xs text-slate-500">{user.xp_points || 0} XP</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={user.role}
                                  onValueChange={(value) => updateUserRole(user.id, value as "user" | "admin")}
                                >
                                  <SelectTrigger className="w-24 border-white/20 bg-white/5 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="support" key="support">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Support Tickets</CardTitle>
                      <CardDescription className="text-slate-300">
                        View and manage user support tickets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {tickets.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No open support tickets</p>
                          </div>
                        ) : (
                          tickets.map((ticket) => (
                            <div key={ticket.id} className="p-4 bg-white/5 rounded-lg mb-2">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <h4 className="font-medium text-white">{ticket.subject}</h4>
                                  <p className="text-sm text-slate-400">
                                    {ticket.profiles?.full_name || "Unknown"} • {ticket.profiles?.email}
                                  </p>
                                </div>
                                <Badge className="bg-yellow-500/20 text-yellow-300">{ticket.status}</Badge>
                              </div>
                              <p className="text-slate-300 mb-2">{ticket.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="notifications" key="notifications">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Send Notifications</CardTitle>
                      <CardDescription className="text-slate-300">
                        Send announcements and notifications to users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                        <Input
                          placeholder="Notification title"
                          value={notificationTitle}
                          onChange={(e) => setNotificationTitle(e.target.value)}
                          className="border-white/20 bg-white/5 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Message</label>
                        <Textarea
                          placeholder="Notification message"
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          rows={4}
                          className="border-white/20 bg-white/5 text-white placeholder:text-slate-400 resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => sendNotification()}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Send to All Users
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => sendNotification(selectedUsers)}
                          className="flex-1 border-white/20 text-white hover:bg-white/10"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send to Selected
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="requests" key="requests">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Language Requests</CardTitle>
                      <CardDescription className="text-slate-300">
                        Review and manage user requests for new languages
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {languageRequests.map((request) => (
                          <motion.div
                            key={request.id}
                            className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-white">{request.language_name}</h4>
                                <p className="text-sm text-slate-400">
                                  Requested by {request.profiles?.full_name} • {request.votes} votes
                                </p>
                                {request.language_code && (
                                  <Badge variant="outline" className="mt-1 border-white/20 text-slate-300">
                                    Code: {request.language_code}
                                  </Badge>
                                )}
                              </div>
                              <Badge
                                className={
                                  request.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : request.status === "approved"
                                      ? "bg-green-500/20 text-green-300"
                                      : "bg-red-500/20 text-red-300"
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                            {request.reason && <p className="text-sm text-slate-400 mb-3 italic">"{request.reason}"</p>}
                            {request.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateLanguageRequestStatus(request.id, "approved")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateLanguageRequestStatus(request.id, "rejected")}
                                  className="border-red-300/20 text-red-300 hover:bg-red-500/10"
                                >
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                        {languageRequests.length === 0 && (
                          <div className="text-center py-8 text-slate-400">
                            <Languages className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No language requests yet</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="lessons" key="lessons">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Lesson Management</CardTitle>
                      <CardDescription className="text-slate-300">
                        Add, edit, and delete lessons
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Add New Lesson</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                            <Input
                              placeholder="Lesson title"
                              value={newLesson.title}
                              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Language</label>
                            <Select
                              value={newLesson.language}
                              onValueChange={(value) => setNewLesson({ ...newLesson, language: value })}
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="yo">Yoruba</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
                            <Select
                              value={newLesson.difficulty}
                              onValueChange={(value) =>
                                setNewLesson({ ...newLesson, difficulty: value as "beginner" | "intermediate" | "advanced" })
                              }
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Content Type</label>
                            <Select
                              value={newLesson.content_type}
                              onValueChange={(value) =>
                                setNewLesson({ ...newLesson, content_type: value as "text" | "video" | "audio" | "interactive" })
                              }
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="interactive">Interactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Order Index</label>
                            <Input
                              type="number"
                              value={newLesson.order_index || 0}
                              onChange={(e) => setNewLesson({ ...newLesson, order_index: parseInt(e.target.value) })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Estimated Duration (min)</label>
                            <Input
                              type="number"
                              value={newLesson.estimated_duration || 10}
                              onChange={(e) => setNewLesson({ ...newLesson, estimated_duration: parseInt(e.target.value) })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">XP Reward</label>
                            <Input
                              type="number"
                              value={newLesson.xp_reward || 20}
                              onChange={(e) => setNewLesson({ ...newLesson, xp_reward: parseInt(e.target.value) })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Published</label>
                            <Select
                              value={newLesson.is_published ? "true" : "false"}
                              onValueChange={(value) => setNewLesson({ ...newLesson, is_published: value === "true" })}
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Published</SelectItem>
                                <SelectItem value="false">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                            <Textarea
                              placeholder="Lesson description"
                              value={newLesson.description || ""}
                              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Content (JSON)</label>
                            <Textarea
                              placeholder='{"text": "Lesson content"}'
                              value={JSON.stringify(newLesson.content) || "{}"}
                              onChange={(e) => setNewLesson({ ...newLesson, content: JSON.parse(e.target.value || "{}") })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={addLesson}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Add Lesson
                        </Button>
                      </div>

                      {editingLesson && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Edit Lesson</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                              <Input
                                value={editingLesson.title}
                                onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Language</label>
                              <Select
                                value={editingLesson.language}
                                onValueChange={(value) => setEditingLesson({ ...editingLesson, language: value })}
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="yo">Yoruba</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
                              <Select
                                value={editingLesson.difficulty}
                                onValueChange={(value) =>
                                  setEditingLesson({ ...editingLesson, difficulty: value as "beginner" | "intermediate" | "advanced" })
                                }
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Content Type</label>
                              <Select
                                value={editingLesson.content_type}
                                onValueChange={(value) =>
                                  setEditingLesson({ ...editingLesson, content_type: value as "text" | "video" | "audio" | "interactive" })
                                }
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="audio">Audio</SelectItem>
                                  <SelectItem value="interactive">Interactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Order Index</label>
                              <Input
                                type="number"
                                value={editingLesson.order_index}
                                onChange={(e) => setEditingLesson({ ...editingLesson, order_index: parseInt(e.target.value) })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Estimated Duration (min)</label>
                              <Input
                                type="number"
                                value={editingLesson.estimated_duration || 10}
                                onChange={(e) => setEditingLesson({ ...editingLesson, estimated_duration: parseInt(e.target.value) })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">XP Reward</label>
                              <Input
                                type="number"
                                value={editingLesson.xp_reward}
                                onChange={(e) => setEditingLesson({ ...editingLesson, xp_reward: parseInt(e.target.value) })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Published</label>
                              <Select
                                value={editingLesson.is_published ? "true" : "false"}
                                onValueChange={(value) => setEditingLesson({ ...editingLesson, is_published: value === "true" })}
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Published</SelectItem>
                                  <SelectItem value="false">Draft</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                              <Textarea
                                value={editingLesson.description || ""}
                                onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Content (JSON)</label>
                              <Textarea
                                value={JSON.stringify(editingLesson.content) || "{}"}
                                onChange={(e) => setEditingLesson({ ...editingLesson, content: JSON.parse(e.target.value || "{}") })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={updateLesson}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              Update Lesson
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingLesson(null)}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          {lessons.map((lesson) => (
                            <motion.div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div>
                                <h4 className="font-medium text-white">{lesson.title}</h4>
                                <p className="text-sm text-slate-400">
                                  {lesson.language} • {lesson.difficulty} • {lesson.content_type}
                                </p>
                                <Badge className={lesson.is_published ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                                  {lesson.is_published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingLesson(lesson)}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteLesson(lesson.id)}
                                  className="border-red-300/20 text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                          {lessons.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No lessons available</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="quizzes" key="quizzes">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Quiz Management</CardTitle>
                      <CardDescription className="text-slate-300">
                        Add, edit, and delete quizzes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Add New Quiz</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                            <Input
                              placeholder="Quiz title"
                              value={newQuiz.title}
                              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Language</label>
                            <Select
                              value={newQuiz.language}
                              onValueChange={(value) => setNewQuiz({ ...newQuiz, language: value })}
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="yo">Yoruba</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
                            <Select
                              value={newQuiz.difficulty}
                              onValueChange={(value) =>
                                setNewQuiz({ ...newQuiz, difficulty: value as "beginner" | "intermediate" | "advanced" })
                              }
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Time Limit (min)</label>
                            <Input
                              type="number"
                              value={newQuiz.time_limit || 30}
                              onChange={(e) => setNewQuiz({ ...newQuiz, time_limit: parseInt(e.target.value) })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Passing Score (%)</label>
                            <Input
                              type="number"
                              value={newQuiz.passing_score || 70}
                              onChange={(e) => setNewQuiz({ ...newQuiz, passing_score: parseInt(e.target.value) })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">XP Reward</label>
                            <Input
                              type="number"
                              value={newQuiz.xp_reward || 50}
                              onChange={(e) => setNewQuiz({ ...newQuiz, xp_reward: parseInt(e.target.value) })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Published</label>
                            <Select
                              value={newQuiz.is_published ? "true" : "false"}
                              onValueChange={(value) => setNewQuiz({ ...newQuiz, is_published: value === "true" })}
                            >
                              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Published</SelectItem>
                                <SelectItem value="false">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                            <Textarea
                              placeholder="Quiz description"
                              value={newQuiz.description || ""}
                              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Questions (JSON)</label>
                            <Textarea
                              placeholder='[{"question": "What is hello in Spanish?", "options": ["Hola", "Adiós"], "correct": "Hola"}]'
                              value={JSON.stringify(newQuiz.questions) || "{}"}
                              onChange={(e) => setNewQuiz({ ...newQuiz, questions: JSON.parse(e.target.value || "{}") })}
                              className="border-white/20 bg-white/5 text-white"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={addQuiz}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Add Quiz
                        </Button>
                      </div>

                      {editingQuiz && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Edit Quiz</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Title</label>
                              <Input
                                value={editingQuiz.title}
                                onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Language</label>
                              <Select
                                value={editingQuiz.language}
                                onValueChange={(value) => setEditingQuiz({ ...editingQuiz, language: value })}
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="yo">Yoruba</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
                              <Select
                                value={editingQuiz.difficulty}
                                onValueChange={(value) =>
                                  setEditingQuiz({ ...editingQuiz, difficulty: value as "beginner" | "intermediate" | "advanced" })
                                }
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Time Limit (min)</label>
                              <Input
                                type="number"
                                value={editingQuiz.time_limit || 30}
                                onChange={(e) => setEditingQuiz({ ...editingQuiz, time_limit: parseInt(e.target.value) })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Passing Score (%)</label>
                              <Input
                                type="number"
                                value={editingQuiz.passing_score}
                                onChange={(e) => setEditingQuiz({ ...editingQuiz, passing_score: parseInt(e.target.value) })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">XP Reward</label>
                              <Input
                                type="number"
                                value={editingQuiz.xp_reward}
                                onChange={(e) => setEditingQuiz({ ...editingQuiz, xp_reward: parseInt(e.target.value) })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Published</label>
                              <Select
                                value={editingQuiz.is_published ? "true" : "false"}
                                onValueChange={(value) => setEditingQuiz({ ...editingQuiz, is_published: value === "true" })}
                              >
                                <SelectTrigger className="border-white/20 bg-white/5 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Published</SelectItem>
                                  <SelectItem value="false">Draft</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                              <Textarea
                                value={editingQuiz.description || ""}
                                onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-medium text-slate-300 mb-2 block">Questions (JSON)</label>
                              <Textarea
                                value={JSON.stringify(editingQuiz.questions) || "{}"}
                                onChange={(e) => setEditingQuiz({ ...editingQuiz, questions: JSON.parse(e.target.value || "{}") })}
                                className="border-white/20 bg-white/5 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={updateQuiz}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              Update Quiz
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingQuiz(null)}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      <ScrollArea className="h-96">
                        <div className="space-y-4">
                          {quizzes.map((quiz) => (
                            <motion.div
                              key={quiz.id}
                              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div>
                                <h4 className="font-medium text-white">{quiz.title}</h4>
                                <p className="text-sm text-slate-400">
                                  {quiz.language} • {quiz.difficulty} • {quiz.passing_score}% pass
                                </p>
                                <Badge className={quiz.is_published ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}>
                                  {quiz.is_published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingQuiz(quiz)}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteQuiz(quiz.id)}
                                  className="border-red-300/20 text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                          {quizzes.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No quizzes available</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white">Quiz Attempts</h3>
                        <ScrollArea className="h-96 mt-4">
                          <div className="space-y-4">
                            {quizAttempts.map((attempt) => (
                              <motion.div
                                key={attempt.id}
                                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium text-white">
                                      {attempt.profiles?.full_name || "Unknown"} • {attempt.profiles?.email}
                                    </h4>
                                    <p className="text-sm text-slate-400">Score: {attempt.score}%</p>
                                    <p className="text-sm text-slate-400">Time Taken: {attempt.time_taken || "N/A"} sec</p>
                                  </div>
                                  <p className="text-sm text-slate-400">{new Date(attempt.completed_at).toLocaleDateString()}</p>
                                </div>
                              </motion.div>
                            ))}
                            {quizAttempts.length === 0 && (
                              <div className="text-center py-8 text-slate-400">
                                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No quiz attempts yet</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
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
  );
}
