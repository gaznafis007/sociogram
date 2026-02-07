export type Notification = {
  id: string;
  type: "like" | "comment"; // like or comment
  username: string; // who liked/commented
  postId: string;
  postText: string; // preview of the post
  timestamp: Date;
  isRead: boolean;
};
