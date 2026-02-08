import { Post } from "@/types/post";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

type PostCardProps = {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPress?: () => void;
};

const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export default function PostCard({
  post,
  onLike,
  onComment,
  onPress,
}: PostCardProps) {
  const { user } = useAuth();
  const isLiked = user ? post.likes.includes(user._id) : false;

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike(post._id);
  };

  const handleComment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComment(post._id);
  };

  return (
    <Pressable onPress={onPress} className="bg-white border-b border-gray-100">
      <View className="px-6 py-5">
        {/* Header */}
        <View className="mb-3">
          <View className="flex-row items-center gap-3">
            {/* Avatar */}
            <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white font-bold text-sm">
                {post.author.username.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                {post.author.username}
              </Text>
              <Text className="text-xs text-gray-500">
                {formatTimestamp(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Post Text */}
        <View className="mb-4 ml-13">
          <Text className="text-[15px] text-gray-800 leading-6">
            {post.content}
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row items-center gap-8 ml-13">
          {/* Like Button */}
          <Pressable
            onPress={handleLike}
            className="flex-row items-center gap-2 py-1"
          >
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={22}
              color={isLiked ? "#EF4444" : "#6B7280"}
            />
            <Text
              className={`text-sm font-semibold ${
                isLiked ? "text-red-500" : "text-gray-600"
              }`}
            >
              {post.likeCount}
            </Text>
          </Pressable>

          {/* Comment Button */}
          <Pressable
            onPress={handleComment}
            className="flex-row items-center gap-2 py-1"
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={22}
              color="#6B7280"
            />
            <Text className="text-sm font-semibold text-gray-600">
              {post.commentCount}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
