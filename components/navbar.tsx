"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BrainCircuit, Home, LineChart, Menu, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const routes = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Predict",
    path: "/predict",
    icon: TrendingUp,
  },
  {
    name: "Risk Analysis",
    path: "/risk-analysis",
    icon: LineChart,
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">QuantumInsight</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          {routes.map((route) => {
            const isActive = pathname === route.path

            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "group relative flex items-center text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.name}
                {isActive && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0 sm:max-w-sm">
              <div className="px-7">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <span className="font-bold">QuantumInsight</span>
                </Link>
              </div>
              <nav className="mt-8 flex flex-col gap-6 px-7">
                {routes.map((route) => {
                  const isActive = pathname === route.path

                  return (
                    <Link
                      key={route.path}
                      href={route.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.name}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function cn(...classes: any) {
  return classes.filter(Boolean).join(" ")
}
