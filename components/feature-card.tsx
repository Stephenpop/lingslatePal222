"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, color, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
        <CardHeader>
          <div className={`mb-2 w-fit rounded-lg bg-white/10 p-2 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-slate-300">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}
