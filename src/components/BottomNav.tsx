import { Home, Flame, Gift, BarChart2, User, HelpCircle, Bell } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotifications: number;
}

export default function BottomNav({ activeTab, setActiveTab, unreadNotifications }: BottomNavProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'workout', label: 'Entrenar', icon: Flame, highlight: true },
    { id: 'shop', label: 'Tienda', icon: Gift },
    { id: 'stats', label: 'Estadísticas', icon: BarChart2 },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 md:bottom-5 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl w-full px-4 pb-2 md:pb-0 z-40 transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-lg border border-gray-100 md:rounded-2xl flex items-center justify-around py-3 px-6 shadow-xl shadow-gray-200/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.highlight) {
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center -translate-y-4 cursor-pointer scale-110 group`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 ${
                  isActive 
                  ? 'bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-purple-500/40' 
                  : 'bg-gray-50 border border-gray-150 text-purple-650 hover:bg-gray-100 shadow-gray-100/50 text-purple-650'
                }`}>
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-gray-700 font-sans tracking-wide mt-1.5 uppercase">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center p-2 text-gray-400 hover:text-gray-900 transition-all duration-250 cursor-pointer min-w-16"
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-purple-600' : 'hover:scale-105'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide font-sans mt-1 uppercase ${isActive ? 'text-purple-600 font-black' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {item.id === 'feed' && unreadNotifications > 0 && (
                <span className="absolute top-2 right-4 bg-purple-600 w-1.5 h-1.5 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
