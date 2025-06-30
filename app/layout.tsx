"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/mobile-nav"
import { FloatingNavButton } from "@/components/floating-nav-button"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { Toaster } from "sonner"
import { Loader2 } from "lucide-react"
import { Lobster } from "next/font/google"

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400", // adjust as needed
  display: "swap", // optional
})

const inter = Inter({ subsets: ["latin"] })

// Header Component
function Header() {
  // Generate a random gradient between green and purple for "Intere"
  const generateRandomGradient = () => {
    const greenHues = [120, 140, 160]; // Green spectrum
    const purpleHues = [280, 300, 320]; // Purple spectrum
    
    const hue1 = greenHues[Math.floor(Math.random() * greenHues.length)];
    const hue2 = purpleHues[Math.floor(Math.random() * purpleHues.length)];
    
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))`;
  };

  // Generate fusion gradient for "st" (blending the green-purple with #fec400)
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

// Since we're using "use client", we need to handle metadata differently
// This would typically be in a separate server component or moved to page level

interface RootLayoutProps {
  children: React.ReactNode
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Public routes that don't require authentication
  const publicRoutes = ['/auth', '/landing', '/about', '/terms', '/privacy']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push('/auth')
    }
  }, [user, loading, pathname, router, isPublicRoute])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#fec400]" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated and trying to access protected route, don't render children
  // The useEffect will handle the redirect
  if (!user && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#fec400]" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function LayoutContent({ children }: RootLayoutProps) {
  const pathname = usePathname()
  
  // Hide mobile nav on specific pages
  const hideNavRoutes = ['/me', '/auth', '/onboarding']
  const showMobileNav = !hideNavRoutes.includes(pathname)
  
  // Hide header on specific pages (you can customize this list)
  const hideHeaderRoutes = ['/auth', '/onboarding']
  const showHeader = !hideHeaderRoutes.includes(pathname)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AuthGuard>
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
        </AuthGuard>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        
      </head>
      <body className={inter.className}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  )
  }
