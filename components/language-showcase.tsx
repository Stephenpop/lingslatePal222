"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface Language {
  code: string
  name: string
  flag: string
  learners: string
}

interface LanguageShowcaseProps {
  languages: Language[]
}

export function LanguageShowcase({ languages }: LanguageShowcaseProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
      {languages.map((language, index) => (
        <motion.div
          key={language.code}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {language.flag}
              </div>
              <h3 className="font-semibold text-slate-900 mb-3 text-lg">{language.name}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-4">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{language.learners} learners</span>
              </div>
              <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:from-blue-200 hover:to-purple-200">
                Popular Choice
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
