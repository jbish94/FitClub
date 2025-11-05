import { useState } from 'react';
import { ChevronLeft, MapPin, Users, Calendar, MessageCircle, Trophy, Info, ExternalLink, User } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface CommunityPageProps {
  communityId: string;
  onBack: () => void;
  onEventSelect: (eventId: string) => void;
}

const communityData = {
  '1': {
    name: 'Sunrise Runners',
    banner: 'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    members: 234,
    description: 'Join us for energizing morning runs through Golden Gate Park. All paces welcome! We meet every Tuesday, Thursday, and Saturday mornings.',
    organizer: 'Sarah Chen',
    organizerBio: 'Marathon runner and certified running coach with 10+ years experience',
    activity: 'Running',
    location: 'Golden Gate Park, SF'
  }
};

const mockEvents = [
  {
    id: 'e1',
    name: 'Morning 5K Loop',
    date: 'Tomorrow',
    time: '6:00 AM',
    location: 'Golden Gate Park - Main Entrance',
    attendees: 28,
    maxAttendees: 40,
    price: 'Free'
  },
  {
    id: 'e2',
    name: 'Trail Run Adventure',
    date: 'This Saturday',
    time: '7:00 AM',
    location: 'Lands End Trail',
    attendees: 15,
    maxAttendees: 25,
    price: 'Free'
  },
  {
    id: 'e3',
    name: 'Half Marathon Prep',
    date: 'Next Tuesday',
    time: '6:00 AM',
    location: 'Marina Green',
    attendees: 12,
    maxAttendees: 30,
    price: 'Free'
  }
];

const mockLeaderboard = [
  { rank: 1, name: 'Mike Johnson', points: 850, avatar: '🏃‍♂️' },
  { rank: 2, name: 'Emma Davis', points: 720, avatar: '🏃‍♀️' },
  { rank: 3, name: 'Alex Kim', points: 680, avatar: '🏃' },
  { rank: 4, name: 'Lisa Wang', points: 590, avatar: '🏃‍♀️' },
  { rank: 5, name: 'Tom Brown', points: 540, avatar: '🏃‍♂️' }
];

const mockMessages = [
  {
    id: 'm1',
    sender: 'Sarah Chen',
    message: 'Great run this morning everyone! 🎉',
    time: '2h ago',
    avatar: '👋'
  },
  {
    id: 'm2',
    sender: 'Mike Johnson',
    message: 'What time are we meeting on Saturday?',
    time: '4h ago',
    avatar: '🏃‍♂️'
  },
  {
    id: 'm3',
    sender: 'Emma Davis',
    message: 'Don\'t forget to bring water for the trail run!',
    time: '1d ago',
    avatar: '🏃‍♀️'
  }
];

export function CommunityPage({ communityId, onBack, onEventSelect }: CommunityPageProps) {
  const [joined, setJoined] = useState(false);
  const community = communityData['1'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Banner */}
      <div className="relative">
        <img
          src={community.banner}
          alt={community.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Community Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-2xl mb-1">{community.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{community.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{community.members} members</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setJoined(!joined)}
          className={`w-full h-12 rounded-full ${
            joined
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              : 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
          }`}
        >
          {joined ? 'Joined ✓' : 'Join Community'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="flex-1 flex flex-col">
        <TabsList className="bg-white border-b border-gray-200 px-6 w-full justify-start rounded-none">
          <TabsTrigger value="events" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0066FF] rounded-none">
            Events
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0066FF] rounded-none">
            Chat
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0066FF] rounded-none">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-[#0066FF] rounded-none">
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="flex-1 p-4 space-y-3 mt-0">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="w-full bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg flex-1">{event.name}</h3>
                <span className="text-sm text-[#0066FF] px-2 py-1 bg-blue-50 rounded-lg">
                  {event.price}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees}/{event.maxAttendees} attending</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <Button 
                  onClick={() => onEventSelect(event.id)}
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full"
                >
                  RSVP
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="chat" className="flex-1 p-4 space-y-3 mt-0">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-[#0066FF] mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-[#0066FF]">Chat feature placeholder:</span> In a full implementation, this would connect to a real-time messaging service.
                </p>
              </div>
            </div>
          </div>

          {mockMessages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#50E3C2] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">{msg.sender}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="fixed bottom-4 left-4 right-4 bg-white rounded-full border border-gray-300 p-3 flex items-center gap-2 shadow-lg">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button className="w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center">
              <span className="text-white">→</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="flex-1 p-4 space-y-3 mt-0">
          <div className="bg-gradient-to-br from-[#0066FF] to-[#50E3C2] rounded-xl p-6 text-white mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6" />
              <h3 className="text-lg">Activity Points</h3>
            </div>
            <p className="text-sm text-white/90">Earn points by attending events and staying active!</p>
          </div>

          {mockLeaderboard.map((member) => (
            <div key={member.rank} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                member.rank <= 3 ? 'bg-gradient-to-br from-[#0066FF] to-[#50E3C2] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {member.rank}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              
              <div className="flex-1">
                <div className="text-sm">{member.name}</div>
                <div className="text-xs text-gray-500">{member.points} points</div>
              </div>
              
              {member.rank <= 3 && (
                <Trophy className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="about" className="flex-1 p-4 space-y-4 mt-0">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-[#0066FF]" />
              <h3 className="text-lg">About</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{community.description}</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-lg mb-3">Organizer</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0066FF] to-[#50E3C2] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg mb-1">{community.organizer}</div>
                <p className="text-sm text-gray-600">{community.organizerBio}</p>
                <Button variant="outline" className="mt-3 rounded-full text-sm h-9">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-lg mb-3">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Activity Type</span>
                <span className="text-gray-900">{community.activity}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Members</span>
                <span className="text-gray-900">{community.members}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Location</span>
                <span className="text-gray-900">{community.location}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
