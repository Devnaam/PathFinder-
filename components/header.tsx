"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Skills", href: "/skills" },
  { name: "Quiz", href: "/quiz" },
  { name: "Careers", href: "/careers" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl">Pathfinder</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/dashboard" className="hidden md:block">
            <Button variant="outline" size="sm">
              My Dashboard
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-2",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link href="/dashboard" className="mt-4">
                  <Button className="w-full">My Dashboard</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
