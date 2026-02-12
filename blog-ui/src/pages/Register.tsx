import React, { useState } from "react"
import { register } from "@/services/auth"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router"

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  })

  const [registerError, setRegisterError] = useState("")
  const [successRegister, setSuccessRegister] = useState("")

  function handleUpdateField(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

function validateAllFields() {
  const newErrors: any = {}

  // Username
  if (!form.username.trim()) newErrors.username = "Username is required"
  else if (form.username.length < 3)
    newErrors.username = "Username must be at least 3 characters"
  else newErrors.username = ""

  // Name
  if (!form.name.trim()) newErrors.name = "Full name is required"
  else newErrors.name = ""

  // Extra rule: username and name cannot be the same
  if (
    form.username.trim() &&
    form.name.trim() &&
    form.username.trim().toLowerCase() === form.name.trim().toLowerCase()
  ) {
    newErrors.username = "Username and full name cannot be the same"
    // or:
    // newErrors.name = "Full name must be different from username"
  }

  // Email
  if (!form.email.trim()) newErrors.email = "Email is required"
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    newErrors.email = "Invalid email format"
  else newErrors.email = ""

  // Password
  if (!form.password.trim()) newErrors.password = "Password is required"
  else if (form.password.length < 6)
    newErrors.password = "Password must be at least 6 characters"
  else newErrors.password = ""

  setErrors(newErrors)
  return newErrors
}


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const validation = validateAllFields()
    const hasErrors = Object.values(validation).some((msg) => msg !== "")

    if (hasErrors) return

    try {
      await register(form)
      setSuccessRegister(
        "You have successfully registered! Please log in to continue."
      )
      setRegisterError("")
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/login");
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : "Registration failed"
      setRegisterError(message)
      setSuccessRegister("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join the community and start exploring
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleUpdateField}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleUpdateField}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleUpdateField}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleUpdateField}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>

            <Separator />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </p>
          </form>

          {/* Backend error */}
          {registerError && (
            <div className="text-red-500 text-sm text-center mt-4">
              {registerError}
            </div>
          )}

          {/* Success message */}
          {successRegister && (
            <div className="text-green-500 text-sm text-center mt-4">
              {successRegister}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
