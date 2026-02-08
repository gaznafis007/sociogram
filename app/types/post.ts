// Backend User type
export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profileImage?: string;
  deviceToken?: string;
  createdAt: string;
  updatedAt: string;
};

// Backend Comment type
export type Comment = {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
};

// Backend Post type
export type Post = {
  _id: string;
  author: User;
  content: string;
  tags?: string[];
  likes: string[]; // Array of user IDs
  comments: Comment[];
  likeCount: number; // Virtual field
  commentCount: number; // Virtual field
  createdAt: string;
  updatedAt: string;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
};
