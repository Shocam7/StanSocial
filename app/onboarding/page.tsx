"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getSupabaseBrowser } from '@/lib/supabase'
import { friendshipService } from '@/lib/friendship-service'
import { toast } from 'sonner'
import OnboardingFlow from '@/components/onboarding-flow'

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  const handleCompleteOnboarding = async (data: {
    interests: string[]
    idols: string[]
    friends: string[]
  }) => {
    if (!user) return

    setLoading(true)
    const supabase = getSupabaseBrowser()

    try {
      // 1. Stan selected idols
      if (data.idols.length > 0) {
        const stanPromises = data.idols.map(idolId =>
          supabase
            .from('user_stanned_idols')
            .insert({
              user_id: user.id,
              idol_id: idolId
            })
        )
        await Promise.all(stanPromises)
        
        // Update idol stan counts
        const updatePromises = data.idols.map(idolId =>
          supabase.rpc('increment_idol_stans', { idol_id: idolId })
        )
        await Promise.all(updatePromises)
      }

      // 2. Send friend requests
      if (data.friends.length > 0) {
        const friendPromises = data.friends.map(friendId =>
          friendshipService.sendFriendRequest(user.id, friendId)
        )
        await Promise.all(friendPromises)
      }

      // 3. Update user interests/preferences (you might want to add this to your schema)
      // For now, we'll store it in a JSON field or create a user_interests table
      if (data.interests.length > 0) {
        await supabase
          .from('users')
          .update({
            // You might want to add an interests field to users table
            // interests: data.interests
          })
          .eq('id', user.id)
      }

      // 4. Mark onboarding as complete (add onboarding_completed field to users table)
      await supabase
        .from('users')
        .update({
          // onboarding_completed: true
        })
        .eq('id', user.id)

      toast.success('Welcome to Idol Stan! Your account is all set up.')
      
      // Redirect to homepage
      router.push('/')
    } catch (error) {
      console.error('Onboarding error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <OnboardingFlow 
      onComplete={handleCompleteOnboarding}
      loading={loading}
    />
  )
    }
