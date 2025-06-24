"use client"

import { useAuth } from '@/hooks/use-auth'
import { AuthModal } from './auth-modal'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    } else if (user) {
      setShowAuthModal(false)
    }
  }, [user, loading])

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

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold mb-4">Welcome to IdolApp</h1>
              <p className="text-muted-foreground mb-6">
                Sign in to stan your favorite idols and join the community
              </p>
              <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </div>
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
        }
