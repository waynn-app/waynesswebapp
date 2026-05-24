import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Send, Plus, Dumbbell, Calendar, HelpCircle, Share2, Award, Zap, Camera } from 'lucide-react';
import { Post, Workout, Comment, Profile } from '../types';
import { activeStories } from '../mockData';

interface FeedProps {
  posts: Post[];
  workouts: Workout[];
  profile: Profile;
  onAddPost: (content: string, imageUrl?: string, workoutId?: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentContent: string) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80',
];

export default function Feed({ posts, workouts, profile, onAddPost, onLikePost, onAddComment }: FeedProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showImagePresets, setShowImagePresets] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [viewingStoryImage, setViewingStoryImage] = useState<string | null>(null);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedWorkoutId) return;
    onAddPost(newPostContent, selectedImage || undefined, selectedWorkoutId || undefined);
    setNewPostContent('');
    setSelectedWorkoutId('');
    setSelectedImage('');
    setShowImagePresets(false);
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;
    onAddComment(postId, commentText);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Dynamic Stories */}
      <div className="bg-white border border-gray-100 rounded-3xl p-4 overflow-x-auto scrollbar-none shadow-sm flex items-center space-x-4">
        {/* Your logged story creator */}
        <div className="flex flex-col items-center shrink-0 space-y-1">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt="Tu avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white border-2 border-white">
              <Plus className="w-3.5 h-3.5 font-bold" />
            </div>
          </div>
          <span className="text-[10px] text-gray-500 font-semibold">Tú</span>
        </div>

        {/* Other stories */}
        {activeStories.map((story) => (
          <button
            key={story.id}
            id={`story-btn-${story.id}`}
            onClick={() => story.active && setViewingStoryImage(story.image)}
            className="flex flex-col items-center shrink-0 space-y-1 cursor-pointer"
          >
            <div className={`p-[2.5px] rounded-full ${story.active ? 'bg-gradient-to-tr from-purple-500 via-fuchsia-400 to-pink-500' : 'bg-gray-250'}`}>
              <img
                src={story.avatar}
                alt={story.username}
                className="w-13 h-13 rounded-full object-cover border-2 border-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`text-[10px] font-semibold ${story.active ? 'text-gray-900' : 'text-gray-400'}`}>
              {story.username}
            </span>
          </button>
        ))}
      </div>

      {/* Post Creation form widget */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <div className="flex items-start space-x-3">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-10 h-10 rounded-full object-cover border border-purple-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <textarea
                placeholder="¡Comparte tus logros del día! ¿Cuánto has entrenado hoy?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-none text-sm text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Linked images info / workout linked */}
          {(selectedImage || selectedWorkoutId) && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {selectedImage && (
                <div className="relative group rounded-2xl overflow-hidden border border-gray-100 h-28 bg-gray-50">
                  <img src={selectedImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage('')}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black text-white text-xs flex items-center justify-center cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              )}

              {selectedWorkoutId && (() => {
                const w = workouts.find((item) => item.id === selectedWorkoutId);
                if (!w) return null;
                return (
                  <div className="relative group rounded-2xl p-3 border border-purple-200 bg-purple-50/50 h-28 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-purple-650">
                        <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5" /> {w.type}
                        </span>
                        <Zap className="w-3.5 h-3.5 animate-bounce" />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        ⏱️ {w.durationMinutes} min • 🔥 {w.caloriesBurned} kcal
                      </p>
                      <p className="text-[11px] text-purple-600 font-mono font-bold">
                        💎 +{w.wpointsEarned} WPoints!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedWorkoutId('')}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black text-white text-xs flex items-center justify-center cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Preset Images Drawer */}
          {showImagePresets && (
            <div className="bg-white p-3 rounded-2xl border border-gray-100 space-y-2">
              <p className="text-xs text-gray-700 font-semibold">Selecciona una imagen fondo de fitness:</p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_IMAGES.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`h-14 rounded-lg overflow-hidden border-2 cursor-pointer hover:brightness-110 transition-all ${
                      selectedImage === imgUrl ? 'border-purple-500 scale-95' : 'border-transparent'
                    }`}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex space-x-2">
              {/* Photo selector toggle */}
              <button
                type="button"
                onClick={() => setShowImagePresets(!showImagePresets)}
                className={`p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-gray-55 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  showImagePresets ? 'bg-purple-50 text-purple-600' : ''
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Foto Fitness</span>
              </button>

              {/* Workout linker selector */}
              {workouts.length > 0 && (
                <div className="relative group">
                  <select
                    value={selectedWorkoutId}
                    onChange={(e) => setSelectedWorkoutId(e.target.value)}
                    className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 text-center pr-8 focus:outline-none cursor-pointer focus:border-purple-400"
                  >
                    <option value="">🔗 Vincular Entrenamiento</option>
                    {workouts.slice(0, 5).map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.type} (+{w.wpointsEarned} WP) - {new Date(w.workoutDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-550">
                    <Dumbbell className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!newPostContent.trim() && !selectedWorkoutId}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-50 px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer text-white"
            >
              Publicar <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            id={`feed-post-${post.id}`}
            className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm shadow-gray-100/30"
          >
            {/* Header user */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-950">@{post.username}</h4>
                  <p className="text-[10px] text-gray-400 font-mono font-semibold">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content text */}
            <div className="px-5 pb-4">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Linked Workout details card panel */}
            {post.workoutDetails && (
              <div className="px-5 pb-4">
                <div className="bg-purple-50/40 border border-purple-100/60 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-650 shadow-inner">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-purple-700 uppercase tracking-widest flex items-center gap-1">
                        {post.workoutDetails.type} <Zap className="w-3.5 h-3.5" />
                      </h5>
                      <span className="text-[11px] text-gray-500 font-medium">
                        ⏱️ {post.workoutDetails.durationMinutes} min • 🔥 {post.workoutDetails.caloriesBurned} kcal
                        {post.workoutDetails.distanceKm ? ` • 📍 ${post.workoutDetails.distanceKm} km` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-right bg-white border border-purple-100 px-3 py-1.5 rounded-xl shadow-sm">
                    <span className="text-[9px] text-gray-400 block font-bold tracking-widest uppercase">PUNTOS</span>
                    <span className="text-sm font-black font-mono text-purple-650 tracking-wide">
                      +{post.workoutDetails.wpointsEarned} WP
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Optional post picture */}
            {post.imageUrl && (
              <div className="relative aspect-video bg-gray-50 overflow-hidden border-t border-b border-gray-100 animate-fade-in">
                <img src={post.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            {/* Reaction bar */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
              <div className="flex space-x-4">
                {/* Like Button */}
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    post.likedByMe 
                    ? 'text-pink-600 hover:text-pink-500' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.likedByMe ? 'fill-pink-500 text-pink-500' : ''}`} />
                  <span className="font-mono">{post.likesCount}</span>
                </button>

                <div className="flex items-center space-x-1.5 text-gray-400 p-1.5 text-xs font-semibold">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-mono">{post.commentsCount}</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 font-semibold gap-1.5 flex items-center">
                <Award className="w-3.5 h-3.5 text-purple-500" />
                <span>WAYNESS VERIFIED</span>
              </div>
            </div>

            {/* Comments List block */}
            <div className="bg-gray-50/40 p-5 space-y-4 border-t border-gray-100">
              <AnimatePresence>
                {post.comments && post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3 text-xs">
                    <img
                      src={comment.avatarUrl}
                      alt={comment.username}
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100/80 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-gray-950">@{comment.username}</span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-750 leading-normal">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </AnimatePresence>

              {/* Leave a Comment field form */}
              <form
                onSubmit={(e) => handleCommentSubmit(post.id, e)}
                className="flex items-center space-x-2 pt-2"
              >
                <input
                  type="text"
                  placeholder="Escribe un comentario amigable..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-purple-400 transition-colors text-gray-950"
                />
                <button
                  type="submit"
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Viewing full story placeholder modal overlay */}
      {viewingStoryImage && (
        <div
          onClick={() => setViewingStoryImage(null)}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-2"
        >
          <div className="relative max-w-sm w-full h-[80vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-850">
            <img src={viewingStoryImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Visualizando Historia</span>
              <button
                onClick={() => setViewingStoryImage(null)}
                className="text-white text-xl bg-slate-900/80 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-center text-xs text-slate-300">
              Presiona en cualquier lugar fuera para volver al feed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
