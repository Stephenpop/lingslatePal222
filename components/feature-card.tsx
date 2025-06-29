"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bgColor: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, color, bgColor, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-4">
          <div
            className={`mb-4 w-fit rounded-xl p-3 ${bgColor} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <CardTitle className="text-slate-900 text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-slate-600 leading-relaxed">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}
