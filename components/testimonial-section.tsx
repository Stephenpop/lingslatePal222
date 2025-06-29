"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Maria Rodriguez",
    role: "Spanish Teacher",
    location: "Madrid, Spain",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "LingslatePal has revolutionized how I teach Spanish to my students. The interactive lessons and real-time translation make learning so much more engaging!",
    highlight: "Revolutionary teaching tool",
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    location: "San Francisco, USA",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "As someone who travels frequently for work, having offline translation capabilities has been a game-changer. The app works perfectly even without internet!",
    highlight: "Perfect for travelers",
  },
  {
    name: "Amara Okafor",
    role: "University Student",
    location: "Lagos, Nigeria",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Finally, a platform that includes African languages! Learning Yoruba has never been easier, and the cultural context in lessons is amazing.",
    highlight: "Inclusive language support",
  },
  {
    name: "Jean-Pierre Dubois",
    role: "Business Owner",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The gamification features keep me motivated to practice daily. I've maintained a 45-day streak and my English has improved dramatically!",
    highlight: "Highly motivating",
  },
  {
    name: "Sakura Tanaka",
    role: "Language Exchange Student",
    location: "Tokyo, Japan",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "The pronunciation features with native speaker audio have helped me perfect my accent. The speech recognition is incredibly accurate!",
    highlight: "Excellent pronunciation tools",
  },
  {
    name: "Ahmed Hassan",
    role: "Medical Student",
    location: "Cairo, Egypt",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Studying medicine in English while being a native Arabic speaker was challenging. LingslatePal's medical terminology lessons saved my studies!",
    highlight: "Specialized vocabulary",
  },
]

export function TestimonialSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by Learners Worldwide</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Join thousands of satisfied users who have transformed their language learning journey with LingslatePal
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-slate-600 font-medium ml-2">4.9/5 from 12,000+ reviews</span>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg">{testimonial.name}</h4>
                      <p className="text-slate-600">{testimonial.role}</p>
                      <p className="text-slate-500 text-sm">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                    <p className="text-slate-700 leading-relaxed pl-6 italic">"{testimonial.text}"</p>
                  </div>

                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                    {testimonial.highlight}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mt-16"
        >
          <Card className="mx-auto max-w-2xl border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Join Them?</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Start your language learning journey today and see why thousands choose LingslatePal
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2">
                  ✨ 100% Free to Start
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                  🚀 No Credit Card Required
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
