"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Languages, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TermsPage() {
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
              <CardTitle className="text-3xl text-gray-900">Terms of Service</CardTitle>
              <p className="text-gray-600">Last updated: January 22, 2024</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6 text-gray-700">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using LingslatePal ("the Service"), you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this
                    service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                  <p>LingslatePal is a free language learning and translation platform that provides:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Free translation services between 100+ languages including African languages</li>
                    <li>Interactive language learning lessons</li>
                    <li>Quizzes and progress tracking</li>
                    <li>Gamification features including XP points and streaks</li>
                    <li>Offline functionality through Progressive Web App (PWA) technology</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                  <p>
                    To access certain features of the Service, you may be required to create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your account information</li>
                    <li>Keep your password secure and confidential</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
                  <p>You agree not to use the Service to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Transmit harmful, offensive, or inappropriate content</li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>Attempt to gain unauthorized access to any part of the Service</li>
                    <li>Use the Service for commercial purposes without permission</li>
                    <li>Impersonate others or provide false information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are owned by LingslatePal and are
                    protected by international copyright, trademark, patent, trade secret, and other intellectual
                    property laws.
                  </p>
                  <p>
                    You retain rights to any content you submit, post, or display on the Service. By submitting content,
                    you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute such
                    content in connection with the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy Policy</h2>
                  <p>
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of
                    the Service, to understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Translation Services</h2>
                  <p>
                    Our translation services are provided "as is" and are powered by LibreTranslate and other
                    open-source translation engines. While we strive for accuracy, we cannot guarantee the correctness
                    of all translations. Users should verify important translations independently.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Gamification and Progress</h2>
                  <p>
                    LingslatePal includes gamification features such as XP points, streaks, achievements, and
                    leaderboards. These features are for motivational purposes only and have no monetary value. We
                    reserve the right to modify or reset progress data if necessary for system maintenance or abuse
                    prevention.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
                  <p>
                    The Service is provided "as is" without warranties of any kind. We disclaim all warranties, express
                    or implied, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Merchantability and fitness for a particular purpose</li>
                    <li>Non-infringement of third-party rights</li>
                    <li>Accuracy, completeness, or reliability of content</li>
                    <li>Uninterrupted or error-free operation</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                  <p>
                    In no event shall LingslatePal be liable for any indirect, incidental, special, consequential, or
                    punitive damages, including but not limited to loss of profits, data, or use, arising out of or in
                    connection with your use of the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
                  <p>
                    We may terminate or suspend your account and access to the Service immediately, without prior
                    notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third
                    parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users of significant changes
                    by posting the new Terms on this page and updating the "Last updated" date. Your continued use of
                    the Service after changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                    without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
                  <p>If you have any questions about these Terms of Service, please contact us at:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Email:</strong> support@lingslatepal.com
                    </p>
                    <p>
                      <strong>Website:</strong> https://lingslatepal.com
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Severability</h2>
                  <p>
                    If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions
                    will remain in full force and effect.
                  </p>
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
          <Link href="/privacy">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Privacy Policy
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
