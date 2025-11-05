// src/App.tsx
import { useState, useEffect } from 'react'
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
  const [booting, setBooting] = useState(true)
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

  // --- Boot: process Supabase auth (including OAuth hash) and local storage
  useEffect(() => {
    ;(async () => {
      try {
        // 1) Process session (this also consumes the #access_token hash)
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) console.error('[auth.getSession] error:', error)

        // 2) Load any persisted profile (interests, onboarding flag, etc.)
        let persisted: UserData | null = null
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) persisted = JSON.parse(raw)
        } catch {}

        if (session?.user) {
          const email = session.user.email || ''
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            (email ? email.split('@')[0] : '')

          // merge auth info with persisted profile (if any)
          const merged: UserData = {
            userType: persisted?.userType || '',
            interests: persisted?.interests || [],
            locationEnabled: persisted?.locationEnabled || false,
            email,
            name,
            authMethod: (persisted?.authMethod ?? 'google') as 'google' | 'apple' | 'email',
            hasCompletedOnboarding: Boolean(persisted?.hasCompletedOnboarding),
          }
          setUserData(merged)

          // route depending on onboarding
          setCurrentScreen(merged.hasCompletedOnboarding ? 'home' : 'onboarding')
        } else {
          // no session: if they had a completed profile we can keep them logged out on splash
          setCurrentScreen('splash')
        }

        // 3) Clean the URL (remove the OAuth hash) to avoid blank screens and reload quirks
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState({}, '', window.location.origin + window.location.pathname)
        }
      } finally {
        setBooting(false)
      }
    })()
  }, [])

  // Keep localStorage in sync when we *have* an email (i.e., logged in)
  useEffect(() => {
    if (userData.email) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      } catch {}
    }
  }, [userData])

  // React to auth changes (e.g., when returning from Google redirect)
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || ''
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          (email ? email.split('@')[0] : '')

        setUserData(prev => ({
          ...prev,
          email,
          name,
          authMethod: (prev.authMethod ?? 'google') as 'google' | 'apple' | 'email',
        }))

        // decide where to go based on persisted onboarding
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          const persisted = raw ? JSON.parse(raw) : null
          const onboarded = Boolean(persisted?.hasCompletedOnboarding)
          setCurrentScreen(onboarded ? 'home' : 'onboarding')
        } catch {
          setCurrentScreen('onboarding')
        }

        // Clean hash if still present
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState({}, '', window.location.origin + window.location.pathname)
        }
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // ---- UI helpers ----
  const handleGetStarted = () => {
    setLoginMode('signup')
    setCurrentScreen('login')
  }
  const handleShowLogin = () => {
    setLoginMode('login')
    setCurrentScreen('login')
  }
  const handleGoogleFromSplash = () => {
    setLoginMode('signup') // or 'login'—either is fine; the button on Login will start OAuth
    setCurrentScreen('login')
  }

  const handleLogin = (authData: { email: string; name: string; authMethod: 'google' | 'apple' | 'email'; isLogin: boolean }) => {
    // This path is mainly for email/password; Google uses redirect & onAuthStateChange
    const raw = localStorage.getItem(STORAGE_KEY)
    let persisted: UserData | null = null
    try { if (raw) persisted = JSON.parse(raw) } catch {}

    if (authData.isLogin && persisted && persisted.email === authData.email && persisted.hasCompletedOnboarding) {
      setUserData(persisted)
      setCurrentScreen('home')
      return
    }

    setUserData(prev => ({
      ...prev,
      email: authData.email,
      name: authData.name,
      authMethod: authData.authMethod,
      hasCompletedOnboarding: false,
    }))
    setCurrentScreen('onboarding')
  }

  const handleOnboardingComplete = (data: Omit<UserData, 'email' | 'name' | 'authMethod' | 'hasCompletedOnboarding'>) => {
    setUserData(prev => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true,
    }))
    setCurrentScreen('home')
  }

  const handleLogout = () => {
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

  if (booting) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading…</p>
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
          onGoogle={handleGoogleFromSplash}
          showApple={false}
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} onBack={() => setCurrentScreen('splash')} mode={loginMode} />
      )}

      {currentScreen === 'onboarding' && <OnboardingFlow onComplete={handleOnboardingComplete} />}

      {currentScreen === 'home' && (
        <HomeScreen
          onCommunitySelect={id => { setSelectedCommunityId(id); setCurrentScreen('community') }}
          onProfileClick={() => setCurrentScreen('profile')}
          onDashboardClick={() => setCurrentScreen('dashboard')}
          onActivityClick={() => setCurrentScreen('activity')}
          userType={userData.userType}
          userInterests={userData.interests}
        />
      )}

      {currentScreen === 'community' && (
        <CommunityPage
          communityId={selectedCommunityId}
          onBack={() => setCurrentScreen('home')}
          onEventSelect={id => { setSelectedEventId(id); setCurrentScreen('event') }}
        />
      )}

      {currentScreen === 'event' && <EventDetail eventId={selectedEventId} onBack={() => setCurrentScreen('community')} />}

      {currentScreen === 'dashboard' && <OrganizerDashboard onBack={() => setCurrentScreen('home')} />}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onBack={() => setCurrentScreen('home')}
          userType={userData.userType}
          userEmail={userData.email}
          userName={userData.name}
          authMethod={userData.authMethod}
          currentInterests={userData.interests}
          onUpdateInterests={ints => setUserData(prev => ({ ...prev, interests: ints }))}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'activity' && (
        <MyActivityScreen
          onBack={() => setCurrentScreen('home')}
          onCommunitySelect={id => { setSelectedCommunityId(id); setCurrentScreen('community') }}
        />
      )}
    </div>
  )
}
import { supabase } from './lib/supabase';

useEffect(() => {
  (async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email || '';
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          (email ? email.split('@')[0] : '');

        setUserData(prev => {
          const merged = {
            ...prev,
            email,
            name,
            authMethod: (prev.authMethod ?? 'google') as 'google' | 'apple' | 'email',
          };
          return merged;
        });

        // If you want to force onboarding for new users:
        const stored = localStorage.getItem('fitclub_user_data');
        const hasOnboarded = stored ? JSON.parse(stored).hasCompletedOnboarding : false;

        setCurrentScreen(hasOnboarded ? 'home' : 'onboarding');
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  })();
}, []);
