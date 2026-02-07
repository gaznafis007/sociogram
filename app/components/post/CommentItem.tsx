import { Comment } from "@/types/post";
import { Text, View } from "react-native";

type CommentItemProps = {
  comment: Comment;
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <View className="bg-white px-4 py-2">
      <View className="flex-row gap-2">
        {/* Avatar */}
        <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mt-1">
          <Text className="text-white font-bold text-xs">
            {comment.username.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          {/* Comment Bubble */}
          <View className="bg-gray-100 rounded-2xl px-4 py-2.5">
            <Text className="font-semibold text-gray-900 text-sm mb-0.5">
              {comment.username}
            </Text>
            <Text className="text-[14px] text-gray-800 leading-5">
              {comment.text}
            </Text>
          </View>

          {/* Timestamp */}
          <Text className="text-xs text-gray-500 mt-1 ml-4">
            {formatTimestamp(comment.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
}
