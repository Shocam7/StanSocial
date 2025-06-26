"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabaseBrowser } from '@/lib/supabase'
import { Heart, Users, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingFlowProps {
  onComplete: (data: {
    interests: string[]
    idols: string[]
    friends: string[]
  }) => void
  loading: boolean
}

interface Idol {
  id: string
  name: string
  image: string
  category: string
  stans: number
}

interface User {
  id: string
  name: string
  username: string
  avatar: string
}

export default function OnboardingFlow({ onComplete, loading }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [showWelcomeText, setShowWelcomeText] = useState(true)
  const [showSecondText, setShowSecondText] = useState(false)
  
  // Data states
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [idols, setIdols] = useState<Idol[]>([])
  const [selectedIdols, setSelectedIdols] = useState<string[]>([])
  const [suggestedFriends, setSuggestedFriends] = useState<User[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

  const supabase = getSupabaseBrowser()

  // Animate welcome text
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowWelcomeText(false)
      setShowSecondText(true)
    }, 1000)

    return () => clearTimeout(timer1)
  }, [])

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Load idols when category is selected
  useEffect(() => {
    if (selectedCategory) {
      loadIdols(selectedCategory)
    }
  }, [selectedCategory])

  // Load suggested friends when idols are selected
  useEffect(() => {
    if (selectedIdols.length > 0) {
      loadSuggestedFriends()
    }
  }, [selectedIdols])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('idols')
        .select('category')
        .order('category')

      if (error) throw error

      const uniqueCategories = [...new Set(data.map(item => item.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadIdols = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('idols')
        .select('*')
        .eq('category', category)
        .order('stans', { ascending: false })

      if (error) throw error
      setIdols(data || [])
    } catch (error) {
      console.error('Error loading idols:', error)
    }
  }

  const loadSuggestedFriends = async () => {
    try {
      // Get users who stan the same idols
      const { data, error } = await supabase
        .from('user_stanned_idols')
        .select(`
          user_id,
          users (
            id,
            name,
            username,
            avatar
          )
        `)
        .in('idol_id', selectedIdols)

      if (error) throw error

      // Extract unique users and flatten the structure
      const userMap = new Map()
      data?.forEach(item => {
        if (item.users && !userMap.has(item.users.id)) {
          userMap.set(item.users.id, item.users)
        }
      })

      setSuggestedFriends(Array.from(userMap.values()).slice(0, 12))
    } catch (error) {
      console.error('Error loading suggested friends:', error)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setTimeout(() => setStep(2), 300)
  }

  const handleIdolToggle = (idolId: string) => {
    setSelectedIdols(prev => 
      prev.includes(idolId) 
        ? prev.filter(id => id !== idolId)
        : [...prev, idolId]
    )
  }

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const handleNext = () => {
    if (step === 2) {
      setStep(3)
    }
  }

  const handleComplete = () => {
    onComplete({
      interests: [selectedCategory],
      idols: selectedIdols,
      friends: selectedFriends
    })
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setSelectedCategory('')
      setIdols([])
    } else if (step === 3) {
      setStep(2)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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
              <Sparkles className="w-3 h-3 text-white/10" />
            </div>
          ))}
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                    step >= stepNum 
                      ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white" 
                      : "bg-white/20 text-white/60"
                  )}>
                    {step > stepNum ? <Check className="w-5 h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={cn(
                      "w-16 h-1 mx-2 transition-all duration-300",
                      step > stepNum ? "bg-gradient-to-r from-pink-500 to-violet-500" : "bg-white/20"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Welcome & Categories */}
          {step === 1 && (
            <div className="text-center space-y-8">
              {/* Animated Welcome Text */}
              <div className="h-24 flex items-center justify-center">
                <div className={cn(
                  "transition-all duration-500 transform",
                  showWelcomeText ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                )}>
                  {showWelcomeText && (
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                      Welcome, Stan
                    </h1>
                  )}
                </div>
                
                <div className={cn(
                  "transition-all duration-500 transform absolute",
                  showSecondText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  {showSecondText && (
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      What do you love?
                    </h1>
                  )}
                </div>
              </div>

              {/* Categories Grid */}
              <div className={cn(
                "transition-all duration-700 transform",
                showSecondText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {categories.map((category, index) => (
                    <Card 
                      key={category}
                      className={cn(
                        "backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl",
                        "animate-fade-in-up"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-3">
                          <Heart className="w-8 h-8 mx-auto text-pink-400" />
                        </div>
                        <h3 className="text-white font-semibold text-lg">
                          {category}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Idols */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-4">
                  Who do you love?
                </h1>
                <p className="text-white/70 text-lg">
                  Select your favorite {selectedCategory.toLowerCase()} idols
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {idols.map((idol, index) => (
                  <Card 
                    key={idol.id}
                    className={cn(
                      "backdrop-blur-xl border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105",
                      selectedIdols.includes(idol.id) 
                        ? "bg-gradient-to-r from-pink-500/30 to-violet-500/30 border-pink-400/50" 
                        : "bg-white/10 hover:bg-white/20",
                      "animate-fade-in-up"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleIdolToggle(idol.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="relative mb-3">
                        <img 
                          src={idol.image} 
                          alt={idol.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                        {selectedIdols.includes(idol.id) && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {idol.name}
                      </h3>
                      <p className="text-white/60 text-xs">
                        {idol.stans.toLocaleString()} stans
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleBack}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={selectedIdols.length === 0}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-8"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Find Friends */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Friends just like you
                </h1>
                <p className="text-white/70 text-lg">
                  Connect with other fans who love the same idols
                </p>
              </div>

              {suggestedFriends.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {suggestedFriends.map((friend, index) => (
                    <Card 
                      key={friend.id}
                      className={cn(
                        "backdrop-blur-xl border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105",
                        selectedFriends.includes(friend.id) 
                          ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400/50" 
                          : "bg-white/10 hover:bg-white/20",
                        "animate-fade-in-up"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleFriendToggle(friend.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="relative mb-3">
                          <img 
                            src={friend.avatar} 
                            alt={friend.name}
                            className="w-16 h-16 rounded-full mx-auto object-cover"
                          />
                          {selectedFriends.includes(friend.id) && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {friend.name}
                        </h3>
                        <p className="text-white/60 text-xs">
                          @{friend.username}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">
                    No suggested friends found. You can always find friends later!
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button 
                  onClick={handleBack}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <Button 
                  onClick={handleComplete}
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8"
                >
                  {loading ? "Setting up..." : "Complete Setup"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}