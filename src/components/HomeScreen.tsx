// src/components/HomeScreen.tsx
import React from 'react'
import { MapPin, Home, Activity, User } from 'lucide-react'
import { Button } from './ui/button'

type UserLocation = {
  city?: string
  state?: string
  lat?: number
  lng?: number
}

interface HomeScreenProps {
  onCommunitySelect: (id: string) => void
  onProfileClick: () => void
  onDashboardClick?: () => void          // unused for member view; kept for parity
  onActivityClick?: () => void
  userType: string
  userInterests: string[]
  userLocation?: UserLocation
  onRefreshLocation?: () => void
}

/** --- MOCK DATA (prototype) --- */
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Sunrise Runners',
    image: 'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '0.5 mi',
    members: 234,
    nextEvent: 'Tomorrow, 6:00 AM',
    activity: 'Running',
    price: 'Free'
  },
  {
    id: '2',
    name: 'Zen Flow Yoga',
    image: 'https://images.unsplash.com/photo-1758274525134-4b1e9cc67dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '1.2 mi',
    members: 189,
    nextEvent: 'Wed, 7:00 PM',
    activity: 'Yoga',
    price: '$15'
  },
  {
    id: '3',
    name: 'Outdoor HIIT Warriors',
    image: 'https://images.unsplash.com/photo-1758521959291-e1dd95419b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '2.1 mi',
    members: 156,
    nextEvent: 'Sat, 8:00 AM',
    activity: 'CrossFit',
    price: '$20'
  },
  {
    id: '4',
    name: 'Pickleball League',
    image: 'https://images.unsplash.com/photo-1669684899238-64c4abe4d3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '1.8 mi',
    members: 312,
    nextEvent: 'Today, 5:00 PM',
    activity: 'Pickleball',
    price: '$10'
  },
  {
    id: '5',
    name: 'Weekend Cyclists',
    image: 'https://images.unsplash.com/photo-1735216228027-fe31c23474ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '3.2 mi',
    members: 445,
    nextEvent: 'Sun, 7:00 AM',
    activity: 'Cycling',
    price: 'Free'
  }
];
export function HomeScreen({
  onCommunitySelect,
  onProfileClick,
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
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back 👋</h1>

        <div className="flex items-center gap-2 text-gray-600 mt-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {userLocation?.city
              ? `${userLocation.city}${userLocation.state ? ', ' + userLocation.state : ''}`
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
          {userInterests?.length ? (
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
            {MOCK_COMMUNITIES.slice(0, 4).map((c) => (
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
