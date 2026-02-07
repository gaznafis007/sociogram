import ErrorBanner from "@/components/ui/ErrorBanner";
import { getMockNotifications, markNotificationsAsRead } from "@/data/mockData";
import { Notification } from "@/types/notification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const notifs = await getMockNotifications();
      setNotifications(notifs);
      await markNotificationsAsRead();
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load notifications";
      setError(message);
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const notifs = await getMockNotifications();
      setNotifications(notifs);
      await markNotificationsAsRead();
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load notifications";
      setError(message);
      console.error("Error loading notifications:", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleNotificationTap = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-100 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-2xl font-bold text-gray-900">Notifications</Text>
      </View>

      {error && (
        <ErrorBanner
          message={error}
          onRetry={loadNotifications}
          onDismiss={() => setError(null)}
        />
      )}

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={48}
            color="#D1D5DB"
          />
          <Text className="text-gray-500 mt-4">No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleNotificationTap(item.postId)}
              className="px-6 py-4 border-b border-gray-100 flex-row gap-3"
            >
              {/* Avatar */}
              <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white font-bold text-sm">
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View className="flex-1">
                {/* Notification Text */}
                <View className="flex-row flex-wrap">
                  <Text className="font-semibold text-gray-900">
                    {item.username}
                  </Text>
                  <Text className="text-gray-600">
                    {" "}
                    {item.type === "like"
                      ? "liked your post"
                      : "commented on your post"}
                  </Text>
                </View>

                {/* Post Preview */}
                <Text className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {item.postText}
                </Text>

                {/* Timestamp */}
                <Text className="text-gray-400 text-xs mt-1">
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>

              {/* Icon */}
              <MaterialCommunityIcons
                name={item.type === "like" ? "heart" : "comment"}
                size={20}
                color={item.type === "like" ? "#EF4444" : "#3B82F6"}
              />
            </Pressable>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
