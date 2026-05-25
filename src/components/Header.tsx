import { Bell, Flame, Award, Settings, LogOut, AwardIcon } from 'lucide-react';
import { Profile, Notification } from '../types';

interface HeaderProps {
  profile: Profile;
  notifications: Notification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Header({ profile, notifications, activeTab, setActiveTab, onLogout }: HeaderProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-40 h-20 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <svg viewBox="0 0 512 512" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2005/svg">
              <rect x="74" y="211" width="20" height="90" rx="10" fill="currentColor" />
              <rect x="114" y="176" width="36" height="160" rx="18" fill="currentColor" />
              <rect x="174" y="144" width="46" height="190" rx="23" fill="currentColor" />
              <rect x="292" y="144" width="46" height="190" rx="23" fill="currentColor" />
              <rect x="233" y="210" width="46" height="124" rx="23" fill="currentColor" />
              <path d="M 174 250 L 338 250 L 338 312 C 338 358, 174 358, 174 312 Z" fill="currentColor" />
              <rect x="362" y="176" width="36" height="160" rx="18" fill="currentColor" />
              <rect x="418" y="211" width="20" height="90" rx="10" fill="currentColor" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl text-gray-900 uppercase tracking-tight block">
              Wayness
            </span>
            <span className="text-[10px] text-purple-600 font-mono tracking-wider uppercase block -mt-1 font-bold">
              Fitness Rewards
            </span>
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="flex items-center space-x-4">
          {/* Active streak */}
          <div className="hidden sm:flex items-center bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1.5 rounded-xl text-xs font-semibold gap-1.5 font-mono shadow-sm">
            <Flame className="w-4 h-4 fill-amber-500 animate-pulse text-amber-600" />
            <span>5 DÍAS POSTS</span>
          </div>

          {/* WPoints Balance Banner */}
          <div 
            onClick={() => setActiveTab('shop')}
            className="flex items-center bg-purple-50 hover:bg-purple-100/70 border border-purple-100 text-purple-700 px-4 py-1.5 rounded-2xl cursor-pointer transition-all font-semibold font-mono shadow-sm"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white mr-2.5 shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-purple-500/80 block -mb-0.5 leading-none font-bold uppercase tracking-wider">BALANCE</span>
              <span className="text-sm font-extrabold tracking-wide text-gray-950">
                {profile.wpointsBalance.toLocaleString()} WP
              </span>
            </div>
          </div>

          {/* Notifications Trigger */}
          <button
            id="notifications-bell"
            onClick={() => setActiveTab('notifications')}
            className={`p-2.5 rounded-xl border border-gray-100 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all relative cursor-pointer ${
              activeTab === 'notifications' ? 'bg-purple-50 text-purple-600 border-purple-100' : ''
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-mono text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile overview trigger */}
          <div 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 border border-gray-100 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${
              activeTab === 'profile' ? 'bg-purple-50 border-purple-100' : ''
            }`}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-7 h-7 rounded-lg object-cover border border-purple-500/20"
              referrerPolicy="no-referrer"
            />
            <span className="hidden md:inline font-bold text-xs text-gray-700">
              @{profile.username}
            </span>
          </div>

          {/* Settings icon */}
          <button
            id="header-settings-btn"
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl text-gray-400 hover:text-gray-900 transition-all cursor-pointer ${
              activeTab === 'settings' ? 'text-purple-600 bg-gray-100' : ''
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Log Out Button */}
          <button
            id="header-logout-btn"
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 transition-all cursor-pointer hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
