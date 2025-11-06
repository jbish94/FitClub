import { useState } from 'react';
import {
  MapPin,
  Home,
  User,
  LayoutDashboard,
  Activity,
} from 'lucide-react';
import { Button } from './ui/button';

interface HomeScreenProps {
  onCommunitySelect: (id: string) => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
  onActivityClick: () => void;
  userType: string;
  userInterests: string[];
  userLocation?: {
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
  };
  onRefreshLocation?: () => void;
}

export function HomeScreen({
  onCommunitySelect,
  onProfileClick,
  onDashboardClick,
  onActivityClick,
  userType,
  userInterests,
  userLocation,
  onRefreshLocation,
}: HomeScreenProps) {
  // local tab (like before)
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'activity' | 'profile'>('home');

  const displayLocation =
    userLocation?.city
      ? `${userLocation.city}${userLocation.state ? ', ' + userLocation.state : ''}`
      : userLocation?.lat && userLocation?.lng
      ? `(${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)})`
      : 'Location unavailable';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back 👋</h1>
        <div className="flex items-center gap-1 text-gray-600 mt-1">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{displayLocation}</span>
          {onRefreshLocation && (
            <button
              onClick={onRefreshLocation}
              className="ml-2 text-xs text-[#0066FF] hover:underline"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Interests</h2>
          {userInterests?.length ? (
            <div className="flex flex-wrap gap-2">
              {userInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-blue-50 text-[#0066FF] rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No interests selected yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Explore Communities</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onCommunitySelect('1')}
              className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100"
            >
              🧘 Yoga Lovers
              <p className="text-xs text-gray-500">Weekly classes nearby</p>
            </button>
            <button
              onClick={() => onCommunitySelect('2')}
              className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100"
            >
              🏃 Run Club
              <p className="text-xs text-gray-500">Weekend runs</p>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar – back to the original layout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'home' ? 'text-[#0066FF]' : 'text-gray-500'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>

        {userType === 'organizer' ? (
          <button
            onClick={() => {
              setActiveTab('dashboard');
              onDashboardClick();
            }}
            className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'dashboard' ? 'text-[#0066FF]' : 'text-gray-500'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveTab('activity');
              onActivityClick();
            }}
            className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'activity' ? 'text-[#0066FF]' : 'text-gray-500'}`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs">My Activity</span>
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab('profile');
            onProfileClick();
          }}
          className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'profile' ? 'text-[#0066FF]' : 'text-gray-500'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
