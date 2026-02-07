import { Notification } from "@/types/notification";
import { Comment, Post } from "@/types/post";

const generateMockComments = (): Comment[] => [
  {
    id: "c1",
    postId: "1",
    username: "jane_dev",
    text: "That's awesome! Congratulations on the launch! 🎉",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "c2",
    postId: "1",
    username: "dev_john",
    text: "What tech stack did you use?",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
  },
  {
    id: "c3",
    postId: "1",
    username: "alex_tech",
    text: "React Native with Expo and Node.js backend! 💪",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "c4",
    postId: "2",
    username: "tech_lover",
    text: "100% agree with you!",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "c5",
    postId: "2",
    username: "sarah_dev",
    text: "The ecosystem is so mature now!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "c6",
    postId: "3",
    username: "coffee_coder",
    text: "☕ + 💻 = ❤️",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "c7",
    postId: "4",
    username: "designer_pro",
    text: "Great tip! Testing on different devices saved me so many times.",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
  },
];

const generateMockPosts = (): Post[] => [
  {
    id: "1",
    username: "alex_tech",
    text: "Just launched my new mobile app! Feeling excited about the possibilities 🚀",
    likes: 245,
    comments: 32,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isLiked: false,
  },
  {
    id: "2",
    username: "sarah_dev",
    text: "React Native is amazing for cross-platform development. Loving this journey!",
    likes: 189,
    comments: 28,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isLiked: false,
  },
  {
    id: "3",
    username: "john_codes",
    text: "Coffee and code - the perfect combination ☕️💻",
    likes: 156,
    comments: 18,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isLiked: false,
  },
  {
    id: "4",
    username: "emma_design",
    text: "UI design tip: Always test your designs on different screen sizes!",
    likes: 412,
    comments: 67,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isLiked: false,
  },
  {
    id: "5",
    username: "mike_frontend",
    text: "Finally understood async/await properly. No more callback hell!",
    likes: 334,
    comments: 45,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isLiked: false,
  },
  {
    id: "6",
    username: "lisa_js",
    text: "TypeScript is a game changer. Can't imagine writing JS without it anymore.",
    likes: 567,
    comments: 89,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isLiked: false,
  },
  {
    id: "7",
    username: "david_fullstack",
    text: "Building web apps is fun, but building mobile apps is on another level!",
    likes: 298,
    comments: 54,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isLiked: false,
  },
];

const generateMockNotifications = (): Notification[] => [
  {
    id: "n1",
    type: "like",
    username: "jane_dev",
    postId: "1",
    postText:
      "Just launched my new mobile app! Feeling excited about the possibilities 🚀",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    isRead: false,
  },
  {
    id: "n2",
    type: "comment",
    username: "dev_john",
    postId: "1",
    postText:
      "Just launched my new mobile app! Feeling excited about the possibilities 🚀",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    isRead: false,
  },
  {
    id: "n3",
    type: "like",
    username: "sarah_dev",
    postId: "2",
    postText:
      "React Native is amazing for cross-platform development. Loving this journey!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
  {
    id: "n4",
    type: "like",
    username: "alex_tech",
    postId: "1",
    postText:
      "Just launched my new mobile app! Feeling excited about the possibilities 🚀",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
  },
  {
    id: "n5",
    type: "comment",
    username: "coffee_coder",
    postId: "3",
    postText: "Coffee and code - the perfect combination ☕️💻",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: true,
  },
];

let mockPosts: Post[] = generateMockPosts();
let mockComments: Comment[] = generateMockComments();
let mockNotifications: Notification[] = generateMockNotifications();

export const getMockPosts = async (): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPosts;
};

export const filterPostsByUsername = async (
  username: string,
): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!username.trim()) {
    return mockPosts;
  }

  return mockPosts.filter((post) =>
    post.username.toLowerCase().includes(username.toLowerCase()),
  );
};

export const toggleMockLike = async (postId: string): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  mockPosts = mockPosts.map((post) => {
    if (post.id === postId) {
      return {
        ...post,
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      };
    }
    return post;
  });

  return mockPosts;
};

export const createMockPost = async (
  username: string,
  text: string,
): Promise<Post> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newPost: Post = {
    id: String(Date.now()),
    username,
    text,
    likes: 0,
    comments: 0,
    timestamp: new Date(),
    isLiked: false,
  };

  mockPosts = [newPost, ...mockPosts];
  return newPost;
};

export const getMockPost = async (postId: string): Promise<Post | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockPosts.find((post) => post.id === postId) || null;
};

export const getMockComments = async (postId: string): Promise<Comment[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockComments.filter((comment) => comment.postId === postId);
};

export const addMockCommentWithText = async (
  postId: string,
  username: string,
  text: string,
): Promise<Comment> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newComment: Comment = {
    id: String(Date.now()),
    postId,
    username,
    text,
    timestamp: new Date(),
  };

  mockComments.push(newComment);

  // Update post comment count
  mockPosts = mockPosts.map((post) => {
    if (post.id === postId) {
      return {
        ...post,
        comments: post.comments + 1,
      };
    }
    return post;
  });

  return newComment;
};

export const addMockComment = async (postId: string): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  mockPosts = mockPosts.map((post) => {
    if (post.id === postId) {
      return {
        ...post,
        comments: post.comments + 1,
      };
    }
    return post;
  });

  return mockPosts;
};

export const getUserPosts = async (username: string): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockPosts.filter(
    (post) => post.username.toLowerCase() === username.toLowerCase(),
  );
};

export const getUserStats = async (
  username: string,
): Promise<{ postCount: number; totalLikes: number }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const userPosts = mockPosts.filter(
    (post) => post.username.toLowerCase() === username.toLowerCase(),
  );
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  return {
    postCount: userPosts.length,
    totalLikes,
  };
};

export const getMockNotifications = async (): Promise<Notification[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockNotifications;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return mockNotifications.filter((n) => !n.isRead).length;
};

export const markNotificationsAsRead = async (): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  mockNotifications = mockNotifications.map((n) => ({
    ...n,
    isRead: true,
  }));
};
