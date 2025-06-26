"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabaseBrowser } from '@/lib/supabase'
import { Heart, Users, Sparkles, ArrowRight, ArrowLeft, Check, Compass, User } from 'lucide-react'
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
    <div className="min-h-screen bg-background relative">
      {/* Navigation-style header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#fec400]/40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight">Stan</span>
            <span className="text-sm text-muted-foreground">Setup</span>
          </div>
          
          {/* Progress indicators matching mobile nav style */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                  step >= stepNum 
                    ? "bg-[#fec400] text-black" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content with proper padding for fixed header */}
      <div className="pt-20 pb-24 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          
          {/* Step 1: Welcome & Categories */}
          {step === 1 && (
            <div className="space-y-8">
              {/* Animated Welcome Text */}
              <div className="text-center space-y-4">
                <div className="h-16 flex items-center justify-center">
                  <div className={cn(
                    "transition-all duration-500 transform",
                    showWelcomeText ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  )}>
                    {showWelcomeText && (
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Welcome to <span className="text-[#fec400]">Stan</span>
                      </h1>
                    )}
                  </div>
                  
                  <div className={cn(
                    "transition-all duration-500 transform absolute",
                    showSecondText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    {showSecondText && (
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        What interests you?
                      </h1>
                    )}
                  </div>
                </div>
                
                <p className={cn(
                  "text-muted-foreground text-lg transition-all duration-700",
                  showSecondText ? "opacity-100" : "opacity-0"
                )}>
                  Choose a category to get started
                </p>
              </div>

              {/* Categories Grid */}
              <div className={cn(
                "transition-all duration-700 transform",
                showSecondText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category, index) => (
                    <Card 
                      key={category}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg border-border/50 hover:border-[#fec400]/40",
                        "animate-fade-in-up"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#fec400]/10 flex items-center justify-center">
                            <Compass className="w-6 h-6 text-[#fec400]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{category}</h3>
                            <p className="text-sm text-muted-foreground">Explore {category.toLowerCase()}</p>
                          </div>
                        </div>
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
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Choose your <span className="text-[#fec400]">favorites</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Select {selectedCategory.toLowerCase()} idols you want to follow
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {idols.map((idol, index) => (
                  <Card 
                    key={idol.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg",
                      selectedIdols.includes(idol.id) 
                        ? "border-[#fec400] bg-[#fec400]/5" 
                        : "border-border/50 hover:border-[#fec400]/40",
                      "animate-fade-in-up"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleIdolToggle(idol.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <img 
                            src={idol.image} 
                            alt={idol.name}
                            className="w-full aspect-square rounded-lg object-cover"
                          />
                          {selectedIdols.includes(idol.id) && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#fec400] rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-sm truncate">{idol.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {idol.stans.toLocaleString()} stans
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Find Friends */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Find your <span className="text-[#fec400]">community</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Connect with fans who share your interests
                </p>
              </div>

              {suggestedFriends.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {suggestedFriends.map((friend, index) => (
                    <Card 
                      key={friend.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-lg",
                        selectedFriends.includes(friend.id) 
                          ? "border-[#fec400] bg-[#fec400]/5" 
                          : "border-border/50 hover:border-[#fec400]/40",
                        "animate-fade-in-up"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleFriendToggle(friend.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="relative">
                            <img 
                              src={friend.avatar} 
                              alt={friend.name}
                              className="w-full aspect-square rounded-full object-cover"
                            />
                            {selectedFriends.includes(friend.id) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#fec400] rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-black" />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-sm truncate">{friend.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">
                              @{friend.username}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No suggested friends found. You can always find friends later!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation-style controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-[#fec400]/40">
        <div className="flex items-center justify-between px-4 py-4">
          {step > 1 ? (
            <Button 
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button 
              onClick={step === 1 ? undefined : handleNext}
              disabled={step === 2 && selectedIdols.length === 0}
              variant={step === 1 ? "ghost" : "default"}
              size="sm"
              className={cn(
                "flex items-center gap-2",
                step !== 1 && "bg-[#fec400] hover:bg-[#fec400]/90 text-black"
              )}
            >
              {step === 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={loading}
              size="sm"
              className="bg-[#fec400] hover:bg-[#fec400]/90 text-black flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
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