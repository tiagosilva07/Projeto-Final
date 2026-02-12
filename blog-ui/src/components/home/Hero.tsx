import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { memo } from "react"

interface HeroProps {
  title: string
  content: string
  image?: string
  link: string
  state?: unknown
}

export const Hero = memo(function Hero({ title, content, image, link, state }: HeroProps) {
  return (
    <section className="relative h-[380px] rounded-xl overflow-hidden shadow-lg">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-10 text-white">
        <h1 className="text-4xl font-bold mb-3">{title}</h1>
        <p className="text-lg max-w-xl">{content}</p>

        <Link to={link} state={state}>
          <Button variant="secondary" className="mt-4">
            Read More
          </Button>
        </Link>
      </div>
    </section>
  )
});
