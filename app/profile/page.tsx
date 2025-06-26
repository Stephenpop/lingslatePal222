"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { authService } from "@/lib/auth"
import { toast } from "sonner"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ full_name: "", avatar_url: "" })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const user = await authService.getCurrentUser()
    if (!user) return
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    setProfile(data)
    setForm({ full_name: data.full_name || "", avatar_url: data.avatar_url || "" })
    setLoading(false)
  }

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    const user = await authService.getCurrentUser()
    if (!user) return
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, avatar_url: form.avatar_url })
      .eq("id", user.id)
    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated!")
      loadProfile()
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={form.avatar_url} />
              <AvatarFallback>
                {form.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Input
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="Avatar URL"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full"
            />
          </div>
          <Button onClick={handleSave} className="w-full" disabled={loading}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 