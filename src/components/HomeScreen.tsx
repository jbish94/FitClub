import { useState, useEffect } from 'react'
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Home,
  User,
  LayoutDashboard,
  Activity,
  Grid3x3,
  List,
  Map as MapIcon
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

// ✅ NEW: Supabase client
import { supabase } from '../lib/supabase' // adjust to '../../lib/supabase' if your file path differs

// ---- Types coming from DB + UI fields we show ----
type DBCommunity = {
  id: string
  name: string
  description: string | null
  location_lat: number | null
  location_lng: number | null
  created_at: string
}

interface CommunityCard {
  id: string
  name: string
  image: string
  distance: string
  members: number
  nextEvent: string
  activity: string
  price: string
  description?: string | null
}

interface HomeScreenProps {
  onCommunitySelect: (communityId: string) => void
  onProfileClick: () => void
  onDashboardClick?: () => void
  onActivityClick?: () => void
  userType: string
  userInterests?: string[]
}

// Small helpers for nice placeholders until we store real values in DB
const placeholderImages = [
  'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1758274525134-4b1e9cc67dbb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1758521959291-e1dd95419b21?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1669684899238-64c4abe4d3cc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1735216228027-fe31c23474ce?q=80&w=800&auto=format&fit=crop',
]
const pickImage = (i: number) => placeholderImages[i % placeholderImages.length]

// Very simple distance label for now (we’ll replace with real geolocation later)
const fallbackDistance = 'nearby'

// Map DB rows → UI cards
const mapToCard = (row: DBCommunity, index: number): CommunityCard => ({
  id: row.id,
  name: row.name,
  description: row.description,
  image: pickImage(index),
  distance: fallbackDistance,
  members: 0,                 // TODO: replace with real count via memberships table
  nextEvent: '—',             // TODO: join events table for next upcoming time
  activity: 'Community',      // TODO: add `activity` column in DB later
  price: 'Free',              // TODO: add pricing fields in DB later
})

