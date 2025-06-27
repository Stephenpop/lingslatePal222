"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, User, Languages, Lock, Upload } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: "",
    learning_language: "es",
    native_language: "en",
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }
      setUser(currentUser)

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single()
      if (profileError && profileError.code !== "PGRST116") {
        throw profileError
      }
      setProfile(profileData)
      setFormData({
        full_name: profileData?.full_name || "",
        avatar_url: profileData?.avatar_url || "",
        learning_language: profileData?.learning_language || "es",
        native_language: profileData?.native_language || "en",
      })
    } catch (error) {
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
      return data.publicUrl
    } catch (error) {
      toast.error("Failed to upload avatar")
      throw error
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let updatedAvatarUrl = formData.avatar_url
      if (avatarFile) {
        updatedAvatarUrl = await uploadAvatar(avatarFile)
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          avatar_url: updatedAvatarUrl,
          learning_language: formData.learning_language,
          native_language: formData.native_language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
      if (error) throw error

      toast.success("Profile updated successfully")
      setProfile({ ...profile, ...formData, avatar_url: updatedAvatarUrl })
      setAvatarFile(null)
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords do not match")
      return
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      })
      if (error) throw error

      toast.success("Password updated successfully")
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
    } catch (error) {
      toast.error("Failed to update password")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Languages className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">LingslatePal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile
              </CardTitle>
              <CardDescription className="text-slate-600">
                Update your personal information and language preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={formData.avatar_url || profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {formData.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="text-sm font-medium text-slate-700">
                      Profile Picture
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="full_name" className="text-sm font-medium text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="learning_language" className="text-sm font-medium text-slate-700">
                    Learning Language
                  </Label>
                  <Select
                    value={formData.learning_language}
                    onValueChange={(value) => handleSelectChange("learning_language", value)}
                  >
                    <SelectTrigger className="mt-1 border-slate-200 bg-white/80 text-slate-800">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="native_language" className="text-sm font-medium text-slate-700">
                    Native Language
                  </Label>
                  <Select
                    value={formData.native_language}
                    onValueChange={(value) => handleSelectChange("native_language", value)}
                  >
                    <SelectTrigger className="mt-1 border-slate-200 bg-white/80 text-slate-800">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Save Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow mt-6">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-slate-600">
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="current_password" className="text-sm font-medium text-slate-700">
                    Current Password
                  </Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="new_password" className="text-sm font-medium text-slate-700">
                    New Password
                  </Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
