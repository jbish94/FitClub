import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { HomeScreen } from './components/HomeScreen';
import { CommunityPage } from './components/CommunityPage';
import { EventDetail } from './components/EventDetail';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { MyActivityScreen } from './components/MyActivityScreen';

type Screen =
  | 'splash'
  | 'login'
  | 'onboarding'
  | 'home'
  | 'community'
  | 'event'
  | 'dashboard'
  | 'profile'
  | 'activity';

interface UserData {
  userType: string;
  interests: string[];
  locationEnabled: boolean;
  email?: string;
  name?: string;
  authMethod?: 'google' | 'apple' | 'email';
  hasCompletedOnboarding?: boolean;
}

const STORAGE_KEY = 'fitclub_user_data';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('signup');
  const [isLoading, setIsLoading] = useState(true);
  const [autoGoogle, setAutoGoogle] = useState(false); // ⬅️ NEW
  const [userData, setUserData] = useState<UserData>({
    userType: '',
    interests: [],
    locationEnabled: false,
    email: '',
    name: '',
    authMethod: undefined,
    hasCompletedOnboarding: false
  });
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserData;
        setUserData(parsed);
        if (parsed.email && parsed.hasCompletedOnboarding) {
          setCurrentScreen('home');
        } else if (parsed.email && !parsed.hasCompletedOnboarding) {
          setCurrentScreen('onboarding');
        } else {
          setCurrentScreen('splash');
        }
      } else {
        setCurrentScreen('splash');
      }
    } catch {
      setCurrentScreen('splash');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {}
  }, [userData]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Splash actions
  const handleGetStarted = () => {
    setLoginMode('signup');
    setAutoGoogle(false);
    setCurrentScreen('login');
  };

  const handleShowLogin = () => {
    setLoginMode('login');
    setAutoGoogle(false);
    setCurrentScreen('login');
  };

  // ⬅️ NEW: Splash → Google OAuth path (via Login)
  const handleGoogleFromSplash = () => {
    setLoginMode('login');   // mode label only; OAuth handles new/returning
    setAutoGoogle(true);     // tell LoginScreen to auto-run Google
    setCurrentScreen('login');
  };

  // Auth completion
  const handleLogin = (authData: {
    email: string;
    name: string;
    authMethod: 'google' | 'apple' | 'email';
    isLogin: boolean;
  }) => {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let returning = false;
    let existing: UserData | null = null;

    if (existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw) as UserData;
        if (authData.isLogin || (parsed.email === authData.email && parsed.hasCompletedOnboarding)) {
          returning = true;
          existing = parsed;
        }
      } catch {}
    }

    if (returning && existing) {
      setUserData(existing);
      setCurrentScreen('home');
    } else {
      setUserData(prev => ({
        ...prev,
        email: authData.email,
        name: authData.name,
        authMethod: authData.authMethod,
        hasCompletedOnboarding: false
      }));
      setCurrentScreen('onboarding');
    }
  };

  const handleBackToSplash = () => setCurrentScreen('splash');

  const handleOnboardingComplete = (
    data: Omit<UserData, 'email' | 'name' | 'authMethod' | 'hasCompletedOnboarding'>
  ) => {
    setUserData(prev => ({ ...prev, ...data, hasCompletedOnboarding: true }));
    setCurrentScreen('home');
  };

  const handleUpdateInterests = (interests: string[]) =>
    setUserData(prev => ({ ...prev, interests }));

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData({
      userType: '',
      interests: [],
      locationEnabled: false,
      email: '',
      name: '',
      authMethod: undefined,
      hasCompletedOnboarding: false
    });
    setCurrentScreen('splash');
  };

  const handleCommunitySelect = (id: string) => {
    setSelectedCommunityId(id);
    setCurrentScreen('community');
  };

  const handleEventSelect = (id: string) => {
    setSelectedEventId(id);
    setCurrentScreen('event');
  };

  const handleBackToHome = () => setCurrentScreen('home');
  const handleBackToCommunity = () => setCurrentScreen('community');
  const handleProfileClick = () => setCurrentScreen('profile');
  const handleDashboardClick = () => setCurrentScreen('dashboard');
  const handleActivityClick = () => setCurrentScreen('activity');

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {currentScreen === 'splash' && (
        <SplashScreen
          onGetStarted={handleGetStarted}
          onLogin={handleShowLogin}
          onGoogleSignIn={handleGoogleFromSplash} // ⬅️ NEW
          // showApple={false}  // keep hidden for now
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onBack={handleBackToSplash}
          mode={loginMode}
          autoGoogle={autoGoogle}                    // ⬅️ NEW
          onAutoGoogleHandled={() => setAutoGoogle(false)} // ⬅️ NEW
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
  );
}
