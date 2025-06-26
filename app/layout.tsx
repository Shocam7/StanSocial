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

const inter = Inter({ subsets: ["latin"] })

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
  const hideNavRoutes = ['/me', '/auth']
  const showMobileNav = !hideNavRoutes.includes(pathname)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AuthGuard>
          <div className="relative min-h-screen flex flex-col">
            {children}
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
      <body className={inter.className}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  )
}