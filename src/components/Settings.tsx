import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Shield, User, Heart, Smartphone, Lock, Check, Mail, Bell, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Profile } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { fetchGoogleHealthData } from '../utils/googleHealth';

interface SettingsProps {
  profile: Profile;
  onUpdateFullProfile: (fullName: string, username: string, avatarUrl: string) => void;
  onSyncGoogleHealth: (syncedWorkout: { 
    type: string; 
    durationMinutes: number; 
    caloriesBurned: number; 
    wpointsEarned: number; 
    heartRateAvg: number; 
    notes: string; 
  }) => void;
}

export default function SettingsComponent({ profile, onUpdateFullProfile, onSyncGoogleHealth }: SettingsProps) {
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

  // Wearable connection states
  const [isAppleHealthConnected, setIsAppleHealthConnected] = useState(false);
  const [isGarminConnected, setIsGarminConnected] = useState(false);
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);

  // Google Health Sync state
  const [isGoogleHealthConnected, setIsGoogleHealthConnected] = useState(() => {
    return localStorage.getItem('wayness_google_fit_connected') === 'true';
  });
  const [googleSessionToken, setGoogleSessionToken] = useState<string | null>(null);
  const [isSyncingHealth, setIsSyncingHealth] = useState(false);
  const [latestHealthSyncResult, setLatestHealthSyncResult] = useState<any | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Load Google provider token if logged in with Supabase Google OAuth
  useEffect(() => {
    const fetchSupabaseSession = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const token = data.session.provider_token;
          if (token) {
            setGoogleSessionToken(token);
            setIsGoogleHealthConnected(true);
            localStorage.setItem('wayness_google_fit_connected', 'true');
          }
        }
      }
    };
    fetchSupabaseSession();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              full_name: fullName,
              username,
              avatar_url: avatarUrl,
            });

          if (error) throw error;
        }
      } catch (err: any) {
        setMessage(`Error Supabase DB: ${err.message}`);
        setTimeout(() => setMessage(null), 4000);
        return;
      }
    }

    onUpdateFullProfile(fullName, username, avatarUrl);
    setMessage('Perfil actualizado exitosamente');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordMessage('Las contraseñas no coinciden');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw error;
        setPasswordMessage('Contraseña cambiada exitosamente en Supabase Auth');
      } catch (err: any) {
        setPasswordMessage(`Error: ${err.message}`);
      }
    } else {
      setPasswordMessage('Contraseña cambiada exitosamente (Simulador local)');
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(null), 4500);
  };

  const handleConnectGoogleHealth = async () => {
    if (isGoogleHealthConnected) {
      // Toggle off
      setIsGoogleHealthConnected(false);
      localStorage.removeItem('wayness_google_fit_connected');
      setLatestHealthSyncResult(null);
      return;
    }

    setIsSyncingHealth(true);
    // Simulate active authorization scope modal if not connected via Supabase yet
    setTimeout(() => {
      setIsGoogleHealthConnected(true);
      localStorage.setItem('wayness_google_fit_connected', 'true');
      setIsSyncingHealth(false);
      setMessage('¡Sincronización con Google Health habilitada correctamente!');
      setTimeout(() => setMessage(null), 3500);
    }, 1200);
  };

  const handleSyncGoogleHealthNow = async () => {
    setIsSyncingHealth(true);
    setLatestHealthSyncResult(null);

    try {
      // Fetches real telemetry from Google Fit (or loads ultra high-realism fallback data if session is simulated)
      const healthResult = await fetchGoogleHealthData(googleSessionToken);
      
      setTimeout(() => {
        setLatestHealthSyncResult(healthResult);
        setIsSyncingHealth(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSyncingHealth(false);
    }
  };

  const handleImportWorkout = () => {
    if (!latestHealthSyncResult) return;

    // Calculate calories, heart rate, and wpoints automatically
    const cal = latestHealthSyncResult.calories;
    const bpm = latestHealthSyncResult.avgHeartRate;
    const steps = latestHealthSyncResult.steps;
    
    // Formula: 4 points min, scale with higher active heart rate (red/orange zones)
    let multiplier = 1;
    if (bpm > 140) multiplier = 1.8;
    else if (bpm > 120) multiplier = 1.4;
    else if (bpm > 100) multiplier = 1.2;

    const activeMinutes = 45; // default dynamic duration
    const wpoints = Math.round((activeMinutes * 4) * multiplier);

    onSyncGoogleHealth({
      type: 'Trote Fitbit / Run',
      durationMinutes: activeMinutes,
      caloriesBurned: cal,
      wpointsEarned: wpoints,
      heartRateAvg: bpm,
      notes: `🚶‍♂️ Sincronización exitosa con Google Health. ¡Registré ${steps.toLocaleString()} pasos y un promedio de ${bpm} BPM a nivel coronario! 🔥`
    });

    setMessage(`¡Entrenamiento de Google Fit importado! Sumaste +${wpoints} WPoints.`);
    setLatestHealthSyncResult(null);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Title */}
      <div className="flex items-center space-x-3 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-gray-950 font-sans tracking-tight">Sincronización & Configuración</h2>
          <p className="text-xs text-gray-400 font-bold">Configura tus credenciales reales de Supabase, cuenta y pide permisos para Google Health.</p>
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Nombre de Usuario (@)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white font-bold"
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
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-white shadow-sm cursor-pointer transition-all"
              >
                Actualizar Perfil
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-pink-500" /> Seguridad y Clave
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

        {/* Right segment: Wearables, Notifications, Google Health Connection */}
        <div className="space-y-6">
          {/* Google Health Integration */}
          <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-3xl p-6 shadow-md space-y-4 border border-purple-500/20">
            <h3 className="font-extrabold text-sm text-purple-300 uppercase tracking-wider border-b border-purple-900/40 pb-2 flex items-center gap-1.5 font-sans">
              <Heart className="w-4 h-4 text-pink-400" /> Sincronía Google Health
            </h3>
            
            <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
              Solicita autorización biométrica a Google Fit para importar tus pasos, calorías quemadas y promedios de ritmo cardíaco:
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-900/35 border border-purple-500/10">
              <div>
                <span className="text-xs font-bold text-gray-100 block">Google Health Portal</span>
                <span className="text-[9px] text-purple-300 font-bold">Google Fit REST integration</span>
              </div>
              <button
                onClick={handleConnectGoogleHealth}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider transition-all duration-300 ${
                  isGoogleHealthConnected
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white hover:bg-gray-100 text-slate-900'
                }`}
              >
                {isGoogleHealthConnected ? 'PERMISO AUTORIZADO ✓' : 'DAR PERMISO'}
              </button>
            </div>

            {isGoogleHealthConnected && (
              <div className="pt-2 space-y-3 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={handleSyncGoogleHealthNow}
                  disabled={isSyncingHealth}
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 active:scale-95 text-xs text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none"
                >
                  {isSyncingHealth ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      Sincronizando con Google Fit API...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Sincronizar Datos Biométricos
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {latestHealthSyncResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-3 bg-purple-900/30 border border-purple-500/20 rounded-xl space-y-2.5 text-[11px]"
                    >
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Check className="w-4 h-4" />
                        <span>¡Datos cargados con éxito!</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center text-gray-200 mt-1">
                        <div className="bg-purple-950/50 p-1.5 rounded-lg border border-purple-500/5">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Pasos</p>
                          <p className="font-mono font-extrabold text-[12px] text-white underline decoration-pink-500">{latestHealthSyncResult.steps.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-950/50 p-1.5 rounded-lg border border-purple-500/5">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Calorías</p>
                          <p className="font-mono font-extrabold text-[12px] text-white text-orange-400">{latestHealthSyncResult.calories} kcal</p>
                        </div>
                        <div className="bg-purple-950/50 p-1.5 rounded-lg border border-purple-500/5">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">Ritmo</p>
                          <p className="font-mono font-extrabold text-[12px] text-pink-400">{latestHealthSyncResult.avgHeartRate} BPM</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-purple-300 italic font-semibold text-center border-t border-purple-500/10 pt-2 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Fuente: {latestHealthSyncResult.source === 'google_fit_api' ? 'Google Fit REST API Direct' : 'Simulador Telemetría Google'}
                      </div>

                      <button
                        type="button"
                        onClick={handleImportWorkout}
                        className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold py-2 px-3 rounded-lg text-xs hover:opacity-95 transition-all text-center"
                      >
                        ⚡ Importar y Guardar como Entrenamiento
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Other wearables */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-pink-500" /> Otros Wearables
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">Sincroniza otros dispositivos para mayor compatibilidad:</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-150">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">🍏</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Apple Health</span>
                    <span className="text-[9px] text-gray-400 font-bold font-mono">iPhone / Watch</span>
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
                    <span className="text-[9px] text-gray-400 font-bold font-mono">Forerunner y Garmin devices</span>
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
                    <span className="text-xs font-bold text-gray-900 block">Fitbit Platform</span>
                    <span className="text-[9px] text-gray-400 font-bold font-mono">Google Fitbit accounts</span>
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
          </div>

          {/* Preferencias Notif */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-purple-600" /> Preferencias Notif.
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-gray-800 block">Me gusta</label>
                  <span className="text-[10px] text-gray-400 font-bold">Feedback cuando me den like</span>
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
                  <span className="text-[10px] text-gray-400 font-bold">Feedback al recibir comentarios</span>
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
                  <label className="text-xs font-bold text-gray-800 block">Seguidores</label>
                  <span className="text-[10px] text-gray-400 font-bold">Avisame cuando atletas me sigan</span>
                </div>
                <input
                  type="checkbox"
                  checked={followsNotif}
                  onChange={(e) => setFollowsNotif(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
