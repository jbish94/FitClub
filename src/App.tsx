import { useEffect, useState } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { LoginScreen } from './components/LoginScreen'
import { OnboardingFlow } from './components/OnboardingFlow'
import { HomeScreen } from './components/HomeScreen'
import { CommunityPage } from './components/CommunityPage'
import { EventDetail } from './components/EventDetail'
import { OrganizerDashboard } from './components/OrganizerDashboard'
import { ProfileScreen } from './components/ProfileScreen'
import { MyActivityScreen } from './components/MyActivityScreen'
import { supabase } from './lib/supabase'

type Screen =
  | 'splash'
  | 'login'
  | 'onboarding'
  | 'home'
  | 'community'
  | 'event'
  | 'dashboard'
  | 'profile'
  | 'activity'

interface UserData {
  userType: string
  interests: string[]
  locationEnabled: boolean
  email?: string
  name?: string
  authMethod?: 'google' | 'apple' | 'email'
  hasCompletedOnboarding?: boolean
}

const STORAGE_KEY = 'fitclub_user_data'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash')
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('signup')
  const [isLoading, setIsLoading] = useState(true)
  const [autoGoogle, setAutoGoogle] = useState(false)

  const [userData, setUserData] = useState<UserData>({
    userType: '',
    interests: [],
    locationEnabled: false,
    email: '',
    name: '',
    authMethod: undefined,
    hasCompletedOnboarding: false,
  })

  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('')
  const [selectedEventId, setSelectedEventId] = useState<string>('')

  // 1) Load any saved user data (pre-OAuth email flow) AND restore Supabase session after OAuth
  useEffect(() => {
    (async () => {
      try {
        // Restore previously saved FitClub preference data if present
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setUserData(parsed)
        }

        // Check Supabase session (after OAuth redirect this will be set)
        const { data } = await supabase.auth.getSession()
        const session = data.session

        if (session?.user) {
          // We have an authenticated user
          const u = session.user
          const displayName =
            (u.user_metadata?.full_name as string) ||
            (u.user_metadata?.name as string) ||
            (u.email?.split('@')[0] ?? '')

          // If we have a completed profile saved, go straight home
          const saved = stored ? JSON.parse(stored) : null
          if (saved?.hasCompletedOnboarding) {
            setUserData({
              ...saved,
              email: u.email ?? saved.email,
              name: displayName || saved.name,
              authMethod: 'google',
            })
            setCurrentScreen('home')
          } else {
            // New OAuth user or incomplete profile — go to onboarding
            setUserData(prev => ({
              ...prev,
              email: u.email ?? prev.email,
              name: displayName || prev.name,
              authMethod: 'google',
              hasCompletedOnboarding: false,
            }))
            setCurrentScreen('onboarding')
          }
        } else {
          // No session; if we had saved data + completed onboarding, send to home
          const saved = stored ? JSON.parse(stored) : null
          if (saved?.email && saved?.hasCompletedOnboarding) {
            setCurrentScreen('home')
          } else {
            setCurrentScreen('splash')
          }
        }
      } catch (e) {
        console.error('Init error:', e)
        setCurrentScreen('splash')
      } finally {
        setIsLoading(false)
      }
    })()

    // Also react to auth changes while app is open
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user
        const displayName =
          (u.user_metadata?.full_name as string) ||
          (u.user_metadata?.name as string) ||
          (u.email?.split('@')[0] ?? '')

        setUserData(prev => ({
          ...prev,
          email: u.email ?? prev.email,
          name: displayName || prev.name,
          authMethod: 'google',
        }))
        // If they just logged in and don’t have prefs, send to onboarding
        const saved = localStorage.getItem(STORAGE_KEY)
        const parsed = saved ? JSON.parse(saved) : null
        setCurrentScreen(parsed?.hasCompletedOnboarding ? 'home' : 'onboarding')
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  // 2) Persist userData when it has an email (your original behavior)
  useEffect(() => {
    if (userData.email) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      } catch (e) {
        console.error('Error saving user data:', e)
      }
    }
  }, [userData])

  // ----- Navigation handlers ----- //
  const handleGetStarted = () => {
    setLoginMode('signup')
    setCurrentScreen('login')
  }
  const handleShowLogin = () => {
    setLoginMode('login')
    setCurrentScreen('login')
  }

  // Start Google from Splash (auto-trigger in LoginScreen)
  const handleSplashGoogle = () => {
    setLoginMode('signup')
    setAutoGoogle(true)
    setCurrentScreen('login')
  }

  const handleLoginComplete = (authData: {
    email: string
    name: string
    authMethod: 'google' | 'apple' | 'email'
    isLogin: boolean
  }) => {
    const existingData = localStorage.getItem(STORAGE_KEY)
    let isReturning = false
    let existingUserData = null as any

    if (existingData) {
      try {
        const parsed = JSON.parse(existingData)
        if (authData.isLogin || (parsed.email === authData.email && parsed.hasCompletedOnboarding)) {
          isReturning = true
          existingUserData = parsed
        }
      } catch (e) {
        console.error('Error checking existing user:', e)
      }
    }

    if (isReturning && existingUserData) {
      setUserData(existingUserData)
      setCurrentScreen('home')
    } else {
      setUserData(prev => ({
        ...prev,
        email: authData.email,
        name: authData.name,
        authMethod: authData.authMethod,
        hasCompletedOnboarding: false,
      }))
      setCurrentScreen('onboarding')
    }
  }

  const handleBackToSplash = () => setCurrentScreen('splash')

  const handleOnboardingComplete = (
    data: Omit<UserData, 'email' | 'name' | 'authMethod' | 'hasCompletedOnboarding'>
  ) => {
    setUserData(prev => ({ ...prev, ...data, hasCompletedOnboarding: true }))
    setCurrentScreen('home')
  }

  const handleUpdateInterests = (newInterests: string[]) =>
    setUserData(prev => ({ ...prev, interests: newInterests }))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem(STORAGE_KEY)
    setUserData({
      userType: '',
      interests: [],
      locationEnabled: false,
      email: '',
      name: '',
      authMethod: undefined,
      hasCompletedOnboarding: false,
    })
    setCurrentScreen('splash')
  }

  const handleCommunitySelect = (id: string) => {
    setSelectedCommunityId(id)
    setCurrentScreen('community')
  }
  const handleEventSelect = (id: string) => {
    setSelectedEventId(id)
    setCurrentScreen('event')
  }
  const handleBackToHome = () => setCurrentScreen('home')
  const handleBackToCommunity = () => setCurrentScreen('community')
  const handleProfileClick = () => setCurrentScreen('profile')
  const handleDashboardClick = () => setCurrentScreen('dashboard')
  const handleActivityClick = () => setCurrentScreen('activity')

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {currentScreen === 'splash' && (
        <SplashScreen
          onGetStarted={handleGetStarted}
          onLogin={handleShowLogin}
          onGoogleSignIn={handleSplashGoogle} // <— wire Google from Splash
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLoginComplete}
          onBack={handleBackToSplash}
          mode={loginMode}
          autoGoogle={autoGoogle}
          onAutoGoogleHandled={() => setAutoGoogle(false)}
        />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onCommunitySelect={handleCommunitySelect}
          onProfileClick={handleProfileClick}
          onDashboardClick={handleDashboardClick}
          onActivityClick={handleActivityClick}
          userType={userData.userType}
          userInterests={userData.interests}
        />
      )}

      {currentScreen === 'community' && (
        <CommunityPage
          communityId={selectedCommunityId}
          onBack={handleBackToHome}
          onEventSelect={handleEventSelect}
        />
      )}

      {currentScreen === 'event' && (
        <EventDetail eventId={selectedEventId} onBack={handleBackToCommunity} />
      )}

      {currentScreen === 'dashboard' && <OrganizerDashboard onBack={handleBackToHome} />}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onBack={handleBackToHome}
          userType={userData.userType}
          userEmail={userData.email}
          userName={userData.name}
          authMethod={userData.authMethod}
          currentInterests={userData.interests}
          onUpdateInterests={handleUpdateInterests}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'activity' && (
        <MyActivityScreen onBack={handleBackToHome} onCommunitySelect={handleCommunitySelect} />
      )}
    </div>
  )
}
// near the top of App.tsx
type UserLocation = {
  lat?: number;
  lng?: number;
  accuracy?: number;
  city?: string;
  state?: string;
};

interface UserData {
  userType: string;
  interests: string[];
  locationEnabled: boolean;
  email?: string;
  name?: string;
  authMethod?: 'google' | 'apple' | 'email';
  hasCompletedOnboarding?: boolean;
  userLocation?: UserLocation;   // <-- add this
}
// inside App component, before the return:
const saveUserLocation = (loc: UserLocation) => {
  setUserData(prev => {
    const next = { ...prev, userLocation: loc, locationEnabled: true };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    return next;
  });
};
