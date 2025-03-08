import Link from "next/link"
import { ArrowRight, Recycle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to <span className="text-green-600 dark:text-green-400">Eeko</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We're on a mission to make e-waste recycling easy and accessible for everyone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/submit">
                    Recycle Your E-Waste <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-green-100 p-2 dark:bg-green-800">
                  <Recycle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Mission</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  At Eeko, we believe in a sustainable future where electronic waste is properly managed and recycled.
                  Our mission is to make e-waste recycling convenient and accessible to everyone, reducing the
                  environmental impact of electronic devices.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Convenient pickup service for all types of e-waste</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Proper recycling and disposal methods</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Reducing environmental impact of electronic devices</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <img
                  alt="E-waste recycling"
                  className="rounded-lg object-cover"
                  height={400}
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Recycle?</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Submit your e-waste for collection and we'll take care of the rest.
                </p>
              </div>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/submit">
                  Submit Your E-Waste <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-green-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Recycle className="h-6 w-6" />
              <span className="text-lg font-bold">Eeko</span>
            </div>
            <p className="text-sm text-gray-300">© {new Date().getFullYear()} Eeko. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

