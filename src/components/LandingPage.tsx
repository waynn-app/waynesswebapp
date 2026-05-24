import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Flame, Gift, Award, LogIn, Sparkles, UserPlus, HelpCircle } from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (email: string, username: string, fullName: string) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'none' | 'signin' | 'signup' | 'forgot'>('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    setError('');
    // Successful login transition
    onLoginSuccess(email, username || 'atleta_way', fullName || 'Carlos Gómez');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !username) {
      setError('Por favor llene todos los campos requeridos');
      return;
    }
    setError('');
    onLoginSuccess(email, username, fullName);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor introduce tu email');
      return;
    }
    setError('');
    setMessage('Se ha enviado un correo de recuperación a ' + email);
    setTimeout(() => {
      setMessage('');
      setAuthMode('signin');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-purple-200 overflow-x-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-100/30 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-pink-100/30 blur-[200px] rounded-full -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white tracking-widest text-lg shadow-sm">
              W
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider">
              Wayness
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              id="nav-btn-signin"
              onClick={() => setAuthMode('signin')}
              className="text-gray-600 hover:text-gray-950 font-bold text-sm transition-colors cursor-pointer"
            >
              Iniciar Sesión
            </button>
            <button
              id="nav-btn-signup"
              onClick={() => setAuthMode('signup')}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-95 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
            >
              Regístrate <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
            🔥 TU ESFUERZO TIENE VALOR
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-gray-950 text-balance">
            The best way to <br />
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-550 to-pink-500 bg-clip-text text-transparent">
              get what you really want
            </span>
          </h1>
          <p className="text-gray-550 text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
            Wayness es la plataforma que gamifica tu entrenamiento diario. Suda, quema calorías, 
            gana <span className="text-purple-600 font-extrabold font-mono">WPoints</span> y canjéalos directamente por tus videojuegos favoritos, suplementos premium y descuentos locales.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <button
              id="hero-start-btn"
              onClick={() => setAuthMode('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 hover:opacity-95 text-white font-bold tracking-wide shadow-sm transition-all text-center cursor-pointer active:scale-95"
            >
              Empezar Ahora - Es Gratis
            </button>
            <button
              id="hero-explore-btn"
              onClick={() => setAuthMode('signin')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-950 font-bold tracking-wide transition-all text-center cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              Demo de Acceso Directo <LogIn className="w-4 h-4 text-purple-600" />
            </button>
          </div>

          {/* Core Stats overview */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 pt-6 border-t border-gray-200">
            <div>
              <p className="font-extrabold text-2xl sm:text-3xl text-purple-600 font-mono">4 WPoints</p>
              <p className="text-xs text-gray-400 font-bold">Mínimo por minuto</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl sm:text-3xl text-pink-600 font-mono">$0 Mocks</p>
              <p className="text-xs text-gray-400 font-bold">Recompensas Reales</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl sm:text-3xl text-fuchsia-600 font-mono">100%</p>
              <p className="text-xs text-gray-400 font-bold">Gamificado</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-video rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1476440862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
            alt="Wayness Runners in action"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-150 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-900">Prueba Fitness de la Semana</h4>
              <p className="text-xs text-gray-500 font-medium">¡Registra un trote en Zona Roja (130+ bpm) y multiplica tus WPoints x1.5!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase bento */}
      <section className="bg-white border-t border-gray-100 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950">¿Cómo funciona Wayness?</h2>
            <p className="text-gray-500 font-medium text-base">Nuestra fórmula convierte los litros de sudor en códigos de canje legendarios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-150 space-y-4 hover:border-purple-200 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-950">1. Registra tu Actividad</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Inicia sesión y carga cualquier entrenamiento: running, ciclismo, gimnasio o yoga. Ingresa tu frecuencia cardíaca para activar el multiplicador de zonas.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-150 space-y-4 hover:border-pink-200 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-950">2. Gana WPoints</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                4-7 WPoints por minuto de acuerdo a la exigencia (Zona verde, naranja, roja o púrpura!).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-150 space-y-4 hover:border-fuchsia-200 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-500 group-hover:scale-105 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-950">3. Reclama Premios</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Canjea tus puntos por Riot Points de LoL, pases de batalla de Fortnite, botes de proteína y descuentos en cervezas. ¡Todo a tu email!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modals / Panel Overlay */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setAuthMode('none');
                setError('');
                setMessage('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-950 text-xl w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer font-bold"
            >
              &times;
            </button>

            {authMode === 'signin' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">Iniciar Sesión</h3>
                  <p className="text-xs text-gray-500 font-bold">Ingresa tus datos o usa un perfil demo</p>
                </div>

                {/* Demo Logins */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('waynessapp@gmail.com');
                      setPassword('demo1234');
                      setUsername('atleta_way');
                      setFullName('Carlos Gómez');
                    }}
                    className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    🚀 Rellenar con cuenta Demo (Carlos)
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-600">Contraseña</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-xs text-purple-600 hover:underline font-bold cursor-pointer"
                    >
                      ¿Olvidaste la clave?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-center font-bold">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 rounded-xl font-bold tracking-wide shadow-sm text-white hover:opacity-95 transition-all cursor-pointer"
                >
                  Continuar
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-450 font-bold">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setError('');
                      }}
                      className="text-purple-600 hover:underline font-extrabold cursor-pointer"
                    >
                      Regístrate
                    </button>
                  </p>
                </div>
              </form>
            )}

            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">Registro</h3>
                  <p className="text-xs text-gray-500 font-bold">Gana premios sudando. Crea tu perfil fitness.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Carlos Gómez"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Nombre de Usuario (@)</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="carlos_atleta"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carlos@correo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg text-center font-bold">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 rounded-xl font-bold tracking-wide shadow-sm text-white hover:opacity-95 transition-all cursor-pointer"
                >
                  Registrarme y Acceder
                </button>

                <div className="text-center">
                  <p className="text-xs text-gray-450 font-bold">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setError('');
                      }}
                      className="text-purple-600 hover:underline font-extrabold cursor-pointer"
                    >
                      Inicia Sesión
                    </button>
                  </p>
                </div>
              </form>
            )}

            {authMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">Olvidé Contraseña</h3>
                  <p className="text-xs text-gray-500 font-bold">Introduce tu email para enviarte un enlace de recuperación</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="atleta@correo.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                  />
                </div>

                {message && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center font-bold">
                    {message}
                  </p>
                )}

                {error && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-center font-bold">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gray-150 border border-gray-200 text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-bold tracking-wide transition-all cursor-pointer"
                >
                  Enviar Enlace
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setError('');
                    }}
                    className="text-xs text-gray-450 font-bold hover:text-gray-800 underline cursor-pointer"
                  >
                    Volver al login
                  </button>
                </div>
              </form>
            )}

            {/* Social Logins Divider */}
            <div className="relative my-6 text-center">
              <hr className="border-gray-200" />
              <span className="absolute bg-white px-3 text-xs text-gray-400 font-bold -top-2.5 left-1/2 -translate-x-1/2">
                O CONTINÚA CON
              </span>
            </div>

            {/* Social Logins simulated buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onLoginSuccess('google.user@gmail.com', 'google_user', 'Google User')}
                className="py-2 px-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-center text-xs text-gray-700 font-bold cursor-pointer transition-colors"
              >
                Google
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess('apple.user@apple.com', 'apple_user', 'Apple User')}
                className="py-2 px-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-center text-xs text-gray-700 font-bold cursor-pointer transition-colors"
              >
                Apple
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess('fb.user@facebook.com', 'facebook_user', 'FB User')}
                className="py-2 px-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-center text-xs text-gray-700 font-bold cursor-pointer transition-colors"
              >
                Facebook
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-xs">
        <p className="font-semibold text-gray-550">© 2026 Wayness Platform. Todos los derechos reservados. Tu sudor, tu divisa.</p>
        <p className="mt-2 text-gray-400 font-medium">Desarrollado de forma nativa e impulsado por tecnología gamificada.</p>
      </footer>
    </div>
  );
}
