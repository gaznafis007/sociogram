export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio?: string;
  profileImage?: string;
  deviceToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  _id: string;
  author: string;
  content: string;
  tags?: string[];
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export interface ILike {
  _id: string;
  post: string;
  user: string;
  createdAt: Date;
}

export interface AuthRequest {
  userId?: string;
  email?: string;
  user?: {
    userId: string;
    email: string;
  };
}
