import PostCard from "@/components/feed/PostCard";
import Button from "@/components/ui/Button";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPosts, getUserStats, toggleMockLike } from "@/data/mockData";
import { Post } from "@/types/post";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ postCount: 0, totalLikes: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    if (!user?.username) return;

    try {
      const [userPosts, userStats] = await Promise.all([
        getUserPosts(user.username),
        getUserStats(user.username),
      ]);
      setPosts(userPosts);
      setStats(userStats);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load profile data";
      setError(message);
      console.error("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    const updatedPosts = await toggleMockLike(postId);
    const userPostsUpdated = updatedPosts.filter(
      (post) => post.username.toLowerCase() === user?.username.toLowerCase(),
    );
    setPosts(userPostsUpdated);

    // Update stats
    const totalLikes = userPostsUpdated.reduce(
      (sum, post) => sum + post.likes,
      0,
    );
    setStats((prev) => ({ ...prev, totalLikes }));
  };

  const handleComment = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* Error Banner */}
            {error && (
              <ErrorBanner
                message={error}
                onRetry={loadUserData}
                onDismiss={() => setError(null)}
              />
            )}

            {/* User Info Section */}
            <View className="items-center px-6 py-6 border-b border-gray-100">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-6">
                <Text className="text-4xl font-bold text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* User Info */}
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {user?.username}
              </Text>
              <Text className="text-gray-600 mb-6">{user?.email}</Text>

              {/* Real Stats */}
              <View className="flex-row gap-12 w-full justify-center">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.postCount}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">Posts</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.totalLikes}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">Likes</Text>
                </View>
              </View>
            </View>

            {/* Posts Header */}
            {posts.length > 0 && (
              <View className="px-6 py-3 border-b border-gray-100">
                <Text className="text-sm font-semibold text-gray-600">
                  Your Posts
                </Text>
              </View>
            )}

            {/* Empty State */}
            {posts.length === 0 && !loading && (
              <View className="px-6 py-12 items-center">
                <Text className="text-gray-500">No posts yet. Create one!</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={handleLike}
            onComment={handleComment}
            onPress={() => router.push(`/post/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <View className="px-6 py-6">
            <Button title="Logout" onPress={handleLogout} variant="secondary" />
          </View>
        }
      />
    </SafeAreaView>
  );
}
