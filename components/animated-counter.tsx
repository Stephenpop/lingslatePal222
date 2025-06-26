"use client"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  delay?: number
}

export function AnimatedCounter({ value, suffix = "", delay = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const duration = 2000
        const steps = 60
        const increment = value / steps
        let current = 0

        const counter = setInterval(() => {
          current += increment
          if (current >= value) {
            setCount(value)
            clearInterval(counter)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)

        return () => clearInterval(counter)
      }, delay * 1000)

      return () => clearTimeout(timer)
    }
  }, [isInView, value, delay])

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay }}>
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  )
}
