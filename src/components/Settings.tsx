import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Shield, User, Heart, Smartphone, Lock, Check, Mail, Bell, Sparkles } from 'lucide-react';
import { Profile } from '../types';

interface SettingsProps {
  profile: Profile;
  onUpdateFullProfile: (fullName: string, username: string, avatarUrl: string) => void;
}

export default function SettingsComponent({ profile, onUpdateFullProfile }: SettingsProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [likesNotif, setLikesNotif] = useState(true);
  const [commentsNotif, setCommentsNotif] = useState(true);
  const [followsNotif, setFollowsNotif] = useState(true);
  const [weeklyDigestNotif, setWeeklyDigestNotif] = useState(false);

  // Wearable connection simulators
  const [isAppleHealthConnected, setIsAppleHealthConnected] = useState(false);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username) return;
    onUpdateFullProfile(fullName, username, avatarUrl);
    setMessage('Perfil actualizado exitosamente');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordMessage('Las contraseñas no coinciden');
      return;
    }
    setPasswordMessage('Contraseña cambiada exitosamente (Simulado)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Title */}
      <div className="flex items-center space-x-3 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-gray-950">Configuración General</h2>
          <p className="text-xs text-gray-500 font-medium">Modifica tus credenciales de accesibilidad, notificaciones y conexión con wearables.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Modification */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-600" /> Editar Cuenta Personal
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Nombre de Usuario (@)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Avatar URL (Foto de Perfil)</label>
                <input
                  type="text"
                  required
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white font-mono"
                />
              </div>

              {message && (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-center font-bold">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-white hover:opacity-95 shadow-sm cursor-pointer transition-all"
              >
                Actualizar Perfil
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-pink-500" /> Cambiar Contraseña
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">Contraseña Actual</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 8 de longitud"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Repita clave"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:bg-white"
                  />
                </div>
              </div>

              {passwordMessage && (
                <p className={`text-xs p-2.5 rounded-lg text-center font-bold border ${
                  passwordMessage.includes('exitosamente') 
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                  : 'text-rose-700 bg-rose-50 border-rose-200'
                }`}>
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                className="bg-gray-150 border border-gray-200 text-gray-750 hover:bg-gray-200 font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                Cambiar Clave
              </button>
            </form>
          </div>
        </div>

        {/* Right segment: Notifications and Future Dispositivos settings */}
        <div className="space-y-6">
          {/* Notifications config */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-purple-600" /> Preferencias Notif.
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-800 block">Me gusta</label>
                  <span className="text-[10px] text-gray-400 font-bold">Notificar cuando reaccionen a mi feed</span>
                </div>
                <input
                  type="checkbox"
                  checked={likesNotif}
                  onChange={(e) => setLikesNotif(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-800 block">Comentarios</label>
                  <span className="text-[10px] text-gray-400 font-bold">Notificar al recibir comentarios en mi feed</span>
                </div>
                <input
                  type="checkbox"
                  checked={commentsNotif}
                  onChange={(e) => setCommentsNotif(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-800 block">Nuevos Seguidores</label>
                  <span className="text-[10px] text-gray-400 font-bold">Avisarme cuando atletas me sigan</span>
                </div>
                <input
                  type="checkbox"
                  checked={followsNotif}
                  onChange={(e) => setFollowsNotif(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-800 block">Resumen Semanal</label>
                  <span className="text-[10px] text-gray-400 font-bold">Emails con estadísticas semanales y retos</span>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigestNotif}
                  onChange={(e) => setWeeklyDigestNotif(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Wearables integration simulations */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-pink-500" /> Dispositivos Sincrónicos
            </h3>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Conecta tus wearables fitness directamente para cargar calorías y BPM automáticamente:</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-150">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">🍏</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Apple Health</span>
                    <span className="text-[9px] text-gray-400 font-bold">iPhone / Apple Watch</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsAppleHealthConnected(!isAppleHealthConnected)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wide ${
                    isAppleHealthConnected 
                    ? 'bg-emerald-50 border border-emerald-250 text-emerald-700' 
                    : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {isAppleHealthConnected ? 'CONECTADO ✓' : 'CONECTAR'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-150">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">🚴‍♂️</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Garmin Connect</span>
                    <span className="text-[9px] text-gray-400 font-bold">Ciclocomputadores y Forerunner</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsGarminConnected(!isGarminConnected)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wide ${
                    isGarminConnected 
                    ? 'bg-emerald-50 border border-emerald-250 text-emerald-700' 
                    : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {isGarminConnected ? 'CONECTADO ✓' : 'CONECTAR'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-150">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">🔋</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Fitbit Connection</span>
                    <span className="text-[9px] text-gray-400 font-bold">Sincronización de sueño y pasos/BPM</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsFitbitConnected(!isFitbitConnected)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wide ${
                    isFitbitConnected 
                    ? 'bg-emerald-50 border border-emerald-250 text-emerald-700' 
                    : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {isFitbitConnected ? 'CONECTADO ✓' : 'CONECTAR'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-150 rounded-xl text-[10px] text-purple-600 flex items-center gap-1.5 leading-tight font-semibold">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Sincroniza tus dispositivos reales de forma nativa para obtener insignias exclusivas.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
