"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Recycle, Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Eeko</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              pathname === "/" ? "text-green-600" : "text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/submit"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              pathname === "/submit" ? "text-green-600" : "text-foreground"
            }`}
          >
            Submit E-Waste
          </Link>
          <Link
            href="/employee"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              pathname === "/employee" ? "text-green-600" : "text-foreground"
            }`}
          >
            Employee Portal
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <nav className="container flex flex-col space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === "/" ? "text-green-600" : "text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/submit"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === "/submit" ? "text-green-600" : "text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Submit E-Waste
            </Link>
            <Link
              href="/employee"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                pathname === "/employee" ? "text-green-600" : "text-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Employee Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

