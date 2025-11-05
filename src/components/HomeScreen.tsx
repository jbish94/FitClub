import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Calendar, Home, User, LayoutDashboard, Activity, Grid3x3, List, Map as MapIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Community {
  id: string;
  name: string;
  image: string;
  distance: string;
  members: number;
  nextEvent: string;
  activity: string;
  price: string;
}

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

interface HomeScreenProps {
  onCommunitySelect: (communityId: string) => void;
  onProfileClick: () => void;
  onDashboardClick?: () => void;
  onActivityClick?: () => void;
  userType: string;
  userInterests?: string[];
}

export function HomeScreen({ onCommunitySelect, onProfileClick, onDashboardClick, onActivityClick, userType, userInterests = [] }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [priceFilters, setPriceFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>('grid');

  // Load view preference from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('fitclub_user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        // Check for preferences in the userData
        const savedPreferences = localStorage.getItem('fitclub_preferences');
        if (savedPreferences) {
          const prefs = JSON.parse(savedPreferences);
          if (prefs.defaultView) {
            setViewMode(prefs.defaultView);
          }
        }
      }
    } catch (error) {
      console.error('Error loading view preference:', error);
    }
  }, []);

  // Filter and rank logic
  const filteredCommunities = mockCommunities
    .filter((community) => {
      // Search filter
      const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           community.activity.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Activity filter
      const matchesActivity = activityFilters.length === 0 || 
                             activityFilters.includes(community.activity);
      
      // Price filter
      const isFree = community.price === 'Free';
      const isPaid = community.price !== 'Free';
      const matchesPrice = priceFilters.length === 0 ||
                          (priceFilters.includes('Free') && isFree) ||
                          (priceFilters.includes('Paid') && isPaid);
      
      return matchesSearch && matchesActivity && matchesPrice;
    })
    .sort((a, b) => {
      // Rank communities based on user interests
      const aMatchesInterest = userInterests.includes(a.activity);
      const bMatchesInterest = userInterests.includes(b.activity);
      
      // Communities matching user interests come first
      if (aMatchesInterest && !bMatchesInterest) return -1;
      if (!aMatchesInterest && bMatchesInterest) return 1;
      
      // If both or neither match interests, maintain original order
      return 0;
    });

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
        prev.includes(filter) 
          ? prev.filter(f => f !== filter)
          : [...prev, filter]
      );
    } else if (priceTypes.includes(filter)) {
      setPriceFilters(prev => 
        prev.includes(filter) 
          ? prev.filter(f => f !== filter)
          : [...prev, filter]
      );
    }
  };

  const isFilterActive = (filter: string) => {
    if (filter === 'All') {
      return activityFilters.length === 0 && priceFilters.length === 0;
    }
    return activityFilters.includes(filter) || priceFilters.includes(filter);
  };

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

      {/* Communities List */}
      <div className="flex-1 p-4 space-y-4 overflow-auto pb-24">
        {userInterests.length > 0 && filteredCommunities.some(c => userInterests.includes(c.activity)) && (
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
            <span className="text-sm text-gray-600">{filteredCommunities.length} {filteredCommunities.length === 1 ? 'result' : 'results'}</span>
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
        
        {filteredCommunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2 text-gray-900">No communities found</h3>
            <p className="text-sm text-gray-600 max-w-xs">Try adjusting your filters or search to find more communities</p>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View */
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-[500px]">
            {/* Simple map visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Map markers */}
              {filteredCommunities.map((community, index) => {
                const matchesUserInterest = userInterests.includes(community.activity);
                // Position markers in different locations
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '45%', left: '60%' },
                  { top: '60%', left: '25%' },
                  { top: '30%', left: '70%' },
                  { top: '70%', left: '55%' }
                ];
                const position = positions[index % positions.length];
                
                return (
                  <button
                    key={community.id}
                    onClick={() => onCommunitySelect(community.id)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={position}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                      matchesUserInterest 
                        ? 'bg-gradient-to-br from-[#0066FF] to-[#50E3C2]' 
                        : 'bg-white border-2 border-[#0066FF]'
                    }`}>
                      <MapPin className={`w-6 h-6 ${matchesUserInterest ? 'text-white' : 'text-[#0066FF]'}`} />
                    </div>
                    
                    {/* Tooltip */}
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
                );
              })}
            </div>
            
            {/* Map legend */}
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
              const matchesUserInterest = userInterests.includes(community.activity);
              return (
                <button
                  key={community.id}
                  onClick={() => onCommunitySelect(community.id)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
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
              );
            })}
          </div>
        ) : (
          /* Grid View (Default) */
          <div className="space-y-4">
            {filteredCommunities.map((community) => {
              const matchesUserInterest = userInterests.includes(community.activity);
              return (
                <button
                  key={community.id}
                  onClick={() => onCommunitySelect(community.id)}
                  className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
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
              );
            })}
          </div>
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
              setActiveTab('dashboard');
              onDashboardClick?.();
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
              setActiveTab('activity');
              onActivityClick?.();
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
            setActiveTab('profile');
            onProfileClick();
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
  );
}
