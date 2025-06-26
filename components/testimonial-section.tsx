"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Maria Rodriguez",
    role: "Software Engineer",
    country: "Spain",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    language: "English",
    timeframe: "3 months",
    quote:
      "LingslatePal helped me land my dream job in Silicon Valley. The translation feature is incredibly accurate, and the lessons are engaging!",
    achievement: "B2 Level Achieved",
  },
  {
    name: "Hiroshi Tanaka",
    role: "Business Analyst",
    country: "Japan",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    language: "Spanish",
    timeframe: "4 months",
    quote:
      "I went from zero Spanish to having conversations with native speakers. The gamification kept me motivated every day!",
    achievement: "30-Day Streak",
  },
  {
    name: "Emma Thompson",
    role: "Travel Blogger",
    country: "UK",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    language: "French",
    timeframe: "2 months",
    quote:
      "Perfect for travelers! I can translate menus instantly and the offline mode saved me during my Paris trip. Absolutely love it!",
    achievement: "Travel Ready",
  },
  {
    name: "Ahmed Hassan",
    role: "Medical Student",
    country: "Egypt",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    language: "German",
    timeframe: "6 months",
    quote:
      "The pronunciation feature is amazing. I'm now confident speaking German with my professors. The progress tracking keeps me motivated!",
    achievement: "C1 Level",
  },
]

export function TestimonialSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Success Stories from Our Community</h2>
        <p className="mx-auto max-w-2xl text-slate-300">
          Join thousands of learners who have transformed their language skills with LingslatePal
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        {testimonial.achievement}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {testimonial.role} • {testimonial.country}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-400/30" />
                  <p className="text-slate-300 italic pl-4">{testimonial.quote}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">
                      Learning: <span className="text-white">{testimonial.language}</span>
                    </span>
                    <span className="text-slate-400">
                      Time: <span className="text-white">{testimonial.timeframe}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-sm text-slate-400">Average Rating</div>
            <div className="flex justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-sm text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50K+</div>
            <div className="text-sm text-slate-400">Happy Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-slate-400">Support</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
