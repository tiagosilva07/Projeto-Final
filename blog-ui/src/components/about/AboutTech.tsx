import { Badge } from "@/components/ui/badge"

export default function AboutTech() {
  const tech = [
    "React", "TypeScript", "Vite", "Tailwind", "shadcn/ui",
    "Spring Boot", "Java", "H2DB", "Cloudinary"
  ]

  return (
    <section className="max-w-3xl mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-4">Tech Behind the Blog</h2>

      <div className="flex flex-wrap gap-3">
        {tech.map((t) => (
          <Badge key={t} variant="secondary" className="px-3 py-1 text-sm">
            {t}
          </Badge>
        ))}
      </div>
    </section>
  )
}
