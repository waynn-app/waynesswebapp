import { Bell, CheckCheck, Heart, UserPlus, MessageSquare, Gift, Trash2 } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export default function Notifications({ notifications, onMarkRead, onMarkAllRead, onClearAll }: NotificationsProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-fuchsia-600" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-28">
      {/* Dynamic Title action banner */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg text-gray-950 font-sans tracking-tight">Notificaciones</h2>
          <p className="text-xs text-gray-500">Mantente al tanto de la actividad y confirmaciones de canjes.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center space-x-2 shrink-0">
            {unreadCount > 0 && (
              <button
                id="noti-read-all"
                onClick={onMarkAllRead}
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 text-purple-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer leading-none"
              >
                <CheckCheck className="w-4 h-4" /> Marcar Leídas
              </button>
            )}
            <button
              id="noti-clear-all"
              onClick={onClearAll}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer leading-none"
            >
              <Trash2 className="w-4 h-4" /> Limpiar Todo
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-400 font-medium text-xs">
          No tienes notificaciones pendientes. ¡Comparte tus entrenamientos para socializar!
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((not) => (
            <div
              key={not.id}
              onClick={() => onMarkRead(not.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 relative overflow-hidden ${
                not.isRead
                  ? 'bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-105/50 hover:bg-gray-50'
                  : 'bg-white border-purple-200 text-gray-950 hover:border-purple-300 shadow-sm'
              }`}
            >
              {/* Left glow identifier for unread status */}
              {!not.isRead && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-t from-purple-500 to-pink-500" />
              )}

              {/* Icon marker */}
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                {getIcon(not.type)}
              </div>

              {/* Notification body contents */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-extrabold text-sm text-gray-900">{not.title}</h4>
                  <span className="text-[9px] text-gray-400 font-mono font-bold">
                    {new Date(not.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-normal font-medium">{not.content}</p>
              </div>

              {/* Optional pending indicator bullet */}
              {!not.isRead && (
                <div className="w-2 h-2 rounded-full bg-purple-600 shrink-0 self-center animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
