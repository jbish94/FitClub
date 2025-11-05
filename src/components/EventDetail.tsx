import { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, Users, DollarSign, MessageCircle, ExternalLink, User } from 'lucide-react';
import { Button } from './ui/button';

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
}

const eventData = {
  e1: {
    name: 'Morning 5K Loop',
    image: 'https://images.unsplash.com/photo-1758512867379-30c5e04f155c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    community: 'Sunrise Runners',
    date: 'Tomorrow, Nov 4',
    time: '6:00 AM - 7:00 AM',
    location: 'Golden Gate Park - Main Entrance',
    locationAddress: '501 Stanyan St, San Francisco, CA 94117',
    attendees: 28,
    maxAttendees: 40,
    price: 'Free',
    description: 'Join us for an energizing 5K loop through Golden Gate Park. Perfect for all fitness levels! We\'ll start at the main entrance and make our way through some of the park\'s most scenic routes.',
    whatToBring: ['Running shoes', 'Water bottle', 'Weather-appropriate clothing'],
    organizer: 'Sarah Chen'
  }
};

const mockAttendees = [
  { id: '1', name: 'Mike Johnson', avatar: '🏃‍♂️' },
  { id: '2', name: 'Emma Davis', avatar: '🏃‍♀️' },
  { id: '3', name: 'Alex Kim', avatar: '🏃' },
  { id: '4', name: 'Lisa Wang', avatar: '🏃‍♀️' },
  { id: '5', name: 'Tom Brown', avatar: '🏃‍♂️' },
  { id: '6', name: 'Sarah Park', avatar: '🏃‍♀️' },
];

const mockChatMessages = [
  {
    id: '1',
    sender: 'Sarah Chen',
    message: 'Looking forward to seeing everyone tomorrow!',
    time: '2h ago',
    avatar: '👋'
  },
  {
    id: '2',
    sender: 'Mike Johnson',
    message: 'I\'ll be there! Should we meet 10 mins early?',
    time: '1h ago',
    avatar: '🏃‍♂️'
  }
];

export function EventDetail({ eventId, onBack }: EventDetailProps) {
  const [rsvpStatus, setRsvpStatus] = useState<'none' | 'rsvped' | 'paid'>('none');
  const event = eventData.e1;
  const isPaid = event.price !== 'Free';

  const handleRSVP = () => {
    if (isPaid) {
      // Show payment modal in real app
      setRsvpStatus('paid');
    } else {
      setRsvpStatus('rsvped');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header Image */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        {isPaid && (
          <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#0066FF]" />
            <span className="text-sm">{event.price}</span>
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="bg-white px-6 py-5 shadow-sm">
        <div className="text-xs text-[#0066FF] mb-2">{event.community}</div>
        <h1 className="text-2xl mb-4">{event.name}</h1>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-900">{event.date}</div>
              <div className="text-sm text-gray-600">{event.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">{event.location}</div>
              <div className="text-sm text-gray-600">{event.locationAddress}</div>
              <button className="text-sm text-[#0066FF] flex items-center gap-1 mt-1">
                View Map <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-600" />
            <div className="text-sm text-gray-900">
              {event.attendees}/{event.maxAttendees} attending
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white px-6 py-5 mt-2 shadow-sm">
        <h3 className="text-lg mb-3">About this event</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {/* What to Bring */}
      <div className="bg-white px-6 py-5 mt-2 shadow-sm">
        <h3 className="text-lg mb-3">What to bring</h3>
        <ul className="space-y-2">
          {event.whatToBring.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Attendees */}
      <div className="bg-white px-6 py-5 mt-2 shadow-sm">
        <h3 className="text-lg mb-4">Attendees ({event.attendees})</h3>
        <div className="grid grid-cols-3 gap-3">
          {mockAttendees.map((attendee) => (
            <div key={attendee.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0066FF] to-[#50E3C2] flex items-center justify-center mb-2">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="text-xs text-center text-gray-700">{attendee.name.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Chat */}
      <div className="bg-white px-6 py-5 mt-2 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Event Chat</h3>
          <MessageCircle className="w-5 h-5 text-gray-400" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-[#0066FF] mt-0.5" />
            <div>
              <p className="text-sm">
                <span className="text-[#0066FF]">Chat placeholder:</span> Coordinate with other attendees before the event!
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {mockChatMessages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#50E3C2] flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-900">{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-700">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {rsvpStatus === 'none' ? (
          <Button
            onClick={handleRSVP}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-14"
          >
            {isPaid ? `Pay ${event.price} & RSVP` : 'RSVP for Free'}
          </Button>
        ) : rsvpStatus === 'paid' ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <span className="text-lg text-gray-900">Payment Confirmed!</span>
            </div>
            <p className="text-sm text-gray-600">You're all set. See you at the event!</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">✓</span>
              </div>
              <span className="text-lg text-gray-900">You're Going!</span>
            </div>
            <Button
              onClick={() => setRsvpStatus('none')}
              variant="outline"
              className="mt-2 rounded-full"
            >
              Cancel RSVP
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
