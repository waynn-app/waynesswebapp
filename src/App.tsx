import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Feed from './components/Feed';
import WorkoutTracker from './components/WorkoutTracker';
import RewardsShop from './components/RewardsShop';
import Statistics from './components/Statistics';
import UserProfile from './components/UserProfile';
import Notifications from './components/Notifications';
import SettingsComponent from './components/Settings';

import { 
  initialProfile, 
  initialWorkouts, 
  initialPosts, 
  initialRewards, 
  initialNotifications,
  CURRENT_USER_ID 
} from './mockData';
import { Profile, Workout, Post, Reward, Redemption, Notification } from './types';

export default function App() {
  // Session Authentication management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('wayness_is_logged') === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('feed');

  // Load and initialize persistent states or mock fallback
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('wayness_profile');
    if (saved) return JSON.parse(saved);
    return initialProfile;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('wayness_workouts');
    if (saved) return JSON.parse(saved);
    return initialWorkouts;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('wayness_posts');
    if (saved) return JSON.parse(saved);
    return initialPosts;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('wayness_rewards');
    if (saved) return JSON.parse(saved);
    return initialRewards;
  });

  const [redemptions, setRedemptions] = useState<Redemption[]>(() => {
    const saved = localStorage.getItem('wayness_redemptions');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('wayness_notifications');
    if (saved) return JSON.parse(saved);
    return initialNotifications;
  });

  // Track state in local storage whenever key components change
  useEffect(() => {
    localStorage.setItem('wayness_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('wayness_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('wayness_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('wayness_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('wayness_redemptions', JSON.stringify(redemptions));
  }, [redemptions]);

  useEffect(() => {
    localStorage.setItem('wayness_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Callbacks
  const handleLoginSuccess = (email: string, usernameStr: string, fullNameStr: string) => {
    const freshUser: Profile = {
      ...initialProfile,
      fullName: fullNameStr || 'Carlos Gómez',
      username: usernameStr || 'atleta_way',
    };
    setProfile(freshUser);
    setIsLoggedIn(true);
    localStorage.setItem('wayness_is_logged', 'true');
    setActiveTab('feed');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('wayness_is_logged');
  };

  // Workout Registry callbacks (triggers database simulation)
  const handleAddWorkout = (workoutData: Omit<Workout, 'id' | 'userId' | 'workoutDate'>) => {
    const newId = `w_spawn_${Date.now()}`;
    const newWorkout: Workout = {
      ...workoutData,
      id: newId,
      userId: CURRENT_USER_ID,
      workoutDate: new Date().toISOString()
    };

    // Update workouts logs
    setWorkouts([newWorkout, ...workouts]);

    // Update user balance and counts
    const claimWPoints = workoutData.wpointsEarned;
    const additionalCalories = workoutData.caloriesBurned;
    
    setProfile((prev) => ({
      ...prev,
      wpointsBalance: prev.wpointsBalance + claimWPoints,
      totalCalories: prev.totalCalories + additionalCalories,
      totalWorkouts: prev.totalWorkouts + 1
    }));

    // Auto trigger a Social Post link to feed
    const newPostId = `post_spawn_${Date.now()}`;
    const newPost: Post = {
      id: newPostId,
      userId: CURRENT_USER_ID,
      username: profile.username,
      userAvatar: profile.avatarUrl,
      content: workoutData.notes || `¡Acabo de registrar un entrenamiento de ${workoutData.type}! 🔥 Sintiéndome increíble y ganando recompensas de salud.`,
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      workoutId: newId,
      workoutDetails: {
        type: workoutData.type,
        durationMinutes: workoutData.durationMinutes,
        caloriesBurned: workoutData.caloriesBurned,
        wpointsEarned: workoutData.wpointsEarned,
        distanceKm: workoutData.distanceKm
      },
      createdAt: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);

    // Spawn a congrats Notification in app
    const notId = `notification_spawn_${Date.now()}`;
    const notDescription: Notification = {
      id: notId,
      userId: CURRENT_USER_ID,
      type: 'reward',
      title: '¡Esfuerzo Recompensado!',
      content: `Sumaste +${claimWPoints} WPoints a tu balance. ¡Tu total actual es de ${(profile.wpointsBalance + claimWPoints).toLocaleString()} WP!`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([notDescription, ...notifications]);
  };

  // Social feed action handlers
  const handleAddPost = (content: string, imageUrl?: string, workoutId?: string) => {
    const linkedWorkout = workouts.find((w) => w.id === workoutId);
    
    const newPost: Post = {
      id: `post_type_${Date.now()}`,
      userId: CURRENT_USER_ID,
      username: profile.username,
      userAvatar: profile.avatarUrl,
      content,
      imageUrl,
      workoutId,
      workoutDetails: linkedWorkout ? {
        type: linkedWorkout.type,
        durationMinutes: linkedWorkout.durationMinutes,
        caloriesBurned: linkedWorkout.caloriesBurned,
        wpointsEarned: linkedWorkout.wpointsEarned,
        distanceKm: linkedWorkout.distanceKm
      } : undefined,
      likesCount: 0,
      likedByMe: false,
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const likedByMe = !post.likedByMe;
          const likesCount = likedByMe ? post.likesCount + 1 : post.likesCount - 1;
          
          // Spawn notification if liked by someone else
          return {
            ...post,
            likesCount,
            likedByMe
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, commentContent: string) => {
    const newComment = {
      id: `c_spawn_${Date.now()}`,
      postId,
      userId: CURRENT_USER_ID,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      content: commentContent,
      createdAt: new Date().toISOString()
    };

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );
  };

  // Rewards shop redemptions
  const handleRedeemReward = (reward: Reward, discountCode: string) => {
    // Subtract points balance
    setProfile((prev) => ({
      ...prev,
      wpointsBalance: prev.wpointsBalance - reward.wpointsCost
    }));

    // Register receipt ticket
    const newRedemption: Redemption = {
      id: `red_${Date.now()}`,
      userId: CURRENT_USER_ID,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardImageUrl: reward.imageUrl,
      wpointsSpent: reward.wpointsCost,
      status: 'approved',
      discountCode,
      emailSent: true,
      redeemedAt: new Date().toISOString()
    };
    setRedemptions([newRedemption, ...redemptions]);

    // Spawn redemption notification rule
    const not: Notification = {
      id: `not_red_${Date.now()}`,
      userId: CURRENT_USER_ID,
      type: 'reward',
      title: 'Canje Aprobado',
      content: `¡Tu cupón de canje para ${reward.name} ha sido generado con éxito! Revisa tu correo o historial de canjes.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([not, ...notifications]);
  };

  // Profile data updates
  const handleUpdateBio = (newBio: string) => {
    setProfile((prev) => ({
      ...prev,
      bio: newBio
    }));
  };

  const handleUpdateFullProfile = (fullName: string, username: string, avatarUrl: string) => {
    setProfile((prev) => ({
      ...prev,
      fullName,
      username,
      avatarUrl
    }));
  };

  // Notification read setters
  const handleMarkRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Router layout
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <Feed
            posts={posts}
            workouts={workouts}
            profile={profile}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        );
      case 'workout':
        return <WorkoutTracker onAddWorkout={handleAddWorkout} />;
      case 'shop':
        return (
          <RewardsShop
            rewards={rewards}
            profile={profile}
            onRedeemReward={handleRedeemReward}
            redemptions={redemptions}
          />
        );
      case 'stats':
        return <Statistics workouts={workouts} />;
      case 'profile':
        return (
          <UserProfile
            profile={profile}
            workouts={workouts}
            posts={posts}
            onUpdateBio={handleUpdateBio}
          />
        );
      case 'notifications':
        return (
          <Notifications
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
          />
        );
      case 'settings':
        return (
          <SettingsComponent
            profile={profile}
            onUpdateFullProfile={handleUpdateFullProfile}
          />
        );
      default:
        return <p className="text-center p-10 text-xs">PÁGINA NO ENCONTRADA</p>;
    }
  };

  if (!isLoggedIn) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-950 font-sans selection:bg-purple-100 selection:text-purple-700 overflow-x-hidden relative flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-pink-600/5 blur-[200px] rounded-full -z-10" />

      <div>
        {/* Header App Shell with Balance */}
        <Header 
          profile={profile} 
          notifications={notifications} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Dynamic Inner Layout Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Bottom Floating Dock Nav */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadNotifications={notifications.filter((n) => !n.isRead).length}
      />
    </div>
  );
}
