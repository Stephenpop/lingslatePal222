"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Languages, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <motion.nav
        className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Languages className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900">LingslatePal</span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="border-gray-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-gray-900">Privacy Policy</CardTitle>
              <p className="text-gray-600">Last updated: January 22, 2024</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6 text-gray-700">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                  <p>
                    LingslatePal ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                    explains how we collect, use, disclose, and safeguard your information when you use our language
                    learning and translation service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

                  <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
                  <p>We may collect the following personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and email address (when you create an account)</li>
                    <li>Profile information (learning preferences, native language)</li>
                    <li>Authentication data (encrypted passwords)</li>
                    <li>Communication data (support messages, feedback)</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">Usage Information</h3>
                  <p>We automatically collect certain information about your use of our service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Learning progress and statistics (XP points, streaks, lessons completed)</li>
                    <li>Translation history (text you translate)</li>
                    <li>Quiz results and performance data</li>
                    <li>Device information (browser type, operating system)</li>
                    <li>Usage patterns and preferences</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">Technical Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address and location data</li>
                    <li>Browser and device identifiers</li>
                    <li>Log files and analytics data</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                  <p>We use your information for the following purposes:</p>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Service Provision</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide translation and language learning services</li>
                    <li>Track your learning progress and maintain streaks</li>
                    <li>Personalize your learning experience</li>
                    <li>Enable social features like leaderboards</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Communication</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Send account-related notifications</li>
                    <li>Provide customer support</li>
                    <li>Send educational content and tips</li>
                    <li>Notify you of service updates</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Improvement and Analytics</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyze usage patterns to improve our service</li>
                    <li>Develop new features and content</li>
                    <li>Monitor service performance and security</li>
                    <li>Conduct research and analytics</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share your
                    information in the following circumstances:
                  </p>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Service Providers</h3>
                  <p>We may share information with trusted third-party service providers who assist us in:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Database hosting (Supabase)</li>
                    <li>Translation services (LibreTranslate)</li>
                    <li>Analytics and monitoring</li>
                    <li>Email delivery services</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Legal Requirements</h3>
                  <p>We may disclose information if required by law or to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Comply with legal processes</li>
                    <li>Protect our rights and property</li>
                    <li>Ensure user safety</li>
                    <li>Investigate fraud or security issues</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                  <p>We implement appropriate security measures to protect your information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure authentication systems</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and monitoring</li>
                    <li>Secure hosting infrastructure</li>
                  </ul>
                  <p className="mt-4">
                    However, no method of transmission over the internet is 100% secure. While we strive to protect your
                    information, we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
                  <p>We retain your information for as long as necessary to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide our services to you</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Improve our services</li>
                  </ul>
                  <p className="mt-4">
                    You may request deletion of your account and associated data at any time through your account
                    settings or by contacting us.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
                  <p>You have the following rights regarding your personal information:</p>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Access and Control</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Update or correct your information</li>
                    <li>Delete your account and data</li>
                    <li>Export your learning data</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 mb-3 mt-4">Communication Preferences</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Opt out of promotional emails</li>
                    <li>Manage notification settings</li>
                    <li>Control data sharing preferences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Email:</strong> privacy@lingslatepal.com
                    </p>
                    <p>
                      <strong>Support:</strong> support@lingslatepal.com
                    </p>
                    <p>
                      <strong>Website:</strong> https://lingslatepal.com
                    </p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Footer */}
        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/terms">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Terms of Service
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
