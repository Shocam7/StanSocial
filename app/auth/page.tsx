"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/hooks/use-auth'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
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
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      // Check if user has any stanned idols
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
      router.push('/')
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await signIn(signInForm.email, signInForm.password)
    
    if (success) {
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
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-foreground/60 hover:text-foreground hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Auth Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-[#fec400] rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl font-black text-black">
                  Stan
                </span>
              </div>
              
              {mode === 'signin' && (
                <>
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
                    Sign in to continue your journey
                  </CardDescription>
                </>
              )}
              
              {mode === 'signup' && (
                <>
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Join Stan
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
                    Create your account and get started
                  </CardDescription>
                </>
              )}
              
              {mode === 'reset' && (
                <>
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
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
                    <Label htmlFor="signin-email" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-foreground font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="h-12 rounded-xl pr-12 border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#fec400] hover:bg-[#fec400]/90 text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>

                  <div className="text-center space-y-3">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('reset')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Forgot your password?
                    </Button>
                    
                    <div className="text-muted-foreground">
                      Don't have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('signup')}
                        className="text-[#fec400] hover:text-[#fec400]/80 p-0 h-auto font-semibold"
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
                      <Label htmlFor="signup-name" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your name"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="h-12 rounded-xl border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-foreground font-medium">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Username"
                        value={signUpForm.username}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                        required
                        className="h-12 rounded-xl border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                        className="h-12 rounded-xl pr-12 border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.password && signUpForm.password.length < 6 && (
                      <p className="text-sm text-destructive">Password must be at least 6 characters</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-foreground font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="h-12 rounded-xl pr-12 border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.confirmPassword && signUpForm.password !== signUpForm.confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || signUpForm.password !== signUpForm.confirmPassword || signUpForm.password.length < 6}
                    className="w-full h-12 bg-[#fec400] hover:bg-[#fec400]/90 text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>

                  <div className="text-center">
                    <div className="text-muted-foreground">
                      Already have an account?{' '}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setMode('signin')}
                        className="text-[#fec400] hover:text-[#fec400]/80 p-0 h-auto font-semibold"
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
                    <Label htmlFor="reset-email" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetForm.email}
                      onChange={(e) => setResetForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-border/50 focus:border-[#fec400] focus:ring-[#fec400]/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#fec400] hover:bg-[#fec400]/90 text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setMode('signin')}
                      className="text-muted-foreground hover:text-foreground"
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
