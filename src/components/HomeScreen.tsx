// src/components/HomeScreen.tsx
import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Home,
  Activity,
  User,
  Grid3x3,
  List,
} from 'lucide-react';
import { Input } from './ui/input';

type UserLocation = {
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
};

type Community = {
  id: string;
  name: string;
  image: string;
  distance: string;
  members: number;
  nextEvent: string;
  activity: string;
  price: string;
};

interface HomeScreenProps {
  onCommunitySelect: (communityId: string) => void;
  onProfileClick: () => void;
  onDashboardClick?: () => void;   // kept for future organizer view
  onActivityClick?: () => void;
  userType: string;
  userInterests?: string[];
  userLocation?: UserLocation;
  onRefreshLocation?: () => void;
}

/** --- MOCK DATA (prototype only) --- */
const MOCK_COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'Sunrise Runners',
    image:
      'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '0.5 mi',
    members: 234,
    nextEvent: 'Tomorrow, 6:00 AM',
    activity: 'Running',
    price: 'Free',
  },
  {
    id: '2',
    name: 'Zen Flow Yoga',
    image:
      'https://images.unsplash.com/photo-1758274525134-4b1e9cc67dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '1.2 mi',
    members: 189,
    nextEvent: 'Wed, 7:00 PM',
    activity: 'Yoga',
    price: '$15',
  },
  {
    id: '3',
    name: 'Outdoor HIIT Warriors',
    image:
      'https://images.unsplash.com/photo-1758521959291-e1dd95419b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '2.1 mi',
    members: 156,
    nextEvent: 'Sat, 8:00 AM',
    activity: 'CrossFit',
    price: '$20',
  },
  {
    id: '4',
    name: 'Pickleball League',
    image:
      'https://images.unsplash.com/photo-1669684899238-64c4abe4d3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '1.8 mi',
    members: 312,
    nextEvent: 'Today, 5:00 PM',
    activity: 'Pickleball',
    price: '$10',
  },
  {
    id: '5',
    name: 'Weekend Cyclists',
    image:
      'https://images.unsplash.com/photo-1735216228027-fe31c23474ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    distance: '3.2 mi',
    members: 445,
    nextEvent: 'Sun, 7:00 AM',
    activity: 'Cycling',
    price: 'Free',
  },
];

export function HomeScreen({
  onCommunitySelect,
  onProfileClick,
  onActivityClick,
  userType,          // currently not used but kept for later
  userInterests = [],
  userLocation,
  onRefreshLocation,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFilterClick = (filter: string) => {
    if (filter === 'All') {
      setActivityFilters([]);
      setPriceFilters([]);
      return;
    }

    const activityTypes = ['Running', 'Yoga', 'Cycling', 'CrossFit', 'Pickleball'];
    const priceTypes = ['Free', 'Paid'];

    if (activityTypes.includes(filter)) {
      setActivityFilters(prev =>
        prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter],
      );
    } else if (priceTypes.includes(filter)) {
      setPriceFilters(prev =>
        prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter],
      );
    }
  };

  const isFilterActive = (filter: string) => {
    if (filter === 'All') return activityFilters.length === 0 && priceFilters.length === 0;
    return activityFilters.includes(filter) || priceFilters.includes(filter);
  };

  const filteredCommunities = MOCK_COMMUNITIES.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.activity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesActivity =
      activityFilters.length === 0 || activityFilters.includes(c.activity);

    const isFree = c.price === 'Free';
    const isPaid = c.price !== 'Free';
    const matchesPrice =
      priceFilters.length === 0 ||
      (priceFilters.includes('Free') && isFree) ||
      (priceFilters.includes('Paid') && isPaid);

    return matchesSearch && matchesActivity && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 pb-4 shadow-sm">
        <div className="mb-4">
          <h1 className="text-2xl">Discover</h1>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {userLocation?.city
                ? `${userLocation.city}${userLocation.state ? ', ' + userLocation.state : ''}`
                : 'San Francisco, CA'}
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Find a community or event"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-full border-gray-300"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['All', 'Running', 'Yoga', 'Cycling', 'Free', 'Paid'].map(filter => (
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
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-20">
        <div className="flex items-center justify-between px-2 mb-4">
          <div>
            <h2 className="text-lg">Nearby Communities</h2>
            <span className="text-sm text-gray-600">
              {filteredCommunities.length}{' '}
              {filteredCommunities.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
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

        {filteredCommunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">No communities found</h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Try adjusting your filters or search to find more communities.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          // List view
          <div className="space-y-3">
            {filteredCommunities.map(c => (
              <button
                key={c.id}
                onClick={() => onCommunitySelect(c.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4 text-left"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-base">{c.name}</h3>
                      <span className="text-sm text-[#0066FF] ml-2">{c.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{c.activity}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{c.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{c.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#0066FF]" />
                      <span>{c.nextEvent}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Grid view (card layout like your screenshot)
          <div className="space-y-4">
            {filteredCommunities.map(c => (
              <button
                key={c.id}
                onClick={() => onCommunitySelect(c.id)}
                className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="relative h-48">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm">
                    {c.price}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-left flex-1">
                      <h3 className="text-lg mb-1">{c.name}</h3>
                      <p className="text-sm text-gray-600">{c.activity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{c.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{c.members} members</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-sm text-gray-700">Next: {c.nextEvent}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-around">
        <div className="flex flex-col items-center gap-1 py-2 text-[#0066FF]">
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </div>

        <button
          onClick={onActivityClick}
          className="flex flex-col items-center gap-1 py-2 text-gray-500 hover:text-[#0066FF]"
        >
          <Activity className="w-6 h-6" />
          <span className="text-xs">My Activity</span>
        </button>

        <button
          onClick={onProfileClick}
          className="flex flex-col items-center gap-1 py-2 text-gray-500 hover:text-[#0066FF]"
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default HomeScreen;
