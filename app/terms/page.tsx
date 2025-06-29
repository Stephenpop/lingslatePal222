"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Languages, ArrowLeft, Home, FileText, Scale, Shield, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TermsPage() {
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
                <Scale className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-600 mb-2">Our commitment to fair and transparent service</p>
            <p className="text-slate-500">Last updated: January 22, 2024</p>
          </div>

          <Card className="border-slate-200 bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="prose prose-slate max-w-none">
                <div className="space-y-10 text-slate-700">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <p className="text-slate-700 leading-relaxed">
                        By accessing and using LingslatePal ("the Service"), you accept and agree to be bound by the
                        terms and provision of this agreement. If you do not agree to abide by the above, please do not
                        use this service.
                      </p>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Languages className="h-6 w-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">2. Description of Service</h2>
                    </div>
                    <p className="mb-6">
                      LingslatePal is a free language learning and translation platform that provides:
                    </p>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <ul className="list-disc pl-6 space-y-3 text-slate-700">
                        <li>Free translation services between 100+ languages including African languages</li>
                        <li>Interactive language learning lessons</li>
                        <li>Quizzes and progress tracking</li>
                        <li>Gamification features including XP points and streaks</li>
                        <li>Offline functionality through Progressive Web App (PWA) technology</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">3. User Accounts</h2>
                    </div>
                    <p className="mb-6">
                      To access certain features of the Service, you may be required to create an account. You agree to:
                    </p>
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                      <ul className="list-disc pl-6 space-y-3 text-slate-700">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and update your account information</li>
                        <li>Keep your password secure and confidential</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Shield className="h-6 w-6 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-900">4. Acceptable Use</h2>
                    </div>
                    <p className="mb-6">You agree not to use the Service to:</p>
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                      <ul className="list-disc pl-6 space-y-3 text-slate-700">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Transmit harmful, offensive, or inappropriate content</li>
                        <li>Interfere with or disrupt the Service or servers</li>
                        <li>Attempt to gain unauthorized access to any part of the Service</li>
                        <li>Use the Service for commercial purposes without permission</li>
                        <li>Impersonate others or provide false information</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">5. Content and Intellectual Property</h2>
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-xl">
                        <p className="text-slate-700 leading-relaxed">
                          The Service and its original content, features, and functionality are owned by LingslatePal
                          and are protected by international copyright, trademark, patent, trade secret, and other
                          intellectual property laws.
                        </p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-xl">
                        <p className="text-slate-700 leading-relaxed">
                          You retain rights to any content you submit, post, or display on the Service. By submitting
                          content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and
                          distribute such content in connection with the Service.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">6. Translation Services</h2>
                    <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                      <p className="text-slate-700 leading-relaxed">
                        Our translation services are provided "as is" and are powered by LibreTranslate and other
                        open-source translation engines. While we strive for accuracy, we cannot guarantee the
                        correctness of all translations. Users should verify important translations independently.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">7. Gamification and Progress</h2>
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                      <p className="text-slate-700 leading-relaxed">
                        LingslatePal includes gamification features such as XP points, streaks, achievements, and
                        leaderboards. These features are for motivational purposes only and have no monetary value. We
                        reserve the right to modify or reset progress data if necessary for system maintenance or abuse
                        prevention.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">8. Disclaimers</h2>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <p className="text-slate-700 leading-relaxed mb-4">
                        The Service is provided "as is" without warranties of any kind. We disclaim all warranties,
                        express or implied, including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Merchantability and fitness for a particular purpose</li>
                        <li>Non-infringement of third-party rights</li>
                        <li>Accuracy, completeness, or reliability of content</li>
                        <li>Uninterrupted or error-free operation</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">9. Contact Information</h2>
                    <p className="mb-6">
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="text-center">
                          <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="font-medium text-slate-900">Support Email</p>
                          <p className="text-slate-600">support@lingslatepal.com</p>
                        </div>
                        <div className="text-center">
                          <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                            <Home className="h-6 w-6 text-purple-600" />
                          </div>
                          <p className="font-medium text-slate-900">Website</p>
                          <p className="text-slate-600">https://lingslatepal.com</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">10. Changes to Terms</h2>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <p className="text-slate-700 leading-relaxed">
                        We reserve the right to modify these Terms at any time. We will notify users of significant
                        changes by posting the new Terms on this page and updating the "Last updated" date. Your
                        continued use of the Service after changes constitutes acceptance of the new Terms.
                      </p>
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
          <Link href="/privacy">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 bg-transparent"
            >
              Privacy Policy
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
