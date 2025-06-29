"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Languages, ArrowLeft, Home, Shield, Eye, Lock, Users, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <motion.nav
        className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Languages className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LingslatePal
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-slate-600 mb-2">Your privacy is our priority</p>
            <p className="text-slate-500">Last updated: January 22, 2024</p>
          </div>

          <Card className="border-slate-200 bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="prose prose-slate max-w-none">
                <div className="space-y-10 text-slate-700">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">1. Introduction</h2>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-6">
                      <p className="text-slate-700 leading-relaxed">
                        LingslatePal ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                        explains how we collect, use, disclose, and safeguard your information when you use our language
                        learning and translation service.
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">2. Information We Collect</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Personal Information</h3>
                        <p className="mb-4">We may collect the following personal information:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Name and email address (when you create an account)</li>
                          <li>Profile information (learning preferences, native language)</li>
                          <li>Authentication data (encrypted passwords)</li>
                          <li>Communication data (support messages, feedback)</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Usage Information</h3>
                        <p className="mb-4">
                          We automatically collect certain information about your use of our service:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Learning progress and statistics (XP points, streaks, lessons completed)</li>
                          <li>Translation history (text you translate)</li>
                          <li>Quiz results and performance data</li>
                          <li>Device information (browser type, operating system)</li>
                          <li>Usage patterns and preferences</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Technical Information</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>IP address and location data</li>
                          <li>Browser and device identifiers</li>
                          <li>Log files and analytics data</li>
                          <li>Cookies and similar tracking technologies</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Lock className="h-6 w-6 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">3. How We Use Your Information</h2>
                    </div>
                    <p className="mb-6">We use your information for the following purposes:</p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Service Provision</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Provide translation and language learning services</li>
                          <li>Track your learning progress and maintain streaks</li>
                          <li>Personalize your learning experience</li>
                          <li>Enable social features like leaderboards</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Communication</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Send account-related notifications</li>
                          <li>Provide customer support</li>
                          <li>Send educational content and tips</li>
                          <li>Notify you of service updates</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 mt-6">
                      <h3 className="text-xl font-medium text-slate-900 mb-4">Improvement and Analytics</h3>
                      <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Analyze usage patterns to improve our service</li>
                        <li>Develop new features and content</li>
                        <li>Monitor service performance and security</li>
                        <li>Conduct research and analytics</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">
                      4. Information Sharing and Disclosure
                    </h2>
                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 mb-6">
                      <p className="text-slate-700 leading-relaxed font-medium">
                        We do not sell, trade, or rent your personal information to third parties. We may share your
                        information in the following circumstances:
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Service Providers</h3>
                        <p className="mb-4">
                          We may share information with trusted third-party service providers who assist us in:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Database hosting (Supabase)</li>
                          <li>Translation services (LibreTranslate)</li>
                          <li>Analytics and monitoring</li>
                          <li>Email delivery services</li>
                        </ul>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Legal Requirements</h3>
                        <p className="mb-4">We may disclose information if required by law or to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Comply with legal processes</li>
                          <li>Protect our rights and property</li>
                          <li>Ensure user safety</li>
                          <li>Investigate fraud or security issues</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">5. Data Security</h2>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200 mb-6">
                      <p className="text-slate-700 leading-relaxed mb-4">
                        We implement appropriate security measures to protect your information:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Encryption of data in transit and at rest</li>
                        <li>Secure authentication systems</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls and monitoring</li>
                        <li>Secure hosting infrastructure</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                      <p className="text-slate-700 leading-relaxed">
                        However, no method of transmission over the internet is 100% secure. While we strive to protect
                        your information, we cannot guarantee absolute security.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">6. Your Rights and Choices</h2>
                    <p className="mb-6">You have the following rights regarding your personal information:</p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Access and Control</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Access and review your personal information</li>
                          <li>Update or correct your information</li>
                          <li>Delete your account and data</li>
                          <li>Export your learning data</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                        <h3 className="text-xl font-medium text-slate-900 mb-4">Communication Preferences</h3>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700">
                          <li>Opt out of promotional emails</li>
                          <li>Manage notification settings</li>
                          <li>Control data sharing preferences</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">7. Contact Us</h2>
                    <p className="mb-6">
                      If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                          <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                            <Mail className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="font-medium text-slate-900">Email</p>
                          <p className="text-slate-600">privacy@lingslatepal.com</p>
                        </div>
                        <div className="text-center">
                          <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <p className="font-medium text-slate-900">Support</p>
                          <p className="text-slate-600">support@lingslatepal.com</p>
                        </div>
                        <div className="text-center">
                          <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                            <Home className="h-6 w-6 text-purple-600" />
                          </div>
                          <p className="font-medium text-slate-900">Website</p>
                          <p className="text-slate-600">lingslatepal.com</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Footer */}
        <motion.div
          className="mt-12 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/terms">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 bg-transparent"
            >
              Terms of Service
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
