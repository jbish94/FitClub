import { useState } from 'react';
import { Button } from './ui/button';
import { MapPin, Users, UserCircle, ChevronLeft } from 'lucide-react';
import { Logo } from './Logo';
import { getBrowserLocation, reverseGeocode } from '../lib/location';

interface OnboardingFlowProps {
  onComplete: (data: { userType: string; interests: string[]; locationEnabled: boolean }) => void;
}

type UserLocation = {
  lat?: number;
  lng?: number;
  accuracy?: number;
  city?: string;
  state?: string;
};

const STORAGE_KEY = 'fitclub_user_data';

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
  '🎯 Other',
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Persist location into the same localStorage object your app already uses
  const saveUserLocationToLocalStorage = (loc: UserLocation, enabled: boolean) => {
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const next = {
        ...existing,
        userLocation: loc,
        locationEnabled: enabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore persistence errors for MVP
    }
  };

  const handleNext = () => {
    if (step === 1 && !userType) return;
    if (step === 2 && selectedInterests.length === 0) return;

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const toggleInterest = (interest: string) => {
    // Normalize interest name by removing emoji
    const normalized = interest.split(' ').slice(1).join(' ');
    setSelectedInterests(prev =>
      prev.includes(normalized) ? prev.filter(i => i !== normalized) : [...prev, normalized]
    );
  };

  const handleEnableLocationAndFinish = async () => {
    setIsRequestingLocation(true);
    try {
      // 1) Ask the browser for the user's current position
      const coords = await getBrowserLocation();

      // 2) Best-effort reverse geocode to city/state (okay to fail)
      let city: string | undefined;
      let state: string | undefined;
      try {
        const place = await reverseGeocode({ lat: coords.lat, lng: coords.lng, accuracy: coords.accuracy });
        city = place.city;
        state = place.state;
      } catch {
        // ignore reverse geocode failures
      }

      // 3) Save to localStorage so HomeScreen/App can read it immediately
      const loc: UserLocation = {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: coords.accuracy,
        city,
        state,
      };
      saveUserLocationToLocalStorage(loc, true);

      // 4) Finish onboarding
      onComplete({
        userType,
        interests: selectedInterests,
        locationEnabled: true,
      });
    } catch (err: any) {
      // User denied or error: allow continuing without location
      alert(err?.message || 'Location permission denied or failed. You can enable it later in settings.');
      saveUserLocationToLocalStorage({}, false);
      onComplete({
        userType,
        interests: selectedInterests,
        locationEnabled: false,
      });
    } finally {
      setIsRequestingLocation(false);
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
          {[1, 2, 3].map(s => (
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
                  userType === 'organizer' ? 'border-[#0066FF] bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl mb-1">Organizer</h3>
                    <p className="text-gray-600">
                      Create and manage fitness communities, host events, and grow your member base.
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                      userType === 'organizer' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'
                    }`}
                  >
                    {userType === 'organizer' && (
                      <svg viewBox="0 0 24 24" fill="none" className="text-white">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType('member')}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  userType === 'member' ? 'border-[#0066FF] bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#50E3C2] flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl mb-1">Member</h3>
                    <p className="text-gray-600">
                      Discover local fitness communities, join events, and connect with like-minded people.
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                      userType === 'member' ? 'border-[#0066FF] bg-[#0066FF]' : 'border-gray-300'
                    }`}
                  >
                    {userType === 'member' && (
                      <svg viewBox="0 0 24 24" fill="none" className="text-white">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
              {activityOptions.map(activity => {
                const normalized = activity.split(' ').slice(1).join(' ');
                return (
                  <button
                    key={activity}
                    onClick={() => toggleInterest(activity)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedInterests.includes(normalized)
                        ? 'border-[#0066FF] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">{activity.split(' ')[0]}</span>
                      <span className="text-sm">{normalized}</span>
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
            <p className="text-sm text-gray-500 max-w-sm">
              We’ll use your location to show relevant communities in your area. You can change this anytime in settings.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-6">
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 1 ? !userType : step === 2 ? selectedInterests.length === 0 : false}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-14 disabled:opacity-50"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleEnableLocationAndFinish}
              disabled={isRequestingLocation}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-14 disabled:opacity-50"
            >
              {isRequestingLocation ? 'Enabling...' : 'Enable Location & Continue'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
