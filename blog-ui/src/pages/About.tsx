import  AboutHeader  from "@/components/about/Header"
import  AboutContent  from "@/components/about/Content"
import  AboutTech  from "@/components/about/AboutTech"

export default function About() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-16">
      <AboutHeader />
      <AboutContent />
      <AboutTech />
    </div>
  )
}
