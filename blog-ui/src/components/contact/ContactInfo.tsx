import { Separator } from "@/components/ui/separator"
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons"

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Other Ways to Reach Me</h2>
      <Separator />

      <div className="flex flex-col gap-4 text-muted-foreground">

        <a href="mailto:your@email"
           className="flex items-center gap-3 hover:text-foreground transition-colors">
          <EnvelopeClosedIcon className="w-5 h-5" />
          your@email
        </a>

        <a href="#" className="flex items-center gap-3 hover:text-foreground transition-colors">
          <GitHubLogoIcon className="w-5 h-5" />
          GitHub
        </a>

        <a href="#" className="flex items-center gap-3 hover:text-foreground transition-colors">
          <LinkedInLogoIcon className="w-5 h-5" />
          LinkedIn
        </a>

      </div>
    </div>
  )
}
