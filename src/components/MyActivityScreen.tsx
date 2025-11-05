import { ChevronLeft, Calendar, Trophy, Users, ChevronRight } from 'lucide-react';

interface MyActivityScreenProps {
  onBack: () => void;
  onCommunitySelect: (communityId: string) => void;
}

const mockJoinedCommunities = [
  {
    id: '1',
    name: 'Sunrise Runners',
    members: 234,
    image: 'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '2',
    name: 'Zen Flow Yoga',
    members: 189,
    image: 'https://images.unsplash.com/photo-1758274525134-4b1e9cc67dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '3',
    name: 'Outdoor HIIT Warriors',
    members: 156,
    image: 'https://images.unsplash.com/photo-1758521959291-e1dd95419b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

const mockUpcomingEvents = [
  {
    id: '1',
    name: 'Morning 5K Loop',
    community: 'Sunrise Runners',
    date: 'Tomorrow',
    time: '6:00 AM',
    image: 'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '2',
    name: 'Zen Flow Session',
    community: 'Zen Flow Yoga',
    date: 'Wed, Nov 6',
    time: '7:00 PM',
    image: 'https://images.unsplash.com/photo-1758274525134-4b1e9cc67dbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '3',
    name: 'HIIT Bootcamp',
    community: 'Outdoor HIIT Warriors',
    date: 'Sat, Nov 9',
    time: '9:00 AM',
    image: 'https://images.unsplash.com/photo-1758521959291-e1dd95419b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

const mockPastEvents = [
  {
    id: '3',
    name: 'Trail Run Adventure',
    community: 'Sunrise Runners',
    date: 'Oct 28',
    pointsEarned: 50
  },
  {
    id: '4',
    name: 'HIIT Bootcamp',
    community: 'Outdoor HIIT Warriors',
    date: 'Oct 25',
    pointsEarned: 45
  },
  {
    id: '5',
    name: 'Evening Yoga Flow',
    community: 'Zen Flow Yoga',
    date: 'Oct 22',
    pointsEarned: 40
  },
  {
    id: '6',
    name: 'Morning Run',
    community: 'Sunrise Runners',
    date: 'Oct 20',
    pointsEarned: 35
  },
  {
    id: '7',
    name: 'Core Strength Class',
    community: 'Outdoor HIIT Warriors',
    date: 'Oct 18',
    pointsEarned: 40
  }
];

export function MyActivityScreen({ onBack, onCommunitySelect }: MyActivityScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl">My Activity</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* My Communities */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg mb-4">My Communities</h3>
          <div className="space-y-3">
            {mockJoinedCommunities.map((community) => (
              <button
                key={community.id}
                onClick={() => onCommunitySelect(community.id)}
                className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors"
              >
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 text-left">
                  <div className="text-sm mb-1">{community.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{community.members} members</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {mockUpcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-[#0066FF] transition-colors cursor-pointer">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm mb-1">{event.name}</div>
                  <div className="text-xs text-gray-600 mb-1">{event.community}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Activity */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg mb-4">Past Activity</h3>
          <div className="space-y-3">
            {mockPastEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="text-sm mb-1">{event.name}</div>
                  <div className="text-xs text-gray-600">{event.community}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-[#0066FF]">
                    <Trophy className="w-4 h-4" />
                    <span>+{event.pointsEarned}</span>
                  </div>
                  <div className="text-xs text-gray-500">{event.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
}
