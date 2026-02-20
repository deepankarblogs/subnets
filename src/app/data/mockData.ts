export interface User {
  id: string;
  username: string;
  avatar: string;
  verified: boolean;
}

export interface Post {
  id: string;
  author: User;
  show: string;
  content: string;
  hasSpoiler: boolean;
  tags: Array<{ text: string; color: 'purple' | 'orange' | 'blue' }>;
  reactions: {
    upvotes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  image?: string;
  isDeleted?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  reactions: {
    upvotes: number;
  };
  timestamp: string;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  type: 'comment' | 'upvote' | 'mention' | 'badge' | 'moderation';
  user?: User;
  content: string;
  timestamp: string;
  read: boolean;
  postId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: { current: number; total: number };
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'TheoryMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TheoryMaster',
    verified: true,
  },
  {
    id: '2',
    username: 'SpoilerQueen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpoilerQueen',
    verified: true,
  },
  {
    id: '3',
    username: 'BingeWatcher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BingeWatcher',
    verified: false,
  },
  {
    id: '4',
    username: 'PlotTwistFan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PlotTwistFan',
    verified: true,
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    show: 'Stranger Things',
    content: 'I think Vecna is actually connected to the Mind Flayer through time manipulation. The clocks, the visions... it all adds up! 🕐',
    hasSpoiler: false,
    tags: [
      { text: 'Theory', color: 'purple' },
      { text: 'Season 4', color: 'orange' },
    ],
    reactions: { upvotes: 234, comments: 45, shares: 12 },
    timestamp: '2h ago',
  },
  {
    id: '2',
    author: mockUsers[1],
    show: 'The Last of Us',
    content: 'MAJOR SPOILER: That ending scene completely changed everything we thought we knew about Joel\'s decision...',
    hasSpoiler: true,
    tags: [
      { text: 'Spoiler', color: 'orange' },
      { text: 'Episode 9', color: 'blue' },
    ],
    reactions: { upvotes: 567, comments: 123, shares: 34 },
    timestamp: '4h ago',
  },
  {
    id: '3',
    author: mockUsers[2],
    show: 'Wednesday',
    content: 'The cinematography in the dance scene is absolutely incredible. Burton\'s signature style combined with modern aesthetics 💀',
    hasSpoiler: false,
    tags: [
      { text: 'Discussion', color: 'blue' },
      { text: 'Cinematography', color: 'purple' },
    ],
    reactions: { upvotes: 892, comments: 67, shares: 45 },
    timestamp: '1d ago',
  },
  {
    id: '4',
    author: mockUsers[3],
    show: 'Breaking Bad',
    content: 'Just finished my 5th rewatch. The foreshadowing in S1E1 is INSANE when you know how it all ends. Walter\'s pants flying in the desert? Chef\'s kiss.',
    hasSpoiler: false,
    tags: [
      { text: 'Rewatch', color: 'purple' },
      { text: 'Foreshadowing', color: 'orange' },
    ],
    reactions: { upvotes: 1234, comments: 234, shares: 89 },
    timestamp: '2d ago',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    author: mockUsers[1],
    content: 'This is exactly what I\'ve been saying! The clock symbolism is everywhere.',
    reactions: { upvotes: 45 },
    timestamp: '1h ago',
    replies: [
      {
        id: 'c1-1',
        author: mockUsers[0],
        content: 'Right?! And if you look at the scene in episode 7...',
        reactions: { upvotes: 23 },
        timestamp: '45m ago',
      },
    ],
  },
  {
    id: 'c2',
    author: mockUsers[2],
    content: 'I never thought about it that way. Mind blown 🤯',
    reactions: { upvotes: 67 },
    timestamp: '30m ago',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'comment',
    user: mockUsers[1],
    content: 'commented on your theory about Stranger Things',
    timestamp: '5m ago',
    read: false,
    postId: '1',
  },
  {
    id: 'n2',
    type: 'upvote',
    user: mockUsers[2],
    content: 'and 23 others upvoted your post',
    timestamp: '1h ago',
    read: false,
    postId: '1',
  },
  {
    id: 'n3',
    type: 'badge',
    content: 'You unlocked the "Theory Master" badge! 🏆',
    timestamp: '2h ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'mention',
    user: mockUsers[3],
    content: 'mentioned you in a discussion about Breaking Bad',
    timestamp: '3h ago',
    read: true,
    postId: '4',
  },
  {
    id: 'n5',
    type: 'moderation',
    content: 'Your post was flagged for spoilers. Please add spoiler tags.',
    timestamp: '1d ago',
    read: true,
  },
];

export const mockBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Theory Master',
    description: 'Create 10 theories that get 100+ upvotes',
    icon: '🧠',
    rarity: 'epic',
    unlockedAt: '2024-02-10',
  },
  {
    id: 'b2',
    name: 'First Post',
    description: 'Share your first theory',
    icon: '🎬',
    rarity: 'common',
    unlockedAt: '2024-01-15',
  },
  {
    id: 'b3',
    name: 'Spoiler Hunter',
    description: 'Correctly predict 5 plot twists',
    icon: '🔮',
    rarity: 'legendary',
    progress: { current: 3, total: 5 },
  },
  {
    id: 'b4',
    name: 'Binge Watcher',
    description: 'Comment on 50 different shows',
    icon: '📺',
    rarity: 'rare',
    progress: { current: 32, total: 50 },
  },
];
