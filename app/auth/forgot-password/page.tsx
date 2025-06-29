"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Languages, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await authService.resetPassword(email)
      setIsSuccess(true)
      toast({
        title: "Check your email",
        description: "A password reset link has been sent to your email.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Back to Login Button */}
        <div className="mb-6">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <Languages className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LingslatePal
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Reset Password</h1>
          <p className="text-slate-600 text-lg">
            {isSuccess
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-slate-900 text-2xl text-center flex items-center justify-center gap-3">
              {isSuccess ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  Email Sent
                </>
              ) : (
                "Forgot Password"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-slate-700 leading-relaxed">
                    We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
                    instructions to reset your password.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link href="/auth/login">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                    onClick={() => {
                      setIsSuccess(false)
                      setEmail("")
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-slate-600">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