export function HomeScreen({
  onCommunitySelect,
  onProfileClick,
  onDashboardClick,
  onActivityClick,
  userType,
  userInterests = [],
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [activityFilters, setActivityFilters] = useState<string[]>([])
  const [priceFilters, setPriceFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>('grid')

  // ✅ NEW: data + loading/error state
  const [communities, setCommunities] = useState<CommunityCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load view preference from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('fitclub_user_data')
      if (userData) {
        const savedPreferences = localStorage.getItem('fitclub_preferences')
        if (savedPreferences) {
          const prefs = JSON.parse(savedPreferences)
          if (prefs.defaultView) setViewMode(prefs.defaultView)
        }
      }
    } catch (err) {
      console.error('Error loading view preference:', err)
    }
  }, [])

  // ✅ NEW: fetch real communities from Supabase
  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from<DBCommunity>('communities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        setError(error.message)
        setCommunities([])
      } else {
        const mapped = (data ?? []).map(mapToCard)
        setCommunities(mapped)
      }
      setLoading(false)
    }

    fetchCommunities()
  }, [])

  // Filter + search logic (kept as-is; activity/price are placeholders for now)
  const filteredCommunities = communities
    .filter((community) => {
      const matchesSearch =
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (community.activity ?? '').toLowerCase().includes(searchQuery.toLowerCase())

      const matchesActivity =
        activityFilters.length === 0 || activityFilters.includes(community.activity)

      const isFree = community.price === 'Free'
      const isPaid = community.price !== 'Free'
      const matchesPrice =
        priceFilters.length === 0 ||
        (priceFilters.includes('Free') && isFree) ||
        (priceFilters.includes('Paid') && isPaid)

      return matchesSearch && matchesActivity && matchesPrice
    })
    .sort((a, b) => {
      const aMatch = userInterests.includes(a.activity)
      const bMatch = userInterests.includes(b.activity)
      if (aMatch && !bMatch) return -1
      if (!aMatch && bMatch) return 1
      return 0
    })

  const handleFilterClick = (filter: string) => {
    if (filter === 'All') {
      setActivityFilters([])
      setPriceFilters([])
      return
    }

    const activityTypes = ['Running', 'Yoga', 'Cycling', 'CrossFit', 'Pickleball']
    const priceTypes = ['Free', 'Paid']

    if (activityTypes.includes(filter)) {
      setActivityFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
    } else if (priceTypes.includes(filter)) {
      setPriceFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
    }
  }

  const isFilterActive = (filter: string) => {
    if (filter === 'All') return activityFilters.length === 0 && priceFilters.length === 0
    return activityFilters.includes(filter) || priceFilters.includes(filter)
  }

  // ---- Render ----
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 pb-4 shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl">Discover</h1>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">San Francisco, CA</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Find a community or event"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-full border-gray-300"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['All', 'Running', 'Yoga', 'Cycling', 'Free', 'Paid'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                isFilterActive(filter)
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-24">
        {/* Loading / Error states */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">Loading communities…</h3>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">Couldn’t load communities</h3>
            <p className="text-sm text-gray-600 max-w-xs">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {userInterests.length > 0 &&
              filteredCommunities.some((c) => userInterests.includes(c.activity)) && (
                <div className="px-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-lg">✨</span>
                    <span>Communities matching your interests appear first</span>
                  </div>
                </div>
              )}

            <div className="flex items-center justify-between px-2 mb-4">
              <div>
                <h2 className="text-lg">Nearby Communities</h2>
                <span className="text-sm text-gray-600">
                  {filteredCommunities.length} {filteredCommunities.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map' ? 'bg-white text-[#0066FF] shadow-sm' : 'text-gray-600'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-[#0066FF] shadow-sm' : 'text-gray-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-[#0066FF] shadow-sm' : 'text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Empty state */}
            {filteredCommunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg mb-2 text-gray-900">No communities found</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Try adjusting your filters or search to find more communities
                </p>
              </div>
            ) : viewMode === 'map' ? (
              /* Map View (placeholder grid until we wire Mapbox) */
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {filteredCommunities.map((community, index) => {
                    const matchesUserInterest = userInterests.includes(community.activity)
                    const positions = [
                      { top: '25%', left: '30%' },
                      { top: '45%', left: '60%' },
                      { top: '60%', left: '25%' },
                      { top: '30%', left: '70%' },
                      { top: '70%', left: '55%' },
                    ]
                    const position = positions[index % positions.length]

                    return (
                      <button
                        key={community.id}
                        onClick={() => onCommunitySelect(community.id)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={position}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                            matchesUserInterest
                              ? 'bg-gradient-to-br from-[#0066FF] to-[#50E3C2]'
                              : 'bg-white border-2 border-[#0066FF]'
                          }`}
                        >
                          <MapPin className={`w-6 h-6 ${matchesUserInterest ? 'text-white' : 'text-[#0066FF]'}`} />
                        </div>

                        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-sm text-left">
                            <p className="text-gray-900 mb-1">{community.name}</p>
                            <p className="text-xs text-gray-600 mb-2">{community.activity}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{community.distance}</span>
                              <span>{community.members} members</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                  <p className="text-xs text-gray-600 mb-2">Legend</p>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#0066FF] to-[#50E3C2]"></div>
                    <span>For You</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-white border-2 border-[#0066FF]"></div>
                    <span>Other Communities</span>
                  </div>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              /* List View */
              <div className="space-y-3">
                {filteredCommunities.map((community) => {
                  const matchesUserInterest = userInterests.includes(community.activity)
                  return (
                    <button
                      key={community.id}
                      onClick={() => onCommunitySelect(community.id)}
                      className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                        {matchesUserInterest && (
                          <div className="absolute top-1 left-1 px-2 py-0.5 bg-gradient-to-r from-[#0066FF] to-[#50E3C2] text-white rounded text-xs">
                            ✨
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-left flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-base">{community.name}</h3>
                            <span className="text-sm text-[#0066FF] ml-2">{community.price}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{community.activity}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{community.distance}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{community.members}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-700">
                            <Calendar className="w-3 h-3 text-[#0066FF]" />
                            <span>{community.nextEvent}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* Grid View (Default) */
              <div className="space-y-4">
                {filteredCommunities.map((community) => {
                  const matchesUserInterest = userInterests.includes(community.activity)
                  return (
                    <button
                      key={community.id}
                      onClick={() => onCommunitySelect(community.id)}
                      className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48">
                        <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm">
                          {community.price}
                        </div>
                        {matchesUserInterest && (
                          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-[#0066FF] to-[#50E3C2] text-white rounded-full text-xs flex items-center gap-1">
                            <span>✨</span>
                            <span>For You</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-left flex-1">
                            <h3 className="text-lg mb-1">{community.name}</h3>
                            <p className="text-sm text-gray-600">{community.activity}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{community.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{community.members} members</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <Calendar className="w-4 h-4 text-[#0066FF]" />
                          <span className="text-sm text-gray-700">Next: {community.nextEvent}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-2 ${
            activeTab === 'home' ? 'text-[#0066FF]' : 'text-gray-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>

        {userType === 'organizer' ? (
          <button
            onClick={() => {
              setActiveTab('dashboard')
              onDashboardClick?.()
            }}
            className={`flex flex-col items-center gap-1 py-2 ${
              activeTab === 'dashboard' ? 'text-[#0066FF]' : 'text-gray-500'
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveTab('activity')
              onActivityClick?.()
            }}
            className={`flex flex-col items-center gap-1 py-2 ${
              activeTab === 'activity' ? 'text-[#0066FF]' : 'text-gray-500'
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs">Activity</span>
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab('profile')
            onProfileClick()
          }}
          className={`flex flex-col items-center gap-1 py-2 ${
            activeTab === 'profile' ? 'text-[#0066FF]' : 'text-gray-500'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  )
}
