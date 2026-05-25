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

import { supabase, isSupabaseConfigured } from './supabaseClient';

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
  const [supabaseUser, setSupabaseUser] = useState<any | null>(null);

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

  // Supabase Auth and Sync Effect
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const pullSupabaseData = async (user: any) => {
      setSupabaseUser(user);
      
      // 1. Fetch Profile Info
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      let finalProfile = dbProfile;
      if (!dbProfile) {
        // Build and insert a matching profile record dynamically
        const newProfile = {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'atleta_way',
          full_name: user.user_metadata?.full_name || 'Nuevo Atleta',
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
          bio: 'Nuevo atleta de la comunidad Wayness.',
          wpoints_balance: 500,
          total_calories: 0,
          total_workouts: 0,
          followers_count: 12,
          following_count: 18
        };
        const { error: insErr } = await supabase.from('profiles').insert([newProfile]);
        if (!insErr) {
          finalProfile = {
            id: newProfile.id,
            username: newProfile.username,
            fullName: newProfile.full_name,
            avatarUrl: newProfile.avatar_url,
            bio: newProfile.bio,
            wpointsBalance: newProfile.wpoints_balance,
            totalCalories: newProfile.total_calories,
            totalWorkouts: newProfile.total_workouts,
            followersCount: newProfile.followers_count,
            followingCount: newProfile.following_count,
            createdAt: new Date().toISOString()
          };
        }
      } else {
        // Map snake_case fields to camelCase
        finalProfile = {
          id: dbProfile.id,
          username: dbProfile.username,
          fullName: dbProfile.full_name,
          avatarUrl: dbProfile.avatar_url,
          bio: dbProfile.bio || '',
          wpointsBalance: dbProfile.wpoints_balance || 0,
          totalCalories: dbProfile.total_calories || 0,
          totalWorkouts: dbProfile.total_workouts || 0,
          followersCount: dbProfile.followers_count || 0,
          followingCount: dbProfile.following_count || 0,
          createdAt: dbProfile.created_at
        };
      }
      if (finalProfile) setProfile(finalProfile);

      // 2. Fetch logged-in user workouts
      const { data: dbWorkouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('workout_date', { ascending: false });
      
      if (dbWorkouts && dbWorkouts.length > 0) {
        setWorkouts(dbWorkouts.map((w: any) => ({
          id: w.id,
          userId: w.user_id,
          type: w.type,
          durationMinutes: w.duration_minutes,
          caloriesBurned: w.calories_burned,
          wpointsEarned: w.wpoints_earned,
          heartRateAvg: w.heart_rate_avg,
          distanceKm: w.distance_km ? parseFloat(w.distance_km) : undefined,
          notes: w.notes,
          workoutDate: w.workout_date
        })));
      }

      // 3. Fetch collective social feed
      const { data: dbPosts } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbPosts && dbPosts.length > 0) {
        setPosts(dbPosts.map((p: any) => ({
          id: p.id,
          userId: p.user_id,
          username: p.username,
          userAvatar: p.user_avatar,
          content: p.content,
          imageUrl: p.image_url || undefined,
          workoutId: p.workout_id || undefined,
          workoutDetails: p.workout_details || undefined,
          likesCount: p.likes_count,
          likedByMe: false,
          commentsCount: p.comments_count,
          createdAt: p.created_at
        })));
      }

      // 4. Fetch redemptions log
      const { data: dbRedemptions } = await supabase
        .from('redemptions')
        .select('*')
        .eq('user_id', user.id)
        .order('redeemed_at', { ascending: false });

      if (dbRedemptions && dbRedemptions.length > 0) {
        setRedemptions(dbRedemptions.map((r: any) => ({
          id: r.id,
          userId: r.user_id,
          rewardId: r.reward_id,
          rewardName: r.reward_name,
          rewardImageUrl: r.reward_image_url,
          wpointsSpent: r.wpoints_spent,
          status: r.status,
          discountCode: r.discount_code,
          emailSent: r.email_sent,
          redeemedAt: r.redeemed_at
        })));
      }
    };

    // Subscriptions to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        localStorage.setItem('wayness_is_logged', 'true');
        await pullSupabaseData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        localStorage.removeItem('wayness_is_logged');
        setSupabaseUser(null);
        setProfile(initialProfile);
      }
    });

    // Run direct active session check on boot
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        pullSupabaseData(session.user);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Track state in local storage whenever key components change as fallback
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

  // Auth Callbacks (Local / Supabase unified handler)
  const handleLoginSuccess = async (email: string, usernameStr: string, fullNameStr: string, supabaseUserObj?: any) => {
    if (supabaseUserObj) {
      setSupabaseUser(supabaseUserObj);
    }
    
    const freshUser: Profile = {
      ...profile,
      id: supabaseUserObj?.id || CURRENT_USER_ID,
      fullName: fullNameStr || 'Carlos Gómez',
      username: usernameStr || 'atleta_way',
    };
    setProfile(freshUser);
    setIsLoggedIn(true);
    localStorage.setItem('wayness_is_logged', 'true');
    setActiveTab('feed');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    localStorage.removeItem('wayness_is_logged');
    setSupabaseUser(null);
    setProfile(initialProfile);
  };

  // Workout Registry callbacks (triggers database and real-time syncing)
  const handleAddWorkout = async (workoutData: Omit<Workout, 'id' | 'userId' | 'workoutDate'>) => {
    const newId = `w_spawn_${Date.now()}`;
    const targetUserId = supabaseUser?.id || CURRENT_USER_ID;

    const newWorkout: Workout = {
      ...workoutData,
      id: newId,
      userId: targetUserId,
      workoutDate: new Date().toISOString()
    };

    // Update workouts logs state
    setWorkouts([newWorkout, ...workouts]);

    // Update user balance state
    const claimWPoints = workoutData.wpointsEarned;
    const additionalCalories = workoutData.caloriesBurned;
    
    setProfile((prev) => ({
      ...prev,
      wpointsBalance: prev.wpointsBalance + claimWPoints,
      totalCalories: prev.totalCalories + additionalCalories,
      totalWorkouts: prev.totalWorkouts + 1
    }));

    // Perform DB Sync
    if (isSupabaseConfigured && supabase && supabaseUser) {
      try {
        await supabase.from('workouts').insert([{
          user_id: supabaseUser.id,
          type: workoutData.type,
          duration_minutes: workoutData.durationMinutes,
          calories_burned: workoutData.caloriesBurned,
          wpoints_earned: workoutData.wpointsEarned,
          heart_rate_avg: workoutData.heartRateAvg,
          distance_km: workoutData.distanceKm,
          notes: workoutData.notes
        }]);

        await supabase.from('profiles').update({
          wpoints_balance: profile.wpointsBalance + claimWPoints,
          total_calories: profile.totalCalories + additionalCalories,
          total_workouts: profile.totalWorkouts + 1
        }).eq('id', supabaseUser.id);
      } catch (err) {
        console.error('Error syncing workout details to Supabase:', err);
      }
    }

    // Auto trigger a Social Post link to feed
    const newPostId = `post_spawn_${Date.now()}`;
    const newPost: Post = {
      id: newPostId,
      userId: targetUserId,
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

    if (isSupabaseConfigured && supabase && supabaseUser) {
      try {
        await supabase.from('posts').insert([{
          user_id: supabaseUser.id,
          username: profile.username,
          user_avatar: profile.avatarUrl,
          content: newPost.content,
          workout_id: null, // can be linked later as uuid
          workout_details: newPost.workoutDetails,
          likes_count: 0,
          comments_count: 0
        }]);
      } catch (err) {
        console.error('Error syncing social post to Supabase:', err);
      }
    }

    // Spawn a congrats Notification in app
    const notId = `notification_spawn_${Date.now()}`;
    const notDescription: Notification = {
      id: notId,
      userId: targetUserId,
      type: 'reward',
      title: '¡Esfuerzo Recompensado Google Health!',
      content: `Sumaste +${claimWPoints} WPoints a tu balance. ¡Tu total actual es de ${(profile.wpointsBalance + claimWPoints).toLocaleString()} WP!`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([notDescription, ...notifications]);
  };

  // Social feed action handlers
  const handleAddPost = async (content: string, imageUrl?: string, workoutId?: string) => {
    const linkedWorkout = workouts.find((w) => w.id === workoutId);
    const targetUserId = supabaseUser?.id || CURRENT_USER_ID;
    
    const newPost: Post = {
      id: `post_type_${Date.now()}`,
      userId: targetUserId,
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

    if (isSupabaseConfigured && supabase && supabaseUser) {
      try {
        await supabase.from('posts').insert([{
          user_id: supabaseUser.id,
          username: profile.username,
          user_avatar: profile.avatarUrl,
          content: content,
          image_url: imageUrl,
          workout_details: newPost.workoutDetails
        }]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const likedByMe = !post.likedByMe;
          const likesCount = likedByMe ? post.likesCount + 1 : post.likesCount - 1;
          
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
      userId: supabaseUser?.id || CURRENT_USER_ID,
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
  const handleRedeemReward = async (reward: Reward, discountCode: string) => {
    const targetUserId = supabaseUser?.id || CURRENT_USER_ID;

    // Subtract points balance
    setProfile((prev) => ({
      ...prev,
      wpointsBalance: prev.wpointsBalance - reward.wpointsCost
    }));

    // Register receipt ticket
    const newRedemption: Redemption = {
      id: `red_${Date.now()}`,
      userId: targetUserId,
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

    if (isSupabaseConfigured && supabase && supabaseUser) {
      try {
        await supabase.from('redemptions').insert([{
          user_id: supabaseUser.id,
          reward_id: reward.id,
          reward_name: reward.name,
          reward_image_url: reward.imageUrl,
          wpoints_spent: reward.wpointsCost,
          discount_code: discountCode
        }]);

        await supabase.from('profiles').update({
          wpoints_balance: profile.wpointsBalance - reward.wpointsCost
        }).eq('id', supabaseUser.id);
      } catch (err) {
        console.error(err);
      }
    }

    // Spawn redemption notification rule
    const not: Notification = {
      id: `not_red_${Date.now()}`,
      userId: targetUserId,
      type: 'reward',
      title: 'Canje Aprobado',
      content: `¡Tu cupón de canje para ${reward.name} ha sido generado con éxito! Revisa tu correo o historial de canjes.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([not, ...notifications]);
  };

  // Profile data updates
  const handleUpdateBio = async (newBio: string) => {
    setProfile((prev) => ({
      ...prev,
      bio: newBio
    }));

    if (isSupabaseConfigured && supabase && supabaseUser) {
      try {
        await supabase.from('profiles').update({ bio: newBio }).eq('id', supabaseUser.id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateFullProfile = async (fullName: string, username: string, avatarUrl: string) => {
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
            onSyncGoogleHealth={handleAddWorkout}
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
