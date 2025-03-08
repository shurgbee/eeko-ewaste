import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Eeko - E-Waste Collection",
  description: "Eeko is on a mission to make e-waste recycling easy and accessible for everyone.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <Navbar />
          {children}
          <Toaster />
      </body>
    </html>
  )
}

