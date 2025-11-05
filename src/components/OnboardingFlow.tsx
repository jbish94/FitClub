import { useState } from 'react';
import { Button } from './ui/button';
import { MapPin, Users, UserCircle, ChevronLeft } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingFlowProps {
  onComplete: (data: { userType: string; interests: string[]; locationEnabled: boolean }) => void;
}

const activityOptions = [
  '🏃‍♂️ Running',
  '🧘‍♀️ Yoga',
  '🎾 Pickleball',
  '🚴‍♀️ Cycling',
  '⚽ Soccer',
  '🏀 Basketball',
  '🏋️‍♀️ CrossFit',
  '🥊 Boxing',
  '🏊‍♀️ Swimming',
  '⛰️ Hiking',
  '🏐 Volleyball',
  '🎯 Other'
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1 && !userType) return;
    if (step === 2 && selectedInterests.length === 0) return;
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        userType,
        interests: selectedInterests,
        locationEnabled: true
      });
    }
  };

  const toggleInterest = (interest: string) => {
    // Normalize interest name by removing emoji
    const normalizedInterest = interest.split(' ').slice(1).join(' ');
    
    if (selectedInterests.includes(normalizedInterest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== normalizedInterest));
    } else {
      setSelectedInterests([...selectedInterests, normalizedInterest]);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="p-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
        <div className="flex-1" />
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-[#0066FF]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-3">Welcome to FitClub!</h2>
              <p className="text-lg text-gray-600">Are you here to organize or join communities?</p>
            </div>

            <div className="space-y-4 flex-1">
              <button
                onClick={() => setUserType('organizer')}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  userType === 'organizer'
                    ? 'border-[#0066FF] bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl mb-1">Organizer</h3>
                    <p className="text-gray-600">Create and manage fitness communities, host events, and grow your member base.</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                    userType === 'organizer' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'
                  }`}>
                    {userType === 'organizer' && (
                      <svg viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType('member')}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  userType === 'member'
                    ? 'border-[#0066FF] bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#50E3C2] flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl mb-1">Member</h3>
                    <p className="text-gray-600">Discover local fitness communities, join events, and connect with like-minded people.</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                    userType === 'member' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'
                  }`}>
                    {userType === 'member' && (
                      <svg viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-3">What are your interests?</h2>
              <p className="text-lg text-gray-600">Select all activities you enjoy</p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1">
              {activityOptions.map((activity) => {
                const normalizedActivity = activity.split(' ').slice(1).join(' ');
                return (
                  <button
                    key={activity}
                    onClick={() => toggleInterest(activity)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedInterests.includes(normalizedActivity)
                        ? 'border-[#0066FF] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{activity.split(' ')[0]}</span>
                      <span className="text-sm">{activity.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <div className="relative">
                <Logo size={100} />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-[#0066FF]" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl mb-3">Enable Location</h2>
            <p className="text-lg text-gray-600 mb-4">Find fitness communities and events near you</p>
            <p className="text-sm text-gray-500 max-w-sm">We'll use your location to show relevant communities in your area. You can change this anytime in settings.</p>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-6">
          <Button
            onClick={handleNext}
            disabled={step === 1 ? !userType : step === 2 ? selectedInterests.length === 0 : false}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-14 disabled:opacity-50"
          >
            {step === 3 ? 'Enable Location & Continue' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
