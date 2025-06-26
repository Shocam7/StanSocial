"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/hooks/use-auth'
import { Eye, EyeOff, Loader2, Sparkles, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase'

export default function AuthPage() {
  const { signIn, signUp, resetPassword, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')

  // Sign in form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })

  // Sign up form state
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Reset password form state
  const [resetForm, setResetForm] = useState({
    email: '',
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      checkOnboardingStatus()
    }
  }, [user, router])

  // Check if user has completed onboarding
  const checkOnboardingStatus = async () => {
    if (!user) return

    const supabase = getSupabaseBrowser()
    
    try {
      // Check if user has completed onboarding
      // Option 1: Check for onboarding_completed field
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      // Option 2: If no dedicated field, check if user has any stanned idols
      // (indicating they've completed onboarding)
      const { data: stanData, error: stanError } = await supabase
        .from('user_stanned_idols')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (stanError) throw stanError

      // Redirect based on onboarding status
      if (userData?.onboarding_completed || stanData?.length > 0) {
        router.push('/')
      } else {
        router.push('/onboarding')
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // Default to homepage if there's an error
      router.push('/')
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await signIn(signInForm.email, signInForm.password)
    
    if (success) {
      // Don't redirect here - let the useEffect handle it after user state updates
      // The checkOnboardingStatus will be called automatically
    }
    
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signUpForm.password !== signUpForm.confirmPassword) {
      return
    }

    if (signUpForm.password.length < 6) {
      return
    }

    setLoading(true)

    const success = await signUp(
      signUpForm.email,
      signUpForm.password,
      signUpForm.name,
      signUpForm.username
    )
    
    if (success) {
      // For new users, always redirect to onboarding
      // We don't need to check onboarding status for new signups
      router.push('/onboarding')
    }
    
    setLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await resetPassword(resetForm.email)
    
    if (success) {
      setMode('signin')
    }
    
    setLoading(false)
  }

  if (user) {
    return null // Will redirect based on onboarding status
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Floating Sparkles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-white/20" />
            </div>
          ))}
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/30 to-violet-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Auth Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              {mode === 'signin' && (
                <>
                  <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-white/70 text-lg">
                    Sign in to continue your journey
                  </CardDescription>
                </>
              )}
              
              {mode === 'signup' && (
                <>
                  <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Join Us
                  </CardTitle>
                  <CardDescription className="text-white/70 text-lg">
                    Create your account and get started
                  </CardDescription>
                </>
              )}
              
              {mode === 'reset' && (
                <>
                  <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-white/70 text-lg">
                    We'll send you a reset link
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Sign In Form */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white/90 font-medium">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white/90 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 pr-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/70 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>

                  <div className="text-center space-y-3">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('reset')}
                      className="text-white/70 hover:text-white underline-offset-4"
                    >
                      Forgot your password?
                    </Button>
                    
                    <div className="text-white/70">
                      Don't have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('signup')}
                        className="text-cyan-400 hover:text-cyan-300 underline-offset-4 p-0 h-auto font-semibold"
                      >
                        Sign up
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Sign Up Form */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-white/90 font-medium">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your name"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-white/90 font-medium">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Username"
                        value={signUpForm.username}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white/90 font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white/90 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 pr-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/70 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.password && signUpForm.password.length < 6 && (
                      <p className="text-sm text-red-400">Password must be at least 6 characters</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-white/90 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 pr-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/70 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.confirmPassword && signUpForm.password !== signUpForm.confirmPassword && (
                      <p className="text-sm text-red-400">Passwords do not match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || signUpForm.password !== signUpForm.confirmPassword || signUpForm.password.length < 6}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>

                  <div className="text-center">
                    <div className="text-white/70">
                      Already have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('signin')}
                        className="text-pink-400 hover:text-pink-300 underline-offset-4 p-0 h-auto font-semibold"
                      >
                        Sign in
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Reset Password Form */}
              {mode === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-white/90 font-medium">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetForm.email}
                      onChange={(e) => setResetForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl h-12 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('signin')}
                      className="text-white/70 hover:text-white underline-offset-4"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}