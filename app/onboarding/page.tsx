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
      return
    }

    // Check if user has already completed onboarding
    checkOnboardingStatus()
  }, [user, router])

  const checkOnboardingStatus = async () => {
    if (!user) return

    const supabase = getSupabaseBrowser()
    
    try {
      // Check if user has completed onboarding
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (userError) {
        console.error('Error checking user onboarding status:', userError)
        return
      }

      // If onboarding is already completed, redirect to homepage
      if (userData?.onboarding_completed) {
        router.push('/')
        return
      }

      // Alternative check: if user has stanned idols, consider onboarding complete
      const { data: stanData, error: stanError } = await supabase
        .from('user_stanned_idols')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (stanError) {
        console.error('Error checking stan data:', stanError)
        return
      }

      if (stanData?.length > 0) {
        // Mark onboarding as complete and redirect
        await supabase
          .from('users')
          .update({ onboarding_completed: true })
          .eq('id', user.id)
        
        router.push('/')
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    }
  }

  const handleCompleteOnboarding = async (data: {
    categories: string[]
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

      // 3. Update user categories/preferences
      // You'll need to add these fields to your users table or create a separate table
      if (data.categories.length > 0) {
        await supabase
          .from('users')
          .update({
            categories: data.categories // Make sure this field exists in your users table
          })
          .eq('id', user.id)
      }

      // 4. Mark onboarding as complete
      await supabase
        .from('users')
        .update({
          onboarding_completed: true
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