import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Dumbbell, Award, Flame, UserPlus, UserCheck, MessageSquare, FlameKindling, Map, Heart, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Profile, Workout, Post } from '../types';

interface UserProfileProps {
  profile: Profile;
  workouts: Workout[];
  posts: Post[];
  onUpdateBio: (newBio: string) => void;
}

export default function UserProfile({ profile, workouts, posts, onUpdateBio }: UserProfileProps) {
  const [activeSegmentTab, setActiveSegmentTab] = useState<'posts' | 'history'>('history');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersOffset, setFollowersOffset] = useState(0);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  const [tempBio, setTempBio] = useState(profile.bio);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersOffset(followersOffset - 1);
    } else {
      setIsFollowing(true);
      setFollowersOffset(followersOffset + 1);
    }
  };

  const handleUpdateBio = () => {
    onUpdateBio(tempBio);
    setIsEditingBio(false);
  };

  const toggleWorkoutExpand = (id: string) => {
    setExpandedWorkoutId(expandedWorkoutId === id ? null : id);
  };

  const myPosts = posts.filter(p => p.username === profile.username || p.userId === 'user_current_wayness');

  return (
    <div className="space-y-6 pb-28">
      {/* Cover picture card & Profile header */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-40 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 relative">
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-150 text-[10px] font-bold font-mono tracking-widest text-purple-700 uppercase shadow-sm">
            ATLETA VERIFICADO
          </div>
        </div>

        {/* Profile info block slider */}
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white relative z-10 bg-gray-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 z-10">
              <h3 className="text-2xl font-black text-gray-950">{profile.fullName}</h3>
              <p className="text-xs text-purple-600 font-mono font-bold uppercase tracking-wider">@{profile.username}</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 shrink-0">
            <button
              onClick={handleFollowToggle}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-sm ${
                isFollowing
                  ? 'bg-purple-50 border border-purple-200 text-purple-700 font-extrabold'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-95'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" /> Siguiendo
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Seguir
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Bio text block */}
          <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl relative space-y-2">
            {!isEditingBio ? (
              <>
                <p className="text-xs text-gray-600 leading-relaxed italic font-medium">
                  "{profile.bio}"
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-[10px] text-purple-600 font-bold hover:underline cursor-pointer"
                >
                  [ Editar biografía ]
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-purple-300"
                  rows={2}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdateBio}
                    className="px-3 py-1 bg-purple-600 text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-purple-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Social and Platform aggregates stats counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-center">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">SEGUIDORES</span>
              <span className="text-lg font-black font-mono text-gray-900 mt-1 block">
                {(profile.followersCount + followersOffset).toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-center">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">SIGUIENDO</span>
              <span className="text-lg font-black font-mono text-gray-900 mt-1 block">
                {profile.followingCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-center">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">SESIONES</span>
              <span className="text-lg font-black font-mono text-purple-600 mt-1 block">
                {workouts.length.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 text-center">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">WPOINTS</span>
              <span className="text-lg font-black font-mono text-pink-600 mt-1 block">
                {profile.wpointsBalance.toLocaleString()} WP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Segment tabs Selector */}
      <div className="flex border-b border-gray-150/80">
        <button
          onClick={() => setActiveSegmentTab('history')}
          className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer border-b-2 text-center ${
            activeSegmentTab === 'history'
              ? 'text-purple-700 border-purple-500 bg-purple-50/10 font-extrabold font-bold'
              : 'text-gray-400 border-transparent hover:text-gray-750 hover:text-gray-800'
          }`}
        >
          Historial de Entrenamientos
        </button>
        <button
          onClick={() => setActiveSegmentTab('posts')}
          className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer border-b-2 text-center ${
            activeSegmentTab === 'posts'
              ? 'text-purple-700 border-purple-500 bg-purple-50/10 font-extrabold font-bold'
              : 'text-gray-400 border-transparent hover:text-gray-750 hover:text-gray-800'
          }`}
        >
          Tus Publicaciones ({myPosts.length})
        </button>
      </div>

      {/* Content layout segment display */}
      <div className="space-y-4">
        {activeSegmentTab === 'history' && (
          <div className="space-y-3">
            {workouts.length === 0 ? (
              <div className="text-center py-12 text-gray-450 text-xs">
                No has registrado entrenamientos aún. Ve a 'Entrenar' para comenzar.
              </div>
            ) : (
              workouts.map((w) => {
                const isExpanded = expandedWorkoutId === w.id;
                return (
                  <div
                    key={w.id}
                    className="bg-white border border-gray-100 rounded-3xl p-5 hover:border-purple-200 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest flex items-center gap-1">
                            {w.type}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono font-bold">
                            ⏱️ {w.durationMinutes} minutos • 🔥 {w.caloriesBurned} kcal
                            {w.distanceKm ? ` • 📍 ${w.distanceKm} km` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-[9px] text-gray-400 block font-bold leading-none uppercase">PUNTOS</span>
                          <span className="text-xs font-extrabold font-mono text-purple-600 mt-1 block">+{w.wpointsEarned} WP</span>
                        </div>

                        {w.exercises && w.exercises.length > 0 && (
                          <button
                            onClick={() => toggleWorkoutExpand(w.id)}
                            className="p-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer bg-gray-50 rounded-lg border border-gray-150"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {w.notes && (
                      <p className="mt-3.5 text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg border border-gray-200 border-dashed">
                        📝 "{w.notes}"
                      </p>
                    )}

                    {/* Exercises expanded details rendering */}
                    {isExpanded && w.exercises && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 animate-fade-in">
                        <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Rutina Detallada:</p>
                        {w.exercises.map((item, index) => (
                           <div key={item.id || index} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-xl border border-gray-100/50">
                            <span className="text-gray-700 font-semibold">💪 {item.name}</span>
                            <span className="font-mono text-purple-600 font-bold">
                              {item.sets} sets × {item.reps} reps {item.weightKg ? `(${item.weightKg} Kg)` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeSegmentTab === 'posts' && (
          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-450 text-xs text-center">
                Aún no has publicado nada. Comparte tu actividad en la pestaña 'Feed'.
              </div>
            ) : (
              myPosts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="font-mono font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="text-[9px] text-fuchsia-600 font-black uppercase font-mono tracking-widest">Tú</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-normal font-medium">{post.content}</p>
                  
                  {post.workoutDetails && (
                    <div className="bg-gray-50 border border-gray-150/80 p-3 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
                          <Dumbbell className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900 uppercase">{post.workoutDetails.type}</h5>
                          <span className="text-[10px] text-gray-500">⏱️ {post.workoutDetails.durationMinutes} min • {post.workoutDetails.caloriesBurned} kcal</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-purple-600">+{post.workoutDetails.wpointsEarned} WP</span>
                    </div>
                  )}

                  {post.imageUrl && (
                    <div className="h-44 rounded-2xl overflow-hidden border border-gray-150 bg-gray-50">
                      <img src={post.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-2 font-bold">
                    <span>❤️ {post.likesCount} me gustas</span>
                    <span>💬 {post.commentsCount} comentarios</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
