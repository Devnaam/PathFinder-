import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pathfinder</h3>
            <p className="text-sm text-muted-foreground">
              Transform your skills into a complete career journey with personalized roadmaps and resources.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/skills" className="text-muted-foreground hover:text-primary">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-primary">
                  Skill Quiz
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary">
                  Career Paths
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover:text-primary">
                  Learning Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-primary">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pathfinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
