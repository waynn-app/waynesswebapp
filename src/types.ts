export interface Profile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  wpointsBalance: number;
  totalCalories: number;
  totalWorkouts: number;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  durationMinutes?: number;
}

export interface Workout {
  id: string;
  userId: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  wpointsEarned: number;
  heartRateAvg?: number;
  distanceKm?: number;
  notes?: string;
  workoutDate: string;
  exercises?: Exercise[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  workoutId?: string;
  workoutDetails?: {
    type: string;
    durationMinutes: number;
    caloriesBurned: number;
    wpointsEarned: number;
    distanceKm?: number;
  };
  likesCount: number;
  likedByMe?: boolean;
  commentsCount: number;
  comments?: Comment[];
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  wpointsCost: number;
  category: 'all' | 'gaming' | 'supplements' | 'food';
  provider: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  rewardImageUrl: string;
  wpointsSpent: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  discountCode: string;
  emailSent: boolean;
  redeemedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'reward';
  title: string;
  content: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface UserState {
  profile: Profile | null;
  workouts: Workout[];
  posts: Post[];
  rewards: Reward[];
  redemptions: Redemption[];
  notifications: Notification[];
}
