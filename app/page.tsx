"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  BookOpen,
  Brain,
  Trophy,
  Zap,
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

const features = [
  {
    icon: Globe,
    title: "Free Translation",
    description: "Translate between 100+ languages instantly with our free LibreTranslate integration",
    color: "text-blue-500",
  },
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Learn with engaging lessons designed by language experts and native speakers",
    color: "text-green-500",
  },
  {
    icon: Brain,
    title: "Smart Quizzes",
    description: "Test your knowledge with adaptive quizzes that adjust to your learning pace",
    color: "text-purple-500",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics and achievement badges",
    color: "text-yellow-500",
  },
  {
    icon: Camera,
    title: "Camera Translation",
    description: "Point your camera at text and get instant translations with OCR technology",
    color: "text-pink-500",
  },
  {
    icon: Headphones,
    title: "Audio Learning",
    description: "Perfect your pronunciation with native speaker audio and speech recognition",
    color: "text-indigo-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Learn anywhere with our PWA that works offline on all your devices",
    color: "text-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Get insights into your learning patterns and optimize your study time",
    color: "text-orange-500",
  },
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LingslatePal</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/translate">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Translate
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
              <Zap className="mr-1 h-3 w-3" />
              100% Free Translation & Learning Platform
            </Badge>

            <h1 className="mb-6 text-4xl font-bold text-white sm:text-6xl lg:text-7xl">
              Master Languages with
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                LingslatePal
              </span>
              <br />
              Your AI Language Companion
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Translate instantly, learn interactively, and track your progress with our comprehensive language learning
              platform. Powered by LibreTranslate and designed for learners worldwide.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/translate">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Try Translation
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                100% Free Forever
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Works Offline
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Translate Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Instant Translation</h2>
            <p className="text-slate-300">Powered by LibreTranslate - try our free translation service now</p>
          </div>
          <QuickTranslate />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white md:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={index * 0.1} />
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Language Showcase */}
      <LanguageShowcase languages={popularLanguages} />

      {/* How It Works */}
      <HowItWorks />

      {/* Learning Path Preview */}
      <LearningPath />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Everything You Need to Master Languages</h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            From instant translation to comprehensive learning paths, we've got you covered with cutting-edge features
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* App Showcase */}
      <AppShowcase />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Gamification Preview */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Make Learning Fun with Gamification</h2>
          <p className="mx-auto max-w-2xl text-slate-300">
            Earn XP, unlock achievements, and compete with friends while mastering new languages
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Achievements</CardTitle>
                  <CardDescription className="text-slate-300">Unlock badges and rewards</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-white">First Translation</span>
                  <Badge variant="secondary" className="ml-auto bg-yellow-500/20 text-yellow-400">
                    +10 XP
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-blue-400" />
                  <span className="text-white">7-Day Streak</span>
                  <Badge variant="secondary" className="ml-auto bg-blue-500/20 text-blue-400">
                    +50 XP
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span className="text-white">Quiz Master</span>
                  <Badge variant="secondary" className="ml-auto bg-purple-500/20 text-purple-400">
                    +100 XP
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Streaks</CardTitle>
                  <CardDescription className="text-slate-300">Maintain daily learning habits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">🔥 15</div>
                <p className="text-sm text-slate-300">Day Streak</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < 5 ? "bg-orange-400" : "bg-white/20"}`} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Leaderboard</CardTitle>
                  <CardDescription className="text-slate-300">Compete with friends</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-black">
                    1
                  </div>
                  <span className="text-white">Maria</span>
                  <span className="ml-auto text-yellow-400">2,450 XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold text-black">
                    2
                  </div>
                  <span className="text-white">You</span>
                  <span className="ml-auto text-gray-400">2,100 XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-xs font-bold text-black">
                    3
                  </div>
                  <span className="text-white">John</span>
                  <span className="ml-auto text-orange-400">1,890 XP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="mx-auto max-w-2xl border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white sm:text-3xl">Ready to Start Your Language Journey?</CardTitle>
              <CardDescription className="text-slate-300">
                Join thousands of learners who are already mastering new languages with LingslatePal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Free Today
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Lessons
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Languages className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LingslatePal</span>
              </div>
              <p className="text-sm text-slate-400">
                Your AI-powered language learning companion. Master new languages with free translation and interactive
                lessons.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/translate" className="hover:text-white">
                    Free Translation
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-white">
                    Interactive Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-white">
                    Smart Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white">
                    Progress Tracking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Languages</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Spanish • French • German</li>
                <li>Italian • Portuguese • Russian</li>
                <li>Japanese • Korean • Chinese</li>
                <li>Arabic • Hindi • Turkish</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">© 2024 LingslatePal. Made with ❤️ for language learners worldwide.</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
