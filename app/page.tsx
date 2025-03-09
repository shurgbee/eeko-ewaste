"use client"
import Link from "next/link"
import { ArrowRight, Recycle } from "lucide-react"

import Image from "next/image"
import SplitText from "@/components/reactbits/SplitText/SplitText"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
      <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] bg-[#bdd59a]">
        <div className="container h-[50vh] mx-auto flex flex-col items-center justify-center px-4 py-16 md:py-20">
          <SplitText
          text="Here at Ekko"
          className="text-9xl font-bold text-[#569a53] mb-2"
          delay={50}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.1}
          rootMargin="-50px"
          />
          {/* Decorative leaves could be background images or inline images if you prefer */}
        </div>
      </section>

      {/* E-Waste Explanation Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-5xl font-bold text-green-700 mb-8">Electronic Waste</h2>
        <p className="text-gray-800 mb-6 font-semibold">
          Each year, millions of electrical and electronic devices are discarded as they break
          down or become outdated. These discarded items, known as e-waste, pose a significant
          risk to human health and the environment if not properly disposed of or recycled. Read
          more about this global issue and how you can be part of the solution.
        </p>
        <Link href="https://www.who.int/news-room/fact-sheets/detail/electronic-waste-(e-waste)" target="_blank" rel="noopener noreferrer">
          <button
            className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 transition" 
          >
              WHO Article
          </button>
        </Link>
      </section>

      {/* Our Mission Section */}
      <section className="container mx-auto px-4 py-12 flex flex-col md:flex-row md:items-center gap-8">
        {/* Left side text */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Eeko, we strive to make e-waste recycling effortless and accessible for everyone.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong>Effortless Recycling:</strong> Convenient pickup service for all types of e-waste.</li>
            <li><strong>Responsible Processing:</strong> Certified recycling and ethical disposal methods.</li>
            <li><strong>Sustainable Impact:</strong> Reducing e-waste pollution for a greener future.</li>
          </ul>
        </div>

        {/* Right side image */}
        <div className="md:w-1/2">
          {/* Example using next/image from /public or an external source */}
          <div className="relative w-full h-64">
            <Image
              src="/kendrick.jpg" // Replace with your actual image path or use an external image
              alt="E-waste recycling"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative w-full bg-green-100">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Ready to Recycle?</h2>
          <p className="text-gray-600 mb-6 text-center max-w-xl">
            Let’s work together to properly recycle your old or unwanted electronic devices,
            protecting both people and planet in the process.
          </p>
          <Link href="/schedule">
            <button className="px-6 py-3 rounded bg-green-700 text-white hover:bg-green-800 transition">
              Schedule a Pickup
            </button>
          </Link>
        </div>
      </section>
    </div>
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

