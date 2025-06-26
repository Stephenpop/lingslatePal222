"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, Trophy, Filter } from "lucide-react";
import { authService } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: any; // JSONB, adjust based on content structure
  order_index: number;
  is_published: boolean;
  content_type: "text" | "video" | "audio" | "interactive";
  estimated_duration: number | null;
  xp_reward: number;
}

export default function LearnPage() {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    loadUserAndLessons();
  }, []);

  const loadUserAndLessons = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);

      const { data: lessonsData, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("language", currentUser.profile?.learning_language || "es")
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setLessons(lessonsData || []);
    } catch (error) {
      console.error("Error loading lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (lessonId: string, xpReward: number) => {
    try {
      const currentXp = user.profile?.xp_points || 0;
      const { error } = await supabase
        .from("profiles")
        .update({ xp_points: currentXp + xpReward })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(`Lesson completed! +${xpReward} XP`);
      await loadUserAndLessons(); // Refresh user data
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Failed to complete lesson");
    }
  };

  const filteredLessons = difficultyFilter === "all"
    ? lessons
    : lessons.filter((lesson) => lesson.difficulty === difficultyFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading lessons...</p>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Learn</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                {user.profile?.full_name} • {user.profile?.xp_points || 0} XP
              </span>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Learn {user.profile?.learning_language === "es" ? "Spanish" : user.profile?.learning_language}
          </h1>
          <div className="flex items-center gap-4">
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-48 border-white/20 bg-white/5 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredLessons.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-400">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No lessons available for this language or difficulty</p>
            </div>
          ) : (
            filteredLessons.map((lesson) => (
              <motion.div key={lesson.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardHeader>
                    <CardTitle className="text-white">{lesson.title}</CardTitle>
                    <CardDescription className="text-slate-300">{lesson.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          lesson.difficulty === "beginner"
                            ? "bg-green-500/20 text-green-300"
                            : lesson.difficulty === "intermediate"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }
                      >
                        {lesson.difficulty}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300">{lesson.content_type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4" />
                      {lesson.estimated_duration ? `${lesson.estimated_duration} min` : "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Trophy className="h-4 w-4" />
                      {lesson.xp_reward} XP
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-4"
                      onClick={() => completeLesson(lesson.id, lesson.xp_reward)}
                    >
                      Complete Lesson
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
