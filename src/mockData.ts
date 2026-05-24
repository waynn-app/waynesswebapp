import { Profile, Workout, Post, Reward, Notification } from './types';

export const CURRENT_USER_ID = 'user_current_wayness';

export const initialProfile: Profile = {
  id: CURRENT_USER_ID,
  username: 'atleta_way',
  fullName: 'Carlos Gómez',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  bio: 'Fitness and tech enthusiast. Training hard to buy that new GPU with WPoints! 🏋️‍♂️💻',
  wpointsBalance: 12450,
  totalCalories: 8640,
  totalWorkouts: 14,
  followersCount: 142,
  followingCount: 98,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
};

export const initialWorkouts: Workout[] = [
  {
    id: 'w_1',
    userId: CURRENT_USER_ID,
    type: 'Gym',
    durationMinutes: 45,
    caloriesBurned: 380,
    wpointsEarned: 225, // Orange Zone (5 WP/min) * 45
    heartRateAvg: 118,
    workoutDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Intense upper body session. Hit new personal record on bench press!',
    exercises: [
      { id: 'ex_1', name: 'Bench Press', sets: 4, reps: 10, weightKg: 80 },
      { id: 'ex_2', name: 'Dumbbell Rows', sets: 3, reps: 12, weightKg: 24 },
      { id: 'ex_3', name: 'Incline Flyes', sets: 3, reps: 12, weightKg: 16 }
    ]
  },
  {
    id: 'w_2',
    userId: CURRENT_USER_ID,
    type: 'Running',
    durationMinutes: 30,
    caloriesBurned: 420,
    wpointsEarned: 180, // Red Zone (6 WP/min) * 30
    heartRateAvg: 135,
    distanceKm: 5.2,
    workoutDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Morning park run. Felt responsive and lightweight.',
    exercises: []
  },
  {
    id: 'w_3',
    userId: CURRENT_USER_ID,
    type: 'Cycling',
    durationMinutes: 60,
    caloriesBurned: 580,
    wpointsEarned: 240, // Green Zone (4 WP/min) * 60
    heartRateAvg: 98,
    distanceKm: 18.5,
    workoutDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Steady cruise around coastal paths.',
    exercises: []
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post_1',
    userId: 'user_sofia_fit',
    username: 'sofia_fit',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    content: 'Just smashed my first trail run of the season! The views were spectacular, and my legs feel amazing. Earned some sweet WPoints for my next protein shake refill! 🏞️🏃‍♀️',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    workoutDetails: {
      type: 'Running',
      durationMinutes: 45,
      caloriesBurned: 510,
      wpointsEarned: 270, // Red Zone average
      distanceKm: 7.4
    },
    likesCount: 24,
    likedByMe: true,
    commentsCount: 3,
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        userId: 'user_marcos_g',
        username: 'marcos_g',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        content: 'Awesome job Sofia! Keep pushing! 🔥',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c_2',
        postId: 'post_1',
        userId: CURRENT_USER_ID,
        username: 'atleta_way',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        content: 'That trail looks incredible! How are the elevations?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'post_2',
    userId: 'user_marcos_g',
    username: 'marcos_g',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Leg Day... absolute torture but 100% worth the XP rewards. Current balance is 22,000 WPoints. Beer discount, I am coming for you tonight! 🍺🏋️‍♂️',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    workoutDetails: {
      type: 'Gym',
      durationMinutes: 50,
      caloriesBurned: 450,
      wpointsEarned: 250 // Orange Zone
    },
    likesCount: 15,
    likedByMe: false,
    commentsCount: 1,
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        userId: 'user_sofia_fit',
        username: 'sofia_fit',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        content: 'No pain, no gain Marcos! Get that cold pint! 🍻',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'post_3',
    userId: 'user_elena_yoga',
    username: 'elena_yoga',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    content: 'Sunset mobility and flexibility session. Keeping my body fluid and recovering for tomorrows climbing. Balance is key. 🧘‍♀️🌅',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    workoutDetails: {
      type: 'Yoga',
      durationMinutes: 40,
      caloriesBurned: 160,
      wpointsEarned: 160 // Green Zone (4 WP)
    },
    likesCount: 38,
    likedByMe: false,
    commentsCount: 0,
    comments: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialRewards: Reward[] = [
  {
    id: 'r_1',
    name: 'League of Legends Gift Card',
    description: 'Redeem 500 RP directly to your League of Legends account. Level up your champions with your workout sweat!',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    wpointsCost: 50000,
    category: 'gaming',
    provider: 'Riot Games',
    stockQuantity: 12,
    isActive: true
  },
  {
    id: 'r_2',
    name: 'Fortnite Battle Pass',
    description: 'Get the latest Fortnite Battle Pass containing 1,000 V-Bucks. Dominate the battle royale from your jogging sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?auto=format&fit=crop&w=400&q=80',
    wpointsCost: 70000,
    category: 'gaming',
    provider: 'Epic Games',
    stockQuantity: 5,
    isActive: true
  },
  {
    id: 'r_3',
    name: 'MyProtein 1Kg Impact Whey',
    description: 'Premium quality whey isolate with 21g of protein per serving. Fast recovery for maximum gains, paid for with your loyalty.',
    imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=400&q=80',
    wpointsCost: 10000,
    category: 'supplements',
    provider: 'MyProtein',
    stockQuantity: 24,
    isActive: true
  },
  {
    id: 'r_4',
    name: '50% Beer Discount Coupon',
    description: 'Enjoy a cold craft beer at half price at any partnering local brewery. Celebrate your calorie deficits with a rewards splash!',
    imageUrl: 'https://images.unsplash.com/photo-1567696993772-f14020a13d3f?auto=format&fit=crop&w=400&q=80',
    wpointsCost: 20000,
    category: 'food',
    provider: 'Hop & Malt Crafts',
    stockQuantity: 150,
    isActive: true
  },
  {
    id: 'r_5',
    name: 'Instant Protein Bar Spark',
    description: 'Get an instant high-fiber chocolate peanut energy bar coupon at partner fitness center desks right now. Try it easily with few points!',
    imageUrl: 'https://images.unsplash.com/photo-1622484211148-7164999ea92f?auto=format&fit=crop&w=400&q=80',
    wpointsCost: 1500,
    category: 'food',
    provider: 'Active Fuel',
    stockQuantity: 99,
    isActive: true
  },
  {
    id: 'r_6',
    name: 'Pre-Workout Shot Energy',
    description: 'Supercharge your next session with a physical berry explosive energy shot. Can be claimed at any major gym front desk.',
    imageUrl: 'https://images.unsplash.com/photo-1620706857370-e1b976f79630?auto=format&fit=crop&w=400&q=80',
    wpointsCost: 3500,
    category: 'supplements',
    provider: 'Active Fuel',
    stockQuantity: 42,
    isActive: true
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'n_1',
    userId: CURRENT_USER_ID,
    type: 'like',
    title: 'Nuevo Me gusta',
    content: 'sofia_fit le dio me gusta a tu entrenamiento de Running.',
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'n_2',
    userId: CURRENT_USER_ID,
    type: 'follow',
    title: 'Nuevo seguidor',
    content: 'elena_yoga empezó a seguirte.',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Active stories seed
export const activeStories = [
  {
    id: 'st_1',
    username: 'sofia_fit',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    active: true,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st_2',
    username: 'marcos_g',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    active: true,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st_3',
    username: 'elena_yoga',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    active: false,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'st_4',
    username: 'dan_iron',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    active: true,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  }
];
