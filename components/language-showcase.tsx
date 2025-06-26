"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"

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
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Popular Languages to Learn</h2>
        <p className="mx-auto max-w-2xl text-slate-300">
          Join millions of learners mastering these popular languages with our interactive platform
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {languages.map((language, index) => (
          <motion.div
            key={language.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{language.flag}</div>
                <h3 className="font-semibold text-white mb-2">{language.name}</h3>
                <div className="flex items-center justify-center gap-1 text-sm text-slate-400 mb-3">
                  <TrendingUp className="h-3 w-3" />
                  <span>{language.learners} learners</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  Popular
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center mt-8"
      >
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <Plus className="mr-2 h-4 w-4" />
          Request New Language
        </Button>
      </motion.div>
    </section>
  )
}
