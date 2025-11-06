import { MapPin } from 'lucide-react';
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
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back 👋</h1>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {userLocation?.city
                  ? `${userLocation.city}${userLocation.state ? ', ' + userLocation.state : ''}`
                  : userLocation?.lat && userLocation?.lng
                    ? `(${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)})`
                    : 'Location unavailable'}
              </span>
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

          <Button
            variant="outline"
            className="rounded-full px-4 py-2 text-sm"
            onClick={onProfileClick}
          >
            Profile
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Interests</h2>
          {userInterests.length > 0 ? (
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

      {/* Footer nav */}
      <div className="p-4 border-t border-gray-200 flex justify-around bg-white">
        <button onClick={onActivityClick} className="text-sm text-gray-600 hover:text-[#0066FF]">
          My Activity
        </button>
        {userType === 'organizer' && (
          <button onClick={onDashboardClick} className="text-sm text-gray-600 hover:text-[#0066FF]">
            Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
