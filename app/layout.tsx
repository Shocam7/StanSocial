"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/mobile-nav"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

// Since we're using "use client", we need to handle metadata differently
// This would typically be in a separate server component or moved to page level

interface RootLayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: RootLayoutProps) {
  const pathname = usePathname()
  
  // Hide mobile nav on the /me page
  const showMobileNav = pathname !== '/me'

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <div className="relative min-h-screen flex flex-col">
          {children}
          {showMobileNav && <MobileNav />}
        </div>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  )
}