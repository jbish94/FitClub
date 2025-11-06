// src/App.tsx
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

// ✅ Location helpers
import {
  getBrowserLocation,
  reverseGeocode,
  saveUserLocation,
  loadUserLocation,
  type UserLocation,
} from './lib/location';

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
  const [userData, setUserData] = useState<UserData>({
    userType: '',
    interests: [],
    locationEnabled: false,
    email: '',
    name: '',
    authMethod: undefined,
    hasCompletedOnboarding: false,
  });
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // ✅ location state (shown on HomeScreen header)
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>(undefined);

  // Load user data & saved location on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        if (parsedData.email && parsedData.hasCompletedOnboarding) {
          setCurrentScreen('home');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }

    try {
      const saved = loadUserLocation();
      if (saved) setUserLocation(saved);
    } catch {}
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData.email) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  }, [userData]);

  // Show loading screen while checking auth
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

  const handleGetStarted = () => {
    setLoginMode('signup');
    setCurrentScreen('login');
  };

  const handleShowLogin = () => {
    setLoginMode('login');
    setCurrentScreen('login');
  };

  /**
   * Handles login/signup completion from LoginScreen.
   *
   * Flow:
   * 1. Check localStorage for existing user data with same email
   * 2. If isLogin=true OR existing data found with hasCompletedOnboarding=true:
   *    - Restore full user profile (userType, interests, location, etc.)
   *    - Skip onboarding, go directly to home
   * 3. If new user (no existing data or incomplete onboarding):
   *    - Set basic auth info
   *    - Navigate to 3-step onboarding flow
   */
  const handleLogin = (authData: {
    email: string;
    name: string;
    authMethod: 'google' | 'apple' | 'email';
    isLogin: boolean;
  }) => {
    const existingData = localStorage.getItem(STORAGE_KEY);
    let isReturningUser = false;
    let existingUserData: UserData | null = null;

    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        if (authData.isLogin || (parsedData.email === authData.email && parsedData.hasCompletedOnboarding)) {
          isReturningUser = true;
          existingUserData = parsedData;
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
      }
    }

    if (isReturningUser && existingUserData) {
      setUserData(existingUserData);
      setCurrentScreen('home');
    } else {
      setUserData((prev) => ({
        ...prev,
        email: authData.email,
        name: authData.name,
        authMethod: authData.authMethod,
        hasCompletedOnboarding: false,
      }));
      setCurrentScreen('onboarding');
    }
  };

  const handleBackToSplash = () => {
    setCurrentScreen('splash');
  };

  const handleOnboardingComplete = (data: Omit<UserData, 'email' | 'name' | 'authMethod' | 'hasCompletedOnboarding'>) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
      hasCompletedOnboarding: true,
    }));
    setCurrentScreen('home');
  };

  const handleUpdateInterests = (newInterests: string[]) => {
    setUserData((prev) => ({
      ...prev,
      interests: newInterests,
    }));
  };

  const handleLogout = () => {
    // Clear user data and return to splash
    localStorage.removeItem(STORAGE_KEY);
    setUserData({
      userType: '',
      interests: [],
      locationEnabled: false,
      email: '',
      name: '',
      authMethod: undefined,
      hasCompletedOnboarding: false,
    });
    setCurrentScreen('splash');
  };

  const handleCommunitySelect = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setCurrentScreen('community');
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentScreen('event');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleBackToCommunity = () => {
    setCurrentScreen('community');
  };

  const handleProfileClick = () => {
    setCurrentScreen('profile');
  };

  const handleDashboardClick = () => {
    setCurrentScreen('dashboard');
  };

  const handleActivityClick = () => {
    setCurrentScreen('activity');
  };

  // ✅ Refresh location handler (passed to HomeScreen)
  const handleRefreshLocation = async () => {
    try {
      const coords = await getBrowserLocation();
      let place: { city?: string; state?: string; country?: string } = {};
      try {
        place = await reverseGeocode(coords);
      } catch {
        // fine to fail silently; coords will still show
      }
      const merged: UserLocation = { ...coords, ...place };
      saveUserLocation(merged);
      setUserLocation(merged);
    } catch (err: any) {
      alert(err?.message || 'Unable to retrieve location.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {currentScreen === 'splash' && (
        <SplashScreen onGetStarted={handleGetStarted} onLogin={handleShowLogin} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} onBack={handleBackToSplash} mode={loginMode} />
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
          userLocation={userLocation}               // <-- shows in header
          onRefreshLocation={handleRefreshLocation} // <-- "Refresh" link
        />
      )}

      {currentScreen === 'community' && (
        <CommunityPage communityId={selectedCommunityId} onBack={handleBackToHome} onEventSelect={handleEventSelect} />
      )}

      {currentScreen === 'event' && (
        <EventDetail eventId={selectedEventId} onBack={handleBackToCommunity} />
      )}

      {currentScreen === 'dashboard' && (
        <OrganizerDashboard onBack={handleBackToHome} />
      )}

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
