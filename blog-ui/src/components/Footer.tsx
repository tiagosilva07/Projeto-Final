import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon, } from "@radix-ui/react-icons"

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">

          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold">Tiago’s Blog</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ideas, code, and creativity.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-6">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitHubLogoIcon className="w-6 h-6"/>
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LinkedInLogoIcon className="w-6 h-6"/>
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TwitterLogoIcon className="w-6 h-6"/>
            </a>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tiago’s Blog — Built with ❤️ using React, shadcn, Tailwind & Spring Boot.
        </div>
      </div>
    </footer>
  )
}
