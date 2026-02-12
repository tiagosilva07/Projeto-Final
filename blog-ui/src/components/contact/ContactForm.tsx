import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  function updateField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Form submitted:", form)
    alert("Message sent! (not really, but the UI is ready)")
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Send a Message</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={updateField}
            required
          />

          <Input
            name="email"
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={updateField}
            required
          />

          <Textarea
            name="message"
            placeholder="Your message"
            value={form.message}
            onChange={updateField}
            className="min-h-[120px]"
            required
          />

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
