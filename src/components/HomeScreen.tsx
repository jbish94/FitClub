// src/components/HomeScreen.tsx
import { MapPin, Home, Activity, User } from 'lucide-react'

type UserLocation = {
  city?: string
  state?: string
  lat?: number
  lng?: number
}

interface HomeScreenProps {
  onCommunitySelect: (communityId: string) => void
  onProfileClick: () => void
  onDashboardClick?: () => void   // kept for future use
  onActivityClick?: () => void
  userType: string
  userInterests?: string[]
  userLocation?: UserLocation
  onRefreshLocation?: () => void
}

/** --- MOCK DATA (prototype) --- */
type MockCommunity = {
  id: string
  name: string
  subtitle: string
}

const MOCK_COMMUNITIES: MockCommunity[] = [
  {
    id: '1',
    name: 'Sunrise Runners',
    subtitle: 'Morning runs & new routes'
  },
  {
    id: '2',
    name: 'Zen Flow Yoga',
    subtitle: 'Weekly classes nearby'
  },
  {
    id: '3',
    name: 'Outdoor HIIT Warriors',
    subtitle: 'High-intensity outdoor workouts'
  },
  {
    id: '4',
    name: 'Pickleball League',
    subtitle: 'Casual and competitive play'
  }
]

export function HomeScreen({
  onCommunitySelect,
  onProfileClick,
  onActivityClick,
  userType,              // not used yet, but kept for future logic
  userInterests = [],
  userLocation,
  onRefreshLocation
}: HomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back 👋</h1>

        <div className="flex items-center gap-2 text-gray-600 mt-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {userLocation?.city
              ? `${userLocation.city}${
                  userLocation.state ? ', ' + userLocation.state : ''
                }`
              : 'Location unavailable'}
          </span>
          {onRefreshLocation && (
            <button
              onClick={onRefreshLocation}
              className="text-xs text-[#0066FF] hover:underline"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-6">
        {/* Interests */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Your Interests</h2>
          {userInterests.length ? (
            <div className="flex flex-wrap gap-2">
              {userInterests.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 text-[#0066FF] rounded-full text-sm"
                >
                  {i}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No interests selected yet.</p>
          )}
        </section>

        {/* Explore Communities (mock cards) */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Explore Communities</h2>
          <div className="grid grid-cols-2 gap-4">
            {MOCK_COMMUNITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onCommunitySelect(c.id)}
                className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium">{c.name}</div>
                <p className="text-xs text-gray-500 mt-1">{c.subtitle}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Tabs (Home / My Activity / Profile) */}
      <nav className="p-3 border-t border-gray-200 flex justify-around bg-white">
        <div className="flex flex-col items-center text-[#0066FF]">
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </div>

        <button
          onClick={onActivityClick}
          className="flex flex-col items-center text-gray-500 hover:text-[#0066FF]"
        >
          <Activity className="w-5 h-5" />
          <span className="text-xs mt-1">My Activity</span>
        </button>

        <button
          onClick={onProfileClick}
          className="flex flex-col items-center text-gray-500 hover:text-[#0066FF]"
        >
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default HomeScreen
