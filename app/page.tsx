"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import Link from "next/link";
import { QuickTranslate } from "@/components/quick-translate";
import { FeatureCard } from "@/components/feature-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { LanguageShowcase } from "@/components/language-showcase";
import { LearningPath } from "@/components/learning-path";
import { HowItWorks } from "@/components/how-it-works";
import { TestimonialSection } from "@/components/testimonial-section";
import { AppShowcase } from "@/components/app-showcase";
import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth";
import { toast } from "sonner";

const features = [
  {
    icon: Globe,
    title: "Free Translation",
    description: "Translate between 100+ languages instantly with our free LibreTranslate integration",
    color: "text-blue-600",
  },
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Learn with engaging lessons designed by language experts and native speakers",
    color: "text-green-600",
  },
  {
    icon: Brain,
    title: "Smart Quizzes",
    description: "Test your knowledge with adaptive quizzes that adjust to your learning pace",
    color: "text-purple-600",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics and achievement badges",
    color: "text-yellow-600",
  },
  {
    icon: Camera,
    title: "Camera Translation",
    description: "Point your camera at text and get instant translations with OCR technology",
    color: "text-pink-600",
  },
  {
    icon: Headphones,
    title: "Audio Learning",
    description: "Perfect your pronunciation with native speaker audio and speech recognition",
    color: "text-indigo-600",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Learn anywhere with our PWA that works offline on all your devices",
    color: "text-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Get insights into your learning patterns and optimize your study time",
    color: "text-orange-600",
  },
];

const stats = [
  { label: "Languages Supported", value: 100, suffix: "+" },
  { label: "Active Learners", value: 75000, suffix: "+" },
  { label: "Lessons Completed", value: 2500000, suffix: "+" },
  { label: "Countries Reached", value: 195, suffix: "" },
];

const popularLanguages = [
  { code: "es", name: "Spanish", flag: "🇪🇸", learners: "2.1M" },
  { code: "fr", name: "French", flag: "🇫🇷", learners: "1.8M" },
  { code: "de", name: "German", flag: "🇩🇪", learners: "1.2M" },
  { code: "it", name: "Italian", flag: "🇮🇹", learners: "950K" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", learners: "800K" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", learners: "1.5M" },
  { code: "ko", name: "Korean", flag: "🇰🇷", learners: "900K" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", learners: "1.3M" },
];

export default function HomePage() {
  const [isLanguageRequestOpen, setIsLanguageRequestOpen] = useState(false);
  const [languageName, setLanguageName] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [reason, setReason] = useState("");

  const handleLanguageRequest = async () => {
    const user = await authService.getCurrentUser();
    if (!user) {
      toast.error("Please log in to request a language");
      window.location.href = "/auth/login";
      return;
    }

    if (!languageName || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("language_requests").insert({
        user_id: user.id,
        language_name: languageName,
        language_code: languageCode,
        reason,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Language request submitted successfully!");
      setIsLanguageRequestOpen(false);
      setLanguageName("");
      setLanguageCode("");
      setReason("");
    } catch (error) {
      console.error("Error submitting language request:", error);
      toast.error("Failed to submit language request");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">LingslatePal</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/learn?difficulty=beginner">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  Beginner Lessons
                </Button>
              </Link>
              <Link href="/learn?difficulty=intermediate">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  Intermediate Lessons
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  Take Assessment
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200">
              <Zap className="mr-1 h-3 w-3" />
              100% Free Translation & Learning Platform
            </Badge>

            <h1 className="mb-6 text-4xl font-bold text-slate-800 sm:text-5xl lg:text-6xl">
              Master Languages with LingslatePal
              <br />
              Your AI Language Companion
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 sm:text-xl">
              Translate instantly, learn interactively, and track your progress with our comprehensive language learning
              platform. Powered by LibreTranslate and designed for learners worldwide.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/translate">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Try Translation
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                100% Free Forever
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Instant Translation</h2>
            <p className="text-slate-600">Powered by LibreTranslate - try our free translation service now</p>
          </div>
          <QuickTranslate />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-slate-800 md:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={index * 0.1} />
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Language Showcase */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Popular Languages</h2>
          <p className="text-slate-600">Join millions learning these languages</p>
          <Button
            variant="outline"
            className="mt-4 border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={() => setIsLanguageRequestOpen(true)}
          >
            Request a Language
          </Button>
        </motion.div>
        <LanguageShowcase languages={popularLanguages} />
      </section>

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
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Everything You Need to Master Languages</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
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
      <section className="container mx-auto px-4 py-16 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Make Learning Fun with Gamification</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Earn XP, unlock achievements, and compete with friends while mastering new languages
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Achievements</CardTitle>
                  <CardDescription className="text-slate-600">Unlock badges and rewards</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-slate-800">First Translation</span>
                  <Badge variant="secondary" className="ml-auto bg-yellow-100 text-yellow-600">
                    +10 XP
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-800">7-Day Streak</span>
                  <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-600">
                    +50 XP
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-slate-800">Quiz Master</span>
                  <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-600">
                    +100 XP
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Streaks</CardTitle>
                  <CardDescription className="text-slate-600">Maintain daily learning habits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">🔥 15</div>
                <p className="text-sm text-slate-600">Day Streak</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < 5 ? "bg-orange-600" : "bg-slate-200"}`} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Leaderboard</CardTitle>
                  <CardDescription className="text-slate-600">Compete with friends</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-xs font-bold text-white">
                    1
                  </div>
                  <span className="text-slate-800">Maria</span>
                  <span className="ml-auto text-yellow-600">2,450 XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                    2
                  </div>
                  <span className="text-slate-800">You</span>
                  <span className="ml-auto text-gray-600">2,100 XP</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold text-white">
                    3
                  </div>
                  <span className="text-slate-800">John</span>
                  <span className="ml-auto text-orange-600">1,890 XP</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="mx-auto max-w-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 sm:text-3xl">Ready to Start Your Language Journey?</CardTitle>
              <CardDescription className="text-slate-600">
                Join thousands of learners who are already mastering new languages with LingslatePal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                    <Users className="mr-2 h-4 w-4" />
                    Join Free Today
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    <BookOpen className="mr-2 h-4 w-4" />
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Request a New Language</DialogTitle>
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
                className="mt-1"
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
                className="mt-1"
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
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={() => setIsLanguageRequestOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleLanguageRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Languages className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">LingslatePal</span>
              </div>
              <p className="text-sm text-slate-600">
                Your AI-powered language learning companion. Master new languages with free translation and interactive
                lessons.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/translate" className="hover:text-blue-600">
                    Free Translation
                  </Link>
                </li>
                <li>
                  <Link href="/learn?difficulty=beginner" className="hover:text-blue-600">
                    Beginner Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/learn?difficulty=intermediate" className="hover:text-blue-600">
                    Intermediate Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/quiz" className="hover:text-blue-600">
                    Smart Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-blue-600">
                    Progress Tracking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Languages</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Spanish • French • German</li>
                <li>Italian • Portuguese • Russian</li>
                <li>Japanese • Korean • Chinese</li>
                <li>Arabic • Hindi • Turkish</li>
                <li>
                  <button
                    onClick={() => setIsLanguageRequestOpen(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Request a Language
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/help" className="hover:text-blue-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">© 2025 LingslatePal. Made with ❤️ for language learners worldwide.</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
                All Systems Operational
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
