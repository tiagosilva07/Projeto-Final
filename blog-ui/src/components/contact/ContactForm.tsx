import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function updateField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Clear field error when user starts typing
    setErrors({ ...errors, [name]: "" })
    setErrorMessage("")
    setSuccessMessage("")
  }

  function validateForm(): boolean {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    }

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters"
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format"
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = "Message is required"
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    } else if (form.message.trim().length > 500) {
      newErrors.message = "Message must not exceed 500 characters"
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.email && !newErrors.message
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Simulate API call (replace with actual backend integration when ready)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Form submitted:", form)
      setSuccessMessage("Thank you for your message! We'll get back to you soon.")
      
      // Reset form
      setForm({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Send a Message</CardTitle>
      </CardHeader>

      <CardContent>
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={updateField}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={updateField}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message (10-500 characters)"
              value={form.message}
              onChange={updateField}
              className="min-h-[120px]"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {form.message.length}/500 characters
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
