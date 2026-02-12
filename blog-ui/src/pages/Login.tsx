import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { loginRequest, type LoginRequest } from "@/services/auth"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const { login } = useAuth()
  const [error, setError] = useState("")

  const navigate = useNavigate();
    
 const [form, setForm] = useState<LoginRequest>({
    username: "",
    password: "",
  })

  function handleUpdateField(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
        const response = await loginRequest(form);
      if (!response.token || !response.username) throw new Error("Login failed")
      login(response.token, response.refreshToken, response.username, response.role)
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Log in to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleUpdateField}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleUpdateField}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>

            <Separator />

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Register
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
