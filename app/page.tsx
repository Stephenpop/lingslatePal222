"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Languages,
  BookOpen,
  Brain,
  Trophy,
  Play,
  Globe,
  Heart,
  Smartphone,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { FeatureCard } from "@/components/feature-card"
import { LanguageShowcase } from "@/components/language-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { LearningPath } from "@/components/learning-path"
import { AppShowcase } from "@/components/app-showcase"
import { TestimonialSection } from "@/components/testimonial-section"
import { QuickTranslate } from "@/components/quick-translate"
import { AnimatedCounter } from "@/components/animated-counter"
import { VideoShowcase } from "@/components/video-showcase"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [languageRequest, setLanguageRequest] = useState("")
  const [reason, setReason] = useState("")

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert([{ email: email.trim() }])
      if (error) throw error
      toast.success("Thanks for subscribing! We'll keep you updated.")
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLanguageRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!languageRequest.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("language_requests").insert([
        {
          language_name: languageRequest.trim(),
          reason: reason.trim() || null,
          votes: 1,
          status: "pending",
        },
      ])
      if (error) throw error
      toast.success("Language request submitted! We'll review it soon.")
      setLanguageRequest("")
      setReason("")
    } catch (error) {
      toast.error("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Languages className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LingslatePal
              </span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/translate" className="hidden sm:block">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  Translate
                </Button>
              </Link>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  Dashboard
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg text-sm sm:text-base px-3 sm:px-6">
                  <span className="hidden sm:inline">Get Started Free</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm sm:text-base">
                <Sparkles className="mr-2 h-4 w-4" />
                100% Free Forever
              </Badge>
              <h1 className="mb-6 text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Learn Languages with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered
                </span>{" "}
                Translation
              </h1>
              <p className="mb-8 text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Master new languages through interactive lessons, instant translation, and personalized quizzes.
                <span className="block mt-2 text-sm sm:text-base font-medium text-blue-600">
                  Free translation for 100+ languages including African languages
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning Free
                  </Button>
                </Link>
                <Link href="/translate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    <Languages className="mr-2 h-5 w-5" />
                    Try Translation
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  <AnimatedCounter end={100} suffix="+" />
                </div>
                <div className="text-sm sm:text-base text-slate-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  <AnimatedCounter end={50000} suffix="+" />
                </div>
                <div className="text-sm sm:text-base text-slate-600">Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  <AnimatedCounter end={1000000} suffix="+" />
                </div>
                <div className="text-sm sm:text-base text-slate-600">Translations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <div className="text-sm sm:text-base text-slate-600">Accuracy</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Translation */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center mb-12"
          >
            <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Try Our Free Translation Tool
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Instantly translate text between any of our supported languages
            </p>
          </motion.div>
          <QuickTranslate />
        </div>
      </section>

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Features */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center mb-12 sm:mb-16"
          >
            <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              Everything You Need to Learn Languages
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Comprehensive tools and features designed to accelerate your language learning journey
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Languages}
              title="Instant Translation"
              description="Translate text between 100+ languages with high accuracy using advanced AI technology."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={BookOpen}
              title="Interactive Lessons"
              description="Learn through engaging lessons with real-world examples and practical exercises."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={Brain}
              title="Smart Quizzes"
              description="Test your knowledge with adaptive quizzes that adjust to your learning pace."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={Trophy}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics and achievement badges."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={Globe}
              title="African Languages"
              description="Special focus on African languages including Yoruba, Igbo, Hausa, and Swahili."
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={Smartphone}
              title="Offline Learning"
              description="Download lessons and continue learning even without an internet connection."
              gradient="from-indigo-500 to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Language Showcase */}
      <LanguageShowcase />

      {/* How It Works */}
      <HowItWorks />

      {/* Learning Path */}
      <LearningPath />

      {/* App Showcase */}
      <AppShowcase />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Language Request */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-slate-900">Request a New Language</h2>
            <p className="mb-8 text-base sm:text-lg text-slate-600">
              Don't see your language? Let us know and we'll work on adding it to our platform.
            </p>
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleLanguageRequest} className="space-y-4">
                  <Input
                    placeholder="Language name (e.g., Swahili, Mandarin)"
                    value={languageRequest}
                    onChange={(e) => setLanguageRequest(e.target.value)}
                    className="border-slate-300 bg-white text-slate-900"
                    required
                  />
                  <Textarea
                    placeholder="Why is this language important to you? (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border-slate-300 bg-white text-slate-900"
                    rows={3}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Request Language"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-slate-900">Stay Updated</h2>
            <p className="mb-8 text-base sm:text-lg text-slate-600">
              Get the latest updates on new languages, features, and learning tips.
            </p>
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border-slate-300 bg-white text-slate-900"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <Languages className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">LingslatePal</span>
              </div>
              <p className="text-sm text-slate-600">Free language learning and translation platform for everyone.</p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-slate-900">Features</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/translate" className="hover:text-slate-900">
                    Translation
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-slate-900">
                    Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-slate-900">
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-slate-900">
                    Progress
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-slate-900">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/support" className="hover:text-slate-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-slate-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-slate-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-slate-900">Connect</h3>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2024 LingslatePal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
