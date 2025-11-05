import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Settings, LogOut, ChevronRight, User, Bell, Shield, CreditCard, HelpCircle, CheckCircle, X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';

interface ProfileScreenProps {
  onBack: () => void;
  userType: string;
  userEmail?: string;
  userName?: string;
  authMethod?: 'google' | 'apple' | 'email';
  currentInterests?: string[];
  onUpdateInterests?: (interests: string[]) => void;
  onLogout?: () => void;
}

const activityOptions = [
  'Running',
  'Yoga',
  'Pickleball',
  'Cycling',
  'Soccer',
  'Basketball',
  'CrossFit',
  'Boxing',
  'Swimming',
  'Hiking',
  'Volleyball',
  'Other'
];

const mockStats = {
  communitiesJoined: 3,
  eventsAttended: 24,
  activityPoints: 680,
  streak: 7
};

export function ProfileScreen({ onBack, userType, userEmail, userName, authMethod, currentInterests = [], onUpdateInterests, onLogout }: ProfileScreenProps) {
  const displayName = userName || 'FitClub Member';
  const displayEmail = userEmail || 'member@fitclub.com';
  const memberSince = 'November 2025';
  
  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  
  // Edit Profile form state
  const [editName, setEditName] = useState(displayName);
  const [editLocation, setEditLocation] = useState('San Francisco, CA');
  const [editBio, setEditBio] = useState('Fitness enthusiast and community builder');
  
  // Interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentInterests);
  
  // Notification preferences
  const [notifSettings, setNotifSettings] = useState({
    eventReminders: true,
    newEvents: true,
    communityUpdates: true,
    messages: true,
    weeklyDigest: false,
    pushNotifications: true,
    emailNotifications: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showActivity: true,
    allowMessages: true,
    shareLocation: true,
    showInSearch: true
  });
  
  // Payment/Stripe state
  const [stripeConnected, setStripeConnected] = useState(userType === 'organizer' ? false : true);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: '2', type: 'mastercard', last4: '8888', expiry: '06/26', isDefault: false }
  ]);
  
  // App preferences
  const [preferences, setPreferences] = useState(() => {
    // Load from localStorage on mount
    try {
      const saved = localStorage.getItem('fitclub_preferences');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
    return {
      darkMode: false,
      compactView: false,
      autoPlayVideos: false,
      showDistance: true,
      defaultView: 'grid',
      language: 'en'
    };
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('fitclub_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [preferences]);
  
  const getAuthMethodLabel = () => {
    if (authMethod === 'google') return 'Google';
    if (authMethod === 'apple') return 'Apple';
    return 'Email';
  };

  const handleSaveProfile = () => {
    // Placeholder: Save profile changes
    console.log('Saving profile:', { editName, editLocation, editBio });
    setShowEditProfile(false);
  };

  const handleConnectStripe = () => {
    // Placeholder: Connect to Stripe
    console.log('Connecting to Stripe...');
    setTimeout(() => {
      setStripeConnected(true);
    }, 1000);
  };

  const handleDisconnectStripe = () => {
    // Placeholder: Disconnect Stripe
    console.log('Disconnecting Stripe...');
    setStripeConnected(false);
  };

  const handleAddPaymentMethod = () => {
    // Placeholder: Add payment method via Stripe
    console.log('Opening Stripe payment method setup...');
  };

  const handleRemovePaymentMethod = (id: string) => {
    // Placeholder: Remove payment method
    console.log('Removing payment method:', id);
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSaveInterests = () => {
    if (onUpdateInterests) {
      onUpdateInterests(selectedInterests);
    }
    setShowInterests(false);
  };

  const handleChangePassword = () => {
    // Placeholder: Change password flow
    console.log('Opening change password flow...');
    // In a real app, this would open a password reset flow
  };

  const handleTwoFactor = () => {
    // Placeholder: 2FA setup
    console.log('Opening 2FA setup...');
  };

  const handleDeleteAccount = () => {
    // Placeholder: Delete account flow
    console.log('Opening delete account confirmation...');
  };

  const handleForgotPassword = () => {
    // Placeholder: Forgot password flow
    console.log('Opening forgot password flow...');
  };

  const handleContactSupport = () => {
    // Placeholder: Open support contact
    console.log('Opening support contact...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0066FF] to-[#50E3C2] p-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setShowPreferences(true)} className="p-2 text-white">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <User className="w-10 h-10 text-[#0066FF]" />
          </div>
          <div className="flex-1 text-white">
            <h1 className="text-2xl mb-1">{displayName}</h1>
            <div className="text-sm opacity-90 mb-1">
              {displayEmail}
            </div>
            <div className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              <span>{editLocation}</span>
            </div>
            <div className="text-sm opacity-75 mt-1">
              {userType === 'organizer' ? 'Organizer' : 'Member'} since {memberSince}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-12 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm text-gray-600 mb-4">Activity Stats</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">{mockStats.communitiesJoined}</div>
              <div className="text-xs text-gray-600">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">{mockStats.eventsAttended}</div>
              <div className="text-xs text-gray-600">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">{mockStats.activityPoints}</div>
              <div className="text-xs text-gray-600">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">{mockStats.streak} 🔥</div>
              <div className="text-xs text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {/* Account Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <div className="text-sm">{displayEmail}</div>
              </div>
            </div>
            <div className="flex items-start justify-between pt-3 border-t border-gray-100">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Sign-in Method</div>
                <div className="text-sm">{getAuthMethodLabel()}</div>
              </div>
            </div>
            <div className="flex items-start justify-between pt-3 border-t border-gray-100">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Account Type</div>
                <div className="text-sm capitalize">{userType || 'Member'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <h3 className="text-sm text-gray-600 px-5 pt-5 pb-3">Settings</h3>
          
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowInterests(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="flex items-center gap-2">
                <span className="text-sm">Activity Interests</span>
                {selectedInterests.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">{selectedInterests.length}</span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowPrivacy(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Privacy & Security</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowPayment(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm">Payment Methods</span>
                {stripeConnected && userType === 'organizer' && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Connected</span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Support */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <h3 className="text-sm text-gray-600 px-5 pt-5 pb-3">Support</h3>
          
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Help Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => setShowPreferences(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm">App Preferences</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Log Out */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-500">Log Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Location</label>
                <div className="relative">
                  <Input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                  />
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full h-24 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none resize-none"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-12"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Notifications</h2>
              <button onClick={() => setShowNotifications(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="text-sm mb-1">Event Reminders</div>
                  <div className="text-xs text-gray-500">Get notified before your events start</div>
                </div>
                <Switch
                  checked={notifSettings.eventReminders}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, eventReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">New Events</div>
                  <div className="text-xs text-gray-500">New events from your communities</div>
                </div>
                <Switch
                  checked={notifSettings.newEvents}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, newEvents: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Community Updates</div>
                  <div className="text-xs text-gray-500">Updates from organizers</div>
                </div>
                <Switch
                  checked={notifSettings.communityUpdates}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, communityUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Messages</div>
                  <div className="text-xs text-gray-500">Direct messages from members</div>
                </div>
                <Switch
                  checked={notifSettings.messages}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, messages: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Weekly Digest</div>
                  <div className="text-xs text-gray-500">Weekly summary of your activity</div>
                </div>
                <Switch
                  checked={notifSettings.weeklyDigest}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, weeklyDigest: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Push Notifications</div>
                  <div className="text-xs text-gray-500">Enable mobile push notifications</div>
                </div>
                <Switch
                  checked={notifSettings.pushNotifications}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Email Notifications</div>
                  <div className="text-xs text-gray-500">Receive emails for updates</div>
                </div>
                <Switch
                  checked={notifSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotifSettings({ ...notifSettings, emailNotifications: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Security Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Privacy & Security</h2>
              <button onClick={() => setShowPrivacy(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="text-sm mb-1">Profile Visibility</div>
                  <div className="text-xs text-gray-500">Allow others to see your profile</div>
                </div>
                <Switch
                  checked={privacySettings.profileVisible}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, profileVisible: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Show Activity</div>
                  <div className="text-xs text-gray-500">Display your activity publicly</div>
                </div>
                <Switch
                  checked={privacySettings.showActivity}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showActivity: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Allow Messages</div>
                  <div className="text-xs text-gray-500">Receive messages from community members</div>
                </div>
                <Switch
                  checked={privacySettings.allowMessages}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, allowMessages: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Share Location</div>
                  <div className="text-xs text-gray-500">Share your location with communities</div>
                </div>
                <Switch
                  checked={privacySettings.shareLocation}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, shareLocation: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Show in Search</div>
                  <div className="text-xs text-gray-500">Appear in community searches</div>
                </div>
                <Switch
                  checked={privacySettings.showInSearch}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showInSearch: checked })}
                />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-sm mb-3">Account Security</h3>
                <div className="space-y-2">
                  {authMethod === 'email' && (
                    <Button 
                      variant="outline" 
                      className="w-full rounded-full h-11 justify-start"
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full h-11 justify-start"
                    onClick={handleTwoFactor}
                  >
                    Two-Factor Authentication
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full h-11 justify-start text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Payment Methods</h2>
              <button onClick={() => setShowPayment(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Stripe Integration for Organizers */}
              {userType === 'organizer' && (
                <div className={`rounded-2xl p-4 mb-4 ${stripeConnected ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#635BFF">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      {stripeConnected ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm">Stripe Connected</h4>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-xs text-gray-700 mb-3">
                            Your Stripe account is connected and ready to receive payments.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="text-xs h-8 rounded-full"
                              onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Dashboard
                            </Button>
                            <Button
                              variant="outline"
                              className="text-xs h-8 rounded-full text-red-600 border-red-200 hover:bg-red-50"
                              onClick={handleDisconnectStripe}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="text-sm mb-2">Connect Stripe</h4>
                          <p className="text-xs text-gray-700 mb-3">
                            Connect your Stripe account to receive payments from paid events. Platform fee: 10-15%
                          </p>
                          <Button
                            onClick={handleConnectStripe}
                            className="bg-[#635BFF] hover:bg-[#0A2540] text-white rounded-full text-xs h-9"
                          >
                            Connect with Stripe
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods for Members */}
              {userType !== 'organizer' && (
                <>
                  <div className="mb-4">
                    <h3 className="text-sm text-gray-700 mb-3">Saved Payment Methods</h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                                <span className="text-white text-xs">****</span>
                              </div>
                              <div>
                                <div className="text-sm mb-1">
                                  {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.last4}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Expires {method.expiry}</span>
                                  {method.isDefault && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Default</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddPaymentMethod}
                    variant="outline"
                    className="w-full rounded-full h-11"
                  >
                    + Add Payment Method
                  </Button>
                </>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Payments are processed securely through Stripe. We never store your full card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Help Center</h2>
              <button onClick={() => setShowHelp(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="text-sm mb-1">Getting Started</div>
                <div className="text-xs text-gray-600">Learn the basics of FitClub</div>
              </button>

              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="text-sm mb-1">Finding Communities</div>
                <div className="text-xs text-gray-600">Discover and join local fitness groups</div>
              </button>

              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="text-sm mb-1">Managing Events</div>
                <div className="text-xs text-gray-600">Create and organize community events</div>
              </button>

              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="text-sm mb-1">Payment & Billing</div>
                <div className="text-xs text-gray-600">Questions about payments and fees</div>
              </button>

              <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="text-sm mb-1">Safety Guidelines</div>
                <div className="text-xs text-gray-600">Community safety and best practices</div>
              </button>

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-11"
                  onClick={handleContactSupport}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">App Preferences</h2>
              <button onClick={() => setShowPreferences(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="text-sm mb-1">Dark Mode</div>
                  <div className="text-xs text-gray-500">Use dark theme</div>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Compact View</div>
                  <div className="text-xs text-gray-500">Show more content on screen</div>
                </div>
                <Switch
                  checked={preferences.compactView}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Auto-play Videos</div>
                  <div className="text-xs text-gray-500">Automatically play community videos</div>
                </div>
                <Switch
                  checked={preferences.autoPlayVideos}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, autoPlayVideos: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="text-sm mb-1">Show Distance</div>
                  <div className="text-xs text-gray-500">Display distance to communities</div>
                </div>
                <Switch
                  checked={preferences.showDistance}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, showDistance: checked })}
                />
              </div>

              <div className="py-3 border-t border-gray-100">
                <label className="text-sm text-gray-700 mb-3 block">Default View</label>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => setPreferences({ ...preferences, defaultView: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none"
                >
                  <option value="map">Map View</option>
                  <option value="list">List View</option>
                  <option value="grid">Grid View</option>
                </select>
              </div>

              <div className="py-3 border-t border-gray-100">
                <label className="text-sm text-gray-700 mb-3 block">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 focus:border-[#0066FF] outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Interests Modal */}
      {showInterests && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">Activity Interests</h2>
              <button onClick={() => setShowInterests(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Select your favorite activities to see personalized community recommendations.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {activityOptions.map((activity) => {
                const isSelected = selectedInterests.includes(activity);
                return (
                  <button
                    key={activity}
                    onClick={() => toggleInterest(activity)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#0066FF] to-[#50E3C2] text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#0066FF]'
                    }`}
                  >
                    <div className="text-sm">{activity}</div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleSaveInterests}
              disabled={selectedInterests.length === 0}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full h-12 disabled:opacity-50"
            >
              Save Interests ({selectedInterests.length})
            </Button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <h2 className="text-xl mb-3">Log Out?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowLogoutConfirm(false)}
                variant="outline"
                className="flex-1 rounded-full h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="flex-1 rounded-full h-11 bg-red-500 hover:bg-red-600 text-white"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
