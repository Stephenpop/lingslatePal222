"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Globe,
  BookOpen,
  Brain,
  Trophy,
  Users,
  ArrowRight,
  Languages,
  Smartphone,
  BarChart3,
  Camera,
  Headphones,
  CheckCircle,
  PlayCircle,
  Award,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { QuickTranslate } from "@/components/quick-translate"
import { FeatureCard } from "@/components/feature-card"
import { AnimatedCounter } from "@/components/animated-counter"
import { LanguageShowcase } from "@/components/language-showcase"
import { LearningPath } from "@/components/learning-path"
import { HowItWorks } from "@/components/how-it-works"
import { TestimonialSection } from "@/components/testimonial-section"
import { AppShowcase } from "@/components/app-showcase"
import { supabase } from "@/lib/supabase"
import { authService } from "@/lib/auth"
import { toast } from "sonner"

const features = [
  { icon: Globe, title: "Free Translation", description: "Translate between 100+ languages instantly with our free LibreTranslate integration", color: "text-blue-600", bgColor: "bg-blue-50" },
  { icon: BookOpen, title: "Interactive Lessons", description: "Learn with engaging lessons designed by language experts and native speakers", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { icon: Brain, title: "Smart Quizzes", description: "Test your knowledge with adaptive quizzes that adjust to your learning pace", color: "text-purple-600", bgColor: "bg-purple-50" },
  { icon: Trophy, title: "Track Progress", description: "Monitor your learning journey with detailed analytics and achievement badges", color: "text-amber-600", bgColor: "bg-amber-50" },
  { icon: Camera, title: "Camera Translation", description: "Point your camera at text and get instant translations with OCR technology", color: "text-pink-600", bgColor: "bg-pink-50" },
  { icon: Headphones, title: "Audio Learning", description: "Perfect your pronunciation with native speaker audio and speech recognition", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  { icon: Smartphone, title: "Mobile Optimized", description: "Learn anywhere with our PWA that works offline on all your devices", color: "text-cyan-600", bgColor: "bg-cyan-50" },
  { icon: BarChart3, title: "Learning Analytics", description: "Get insights into your learning patterns and optimize your study time", color: "text-orange-600", bgColor: "bg-orange-50" },
]

const stats = [
  { label: "Languages Supported", value: 100, suffix: "+" },
  { label: "Active Learners", value: 75000, suffix: "+" },
  { label: "Lessons Completed", value: 2500000, suffix: "+" },
  { label: "Countries Reached", value: 195, suffix: "" },
]

const popularLanguages = [
  { code: "es", name: "Spanish", flag: "🇪🇸", learners: "2.1M" },
  { code: "fr", name: "French", flag: "🇫🇷", learners: "1.8M" },
  { code: "de", name: "German", flag: "🇩🇪", learners: "1.2M" },
  { code: "it", name: "Italian", flag: "🇮🇹", learners: "950K" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", learners: "800K" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", learners: "1.5M" },
  { code: "ko", name: "Korean", flag: "🇰🇷", learners: "900K" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", learners: "1.3M" },
]

export default function HomePage() {
  const [isLanguageRequestOpen, setIsLanguageRequestOpen] = useState(false)
  const [languageName, setLanguageName] = useState("")
  const [languageCode, setLanguageCode] = useState("")
  const [reason, setReason] = useState("")

  const handleLanguageRequest = async () => {
    const user = await authService.getCurrentUser()
    if (!user) {
      toast.error("Please log in to request a language")
      window.location.href = "/auth/login"
      return
    }

    if (!languageName || !reason) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const { error } = await supabase.from("language_requests").insert({
        user_id: user.id,
        language_name: languageName,
        language_code: languageCode || null,
        reason,
        status: "pending",
      })

      if (error) throw error

      toast.success("Language request submitted successfully!")
      setIsLanguageRequestOpen(false)
      setLanguageName("")
      setLanguageCode("")
      setReason("")
    } catch (error) {
      console.error("Error submitting language request:", error)
      toast.error("Failed to submit language request")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-blue-200/50 bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
                <Languages className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                LingslatePal
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-white hover:text-blue-200 hover:bg-blue-800/30">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  className="bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 max-w-[150px] sm:max-w-[200px]"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/translate">
                <Button
                  variant="outline"
                  className="border-slate-300 text-white hover:bg-slate-50 hover:text-blue-700 hover:border-slate-400 px-6 py-3 max-w-[150px] sm:max-w-[200px]"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Try Translation
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 px-4 py-2 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                100% Free Translation & Learning Platform
              </Badge>

              <h1 className="mb-8 text-4xl font-bold text-slate-900 sm:text-6xl lg:text-7xl leading-tight">
                Master Languages with
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LingslatePal
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-3xl text-xl text-slate-600 leading-relaxed">
                Translate instantly between 100+ languages, learn with interactive lessons, and track your progress with
                our comprehensive AI-powered language learning platform.
              </p>

              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold max-w-[150px] sm:max-w-[200px]"
                  >
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/translate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-4 text-lg font-semibold bg-transparent max-w-[150px] sm:max-w-[200px]"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Try Translation
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Works Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Mobile & Desktop</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Translate Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Instant Translation</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by LibreTranslate - try our free translation service now
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <QuickTranslate />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-slate-900 md:text-5xl mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={index * 0.1} />
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Language Showcase */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Languages</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">Join millions learning these languages</p>
            <Button
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 bg-transparent"
              onClick={() => setIsLanguageRequestOpen(true)}
            >
              Request a Language
            </Button>
          </motion.div>
          <LanguageShowcase languages={popularLanguages} />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Learning Path Preview */}
      <LearningPath />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need to Master Languages</h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              From instant translation to comprehensive learning paths, we've got you covered with cutting-edge features
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <AppShowcase />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Gamification Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Make Learning Fun with Gamification</h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Earn XP, unlock achievements, and compete with friends while mastering new languages
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-100">
                    <Trophy className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900">Achievements</CardTitle>
                    <CardDescription className="text-slate-600">Unlock badges and rewards</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-5 w-5 text-amber-600" />
                    <span className="text-slate-900 flex-1">First Translation</span>
                    <Badge className="bg-amber-100 text-amber-700">+10 XP</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="text-slate-900 flex-1">7-Day Streak</span>
                    <Badge className="bg-blue-100 text-blue-700">+50 XP</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-900 flex-1">Quiz Master</span>
                    <Badge className="bg-purple-100 text-purple-700">+100 XP</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-100">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900">Streaks</CardTitle>
                    <CardDescription className="text-slate-600">Maintain daily learning habits</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">🔥 15</div>
                  <p className="text-slate-600 mb-4">Day Streak</p>
                  <div className="flex justify-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full ${i < 5 ? "bg-orange-500" : "bg-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-100">
                    <Users className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900">Leaderboard</CardTitle>
                    <CardDescription className="text-slate-600">Compete with friends</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <span className="text-slate-900 flex-1">Maria</span>
                    <span className="text-amber-600 font-semibold">2,450 XP</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <span className="text-slate-900 flex-1">You</span>
                    <span className="text-slate-600 font-semibold">2,100 XP</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <span className="text-slate-900 flex-1">John</span>
                    <span className="text-orange-600 font-semibold">1,890 XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="container mx-auto px-4 text-center"
        >
          <Card className="mx-auto max-w-4xl border-0 bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl text-slate-900 sm:text-4xl mb-4">
                Ready to Start Your Language Journey?
              </CardTitle>
              <CardDescription className="text-xl text-slate-600">
                Join thousands of learners who are already mastering new languages with LingslatePal
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg font-semibold max-w-[150px] sm:max-w-[200px]"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Join Free Today
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 py-4 text-lg font-semibold bg-transparent max-w-[150px] sm:max-w-[200px]"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore Lessons
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Language Request Modal */}
      <Dialog open={isLanguageRequestOpen} onOpenChange={setIsLanguageRequestOpen}>
        <DialogContent className="bg-white text-slate-900 border-slate-200 shadow-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Request a New Language</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="language-name" className="text-slate-700">
                Language Name *
              </Label>
              <Input
                id="language-name"
                value={languageName}
                onChange={(e) => setLanguageName(e.target.value)}
                placeholder="e.g., Swahili"
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="language-code" className="text-slate-700">
                Language Code (optional)
              </Label>
              <Input
                id="language-code"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                placeholder="e.g., sw"
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="reason" className="text-slate-700">
                Reason for Request *
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why should we add this language?"
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              onClick={() => setIsLanguageRequestOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleLanguageRequest}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                  <Languages className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LingslatePal
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Your AI-powered language learning companion. Master new languages with free translation and interactive
                lessons.
              </p>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-slate-600">Trusted by 75,000+ learners</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Features</h3>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/translate" className="hover:text-blue-600 transition-colors">
                    Free Translation
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-blue-600 transition-colors">
                    Interactive Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-blue-600 transition-colors">
                    Smart Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-blue-600 transition-colors">
                    Progress Tracking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Languages</h3>
              <ul className="space-y-3 text-slate-600">
                <li>Spanish • French • German</li>
                <li>Italian • Portuguese • Russian</li>
                <li>Japanese • Korean • Chinese</li>
                <li>Arabic • Hindi • Turkish</li>
                <li>
                  <button
                    onClick={() => setIsLanguageRequestOpen(true)}
                    className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Request a Language
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-3 text-slate-600">
                <li>
                  <Link href="/help" className="hover:text-blue-600 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-200 mt-12 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-slate-600">© 2025 LingslatePal. Made with ❤️ for language learners worldwide.</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2 animate-pulse" />
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
