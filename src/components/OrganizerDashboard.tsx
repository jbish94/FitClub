import { useState } from 'react';
import { ChevronLeft, Users, DollarSign, Calendar, TrendingUp, Plus, Edit, Eye, MoreVertical, X, MapPin, Clock, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface OrganizerDashboardProps {
  onBack: () => void;
}

const mockCommunities = [
  {
    id: 'c1',
    name: 'Sunrise Runners',
    description: 'Early morning running club',
    members: 234,
    earnings: 2340,
    nextEvent: 'Tomorrow, 6:00 AM',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'c2',
    name: 'Zen Flow Yoga',
    description: 'Mindful yoga sessions',
    members: 189,
    earnings: 1560,
    nextEvent: 'Wed, Nov 6, 7:00 PM',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1758274525134-4b1e9cc67dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: 'c3',
    name: 'HIIT Warriors',
    description: 'High intensity workouts',
    members: 156,
    earnings: 680,
    nextEvent: 'Fri, Nov 8, 6:30 PM',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1758521959291-e1dd95419b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

const mockEvents = [
  {
    id: 'e1',
    communityId: 'c1',
    communityName: 'Sunrise Runners',
    name: 'Morning 5K Loop',
    date: 'Nov 5, 2025',
    time: '6:00 AM',
    location: 'Golden Gate Park',
    attendees: 28,
    maxCapacity: 50,
    price: 0,
    status: 'upcoming'
  },
  {
    id: 'e2',
    communityId: 'c1',
    name: 'Trail Run Adventure',
    communityName: 'Sunrise Runners',
    date: 'Nov 9, 2025',
    time: '7:00 AM',
    location: 'Mt. Tamalpais',
    attendees: 15,
    maxCapacity: 30,
    price: 15,
    status: 'upcoming'
  },
  {
    id: 'e3',
    communityId: 'c2',
    communityName: 'Zen Flow Yoga',
    name: 'Zen Flow Session',
    date: 'Nov 6, 2025',
    time: '7:00 PM',
    location: 'Studio A',
    attendees: 22,
    maxCapacity: 25,
    price: 20,
    status: 'upcoming'
  },
  {
    id: 'e4',
    communityId: 'c3',
    communityName: 'HIIT Warriors',
    name: 'Outdoor Bootcamp',
    date: 'Nov 8, 2025',
    time: '6:30 PM',
    location: 'Dolores Park',
    attendees: 18,
    maxCapacity: 40,
    price: 12,
    status: 'upcoming'
  }
];

export function OrganizerDashboard({ onBack }: OrganizerDashboardProps) {
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'communities' | 'events'>('overview');

  // Create Community form state
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    category: 'Running',
    location: ''
  });

  // Create Event form state
  const [newEvent, setNewEvent] = useState({
    communityId: '',
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    maxCapacity: ''
  });

  const totalMembers = mockCommunities.reduce((sum, c) => sum + c.members, 0);
  const totalEarnings = mockCommunities.reduce((sum, c) => sum + c.earnings, 0);
  const upcomingEventsCount = mockEvents.filter(e => e.status === 'upcoming').length;

  const filteredEvents = selectedCommunityId
    ? mockEvents.filter(e => e.communityId === selectedCommunityId)
    : mockEvents;

  const handleCreateCommunity = () => {
    console.log('Creating community:', newCommunity);
    // Placeholder: In production, this would call an API to create the community
    setShowCreateCommunity(false);
    setNewCommunity({ name: '', description: '', category: 'Running', location: '' });
  };

  const handleCreateEvent = () => {
    console.log('Creating event:', newEvent);
    // Placeholder: In production, this would call an API to create the event
    setShowCreateEvent(false);
    setNewEvent({
      communityId: '',
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: '',
      maxCapacity: ''
    });
    setSelectedCommunityId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log('Deleting event:', eventId);
    // Placeholder: In production, this would call an API to delete the event
  };

  const handleEditEvent = (eventId: string) => {
    console.log('Editing event:', eventId);
    // Placeholder: In production, this would open an edit modal
  };

  const handleViewEvent = (eventId: string) => {
    console.log('Viewing event details:', eventId);
    // Placeholder: In production, this would navigate to event detail page
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl">Organizer Dashboard</h1>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setView('overview')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              view === 'overview'
                ? 'bg-[#0066FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setView('communities')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              view === 'communities'
                ? 'bg-[#0066FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Communities ({mockCommunities.length})
          </button>
          <button
            onClick={() => setView('events')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              view === 'events'
                ? 'bg-[#0066FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Events ({upcomingEventsCount})
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Overview View */}
        {view === 'overview' && (
          <>
            {/* Metrics Overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm opacity-90">Total Members</span>
                </div>
                <div className="text-3xl mb-1">{totalMembers}</div>
                <div className="text-sm flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#50E3C2] to-[#2BC4A8] rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm opacity-90">Total Earnings</span>
                </div>
                <div className="text-3xl mb-1">${totalEarnings}</div>
                <div className="text-sm">
                  Across all communities
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Communities</span>
                </div>
                <div className="text-3xl mb-1">{mockCommunities.length}</div>
                <div className="text-sm text-gray-600">
                  Active groups
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Events</span>
                </div>
                <div className="text-3xl mb-1">{upcomingEventsCount}</div>
                <div className="text-sm text-gray-600">
                  Upcoming
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowCreateCommunity(true)}
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">New Community</span>
                </Button>
                <Button
                  onClick={() => setShowCreateEvent(true)}
                  className="h-auto py-4 flex flex-col items-center gap-2 bg-[#50E3C2] hover:bg-[#2BC4A8] text-white rounded-xl"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">New Event</span>
                </Button>
              </div>
            </div>

            {/* Recent Communities */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Your Communities</h3>
                <button
                  onClick={() => setView('communities')}
                  className="text-sm text-[#0066FF]"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {mockCommunities.slice(0, 2).map((community) => (
                  <div key={community.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={community.image}
                        alt={community.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">{community.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{community.members}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${community.earnings}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Upcoming Events</h3>
                <button
                  onClick={() => setView('events')}
                  className="text-sm text-[#0066FF]"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {mockEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm mb-1">{event.name}</div>
                        <div className="text-xs text-gray-600 mb-1">{event.communityName}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.attendees}/{event.maxCapacity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          {event.price === 0 ? 'Free' : `$${event.price}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg mb-4">Analytics Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Growth Rate</span>
                  <span className="text-sm text-green-600">+12% ↑</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Event Attendance Rate</span>
                  <span className="text-sm text-green-600">82% ↑</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Revenue per Event</span>
                  <span className="text-sm text-gray-900">$156</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Communities View */}
        {view === 'communities' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">My Communities</h2>
              <Button
                onClick={() => setShowCreateCommunity(true)}
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Community
              </Button>
            </div>

            <div className="space-y-3">
              {mockCommunities.map((community) => (
                <div key={community.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg mb-1">{community.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                        </div>
                        <button className="p-2">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{community.members} members</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>${community.earnings}</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          community.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {community.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Event</span>
                      <span className="text-gray-900">{community.nextEvent}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full text-sm h-9">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full text-sm h-9">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedCommunityId(community.id);
                        setShowCreateEvent(true);
                      }}
                      className="flex-1 rounded-full text-sm h-9 bg-[#0066FF] hover:bg-[#0052CC] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Events View */}
        {view === 'events' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">All Events</h2>
              <Button
                onClick={() => setShowCreateEvent(true)}
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>

            {/* Community Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCommunityId(null)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCommunityId === null
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                All Communities
              </button>
              {mockCommunities.map((community) => (
                <button
                  key={community.id}
                  onClick={() => setSelectedCommunityId(community.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCommunityId === community.id
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {community.name}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{event.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.communityName}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees}/{event.maxCapacity} attendees</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg mb-1">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full text-sm h-9">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full text-sm h-9">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" className="rounded-full text-sm h-9 px-3 border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Create Community</h2>
              <button onClick={() => setShowCreateCommunity(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Community Name</label>
                <Input 
                  placeholder="e.g., Morning Runners Club" 
                  className="h-12 rounded-xl"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Description</label>
                <textarea
                  placeholder="Describe your community..."
                  className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none resize-none"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Category</label>
                <select 
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none"
                  value={newCommunity.category}
                  onChange={(e) => setNewCommunity({ ...newCommunity, category: e.target.value })}
                >
                  <option>Running</option>
                  <option>Yoga</option>
                  <option>HIIT</option>
                  <option>Cycling</option>
                  <option>Sports</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Location</label>
                <Input 
                  placeholder="City or area" 
                  className="h-12 rounded-xl"
                  value={newCommunity.location}
                  onChange={(e) => setNewCommunity({ ...newCommunity, location: e.target.value })}
                />
              </div>

              <Button 
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-12 mt-6"
                onClick={handleCreateCommunity}
                disabled={!newCommunity.name || !newCommunity.description || !newCommunity.location}
              >
                Create Community
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Create Event</h2>
              <button onClick={() => {
                setShowCreateEvent(false);
                setSelectedCommunityId(null);
              }}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Community</label>
                <select
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none"
                  value={selectedCommunityId || ''}
                  onChange={(e) => setSelectedCommunityId(e.target.value)}
                >
                  <option value="">Select a community</option>
                  {mockCommunities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Event Name</label>
                <Input 
                  placeholder="e.g., Morning 5K Run" 
                  className="h-12 rounded-xl"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Description</label>
                <textarea
                  placeholder="Event details..."
                  className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none resize-none"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Date</label>
                  <Input 
                    type="date" 
                    className="h-12 rounded-xl"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Time</label>
                  <Input 
                    type="time" 
                    className="h-12 rounded-xl"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Location</label>
                <Input 
                  placeholder="Event location" 
                  className="h-12 rounded-xl"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Price ($)</label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="h-12 rounded-xl"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Max Capacity</label>
                  <Input 
                    type="number" 
                    placeholder="50" 
                    className="h-12 rounded-xl"
                    value={newEvent.maxCapacity}
                    onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-12 mt-6"
                onClick={handleCreateEvent}
                disabled={!selectedCommunityId || !newEvent.name || !newEvent.date || !newEvent.time}
              >
                Create Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
