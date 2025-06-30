"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/mobile-nav"
import { FloatingNavButton } from "@/components/floating-nav-button"
import { Toaster } from "sonner"
import { Lobster } from "next/font/google"

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const inter = Inter({ subsets: ["latin"] })

// Header Component
function Header() {
  const generateRandomGradient = () => {
    const greenHues = [120, 140, 160];
    const purpleHues = [280, 300, 320];
    
    const hue1 = greenHues[Math.floor(Math.random() * greenHues.length)];
    const hue2 = purpleHues[Math.floor(Math.random() * purpleHues.length)];
    
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))`;
  };

  const generateFusionGradient = () => {
    return `linear-gradient(135deg, hsl(280, 70%, 50%), #fec400, hsl(140, 70%, 50%))`;
  };

  const intereGradient = generateRandomGradient();
  const stGradient = generateFusionGradient();

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="flex justify-center items-center py-3">
        <h1 className={`text-3xl font-bold tracking-wide ${lobster.className}`}>
          <span 
            className="bg-clip-text text-transparent"
            style={{ 
              background: intereGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Intere
          </span>
          <span 
            className="bg-clip-text text-transparent"
            style={{ 
              background: stGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            st
          </span>
          <span style={{ color: '#fec400' }}>
            an
          </span>
        </h1>
      </div>
    </header>
  );
}

interface RootLayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: RootLayoutProps) {
  const pathname = usePathname()
  
  // Hide mobile nav on specific pages
  const hideNavRoutes = ['/me', '/auth', '/onboarding']
  const showMobileNav = !hideNavRoutes.includes(pathname)
  
  // Hide header on specific pages
  const hideHeaderRoutes = ['/auth', '/onboarding']
  const showHeader = !hideHeaderRoutes.includes(pathname)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="relative min-h-screen flex flex-col">
        {showHeader && <Header />}
        <main className="flex-1">
          {children}
        </main>
        {showMobileNav && (
          <>
            <MobileNav />
            <FloatingNavButton />
          </>
        )}
      </div>
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Interestan</title>
        <meta name="description" content="Connect with your favorite idols" />
      </head>
      <body className={inter.className}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  )
              }
