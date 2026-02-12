import { Separator } from "@/components/ui/separator"

export default function AboutContent() {
  return (
    <section className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed">
      <p>
        Hey, I’m Tiago — a developer who loves building tools, exploring new tech,
        and sharing what I learn along the way. This blog is my digital playground,
        a place where I write about software architecture, security, AI, and the
        occasional random idea that refuses to leave my brain.
      </p>

      <p>
        I believe in learning by building, breaking things, fixing them again,
        and documenting the journey. If you’re into clean architecture, modern
        frontend design, backend engineering, or just enjoy reading about tech
        experiments, you’ll feel right at home here.
      </p>

      <Separator />

      <p>
        Outside of coding, I enjoy exploring new ideas, contributing to open‑source,
        and crafting tools that make developers’ lives easier.  
        Thanks for stopping by — I hope you find something here that inspires you.
      </p>
    </section>
  )
}
