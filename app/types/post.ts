export type Post = {
  id: string;
  username: string;
  text: string;
  likes: number;
  comments: number;
  timestamp: Date;
  isLiked: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  username: string;
  text: string;
  timestamp: Date;
};
