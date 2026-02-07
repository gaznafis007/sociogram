import PostCard from "@/components/feed/PostCard";
import UsernameFilter from "@/components/feed/UsernameFilter";
import NotificationBell from "@/components/NotificationBell";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useAuth } from "@/contexts/AuthContext";
import {
  filterPostsByUsername,
  getMockPosts,
  getUnreadNotificationCount,
  toggleMockLike,
} from "@/data/mockData";
import { Post } from "@/types/post";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      const allPosts = await getMockPosts();
      setPosts(allPosts);

      if (searchQuery) {
        const filtered = await filterPostsByUsername(searchQuery);
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts(allPosts);
      }
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load posts";
      setError(message);
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadPosts(), loadUnreadCount()]);
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = await filterPostsByUsername(query);
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  };

  const handleLike = async (postId: string) => {
    const updatedPosts = await toggleMockLike(postId);
    setPosts(updatedPosts);

    if (searchQuery) {
      const filtered = updatedPosts.filter((p) =>
        p.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(updatedPosts);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
      loadUnreadCount();
    }
  }, [isAuthenticated, loadPosts, loadUnreadCount]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900">Feed</Text>
        <NotificationBell
          unreadCount={unreadCount}
          onPress={() => router.push("/notifications")}
        />
      </View>

      {error && (
        <ErrorBanner
          message={error}
          onRetry={loadPosts}
          onDismiss={() => setError(null)}
        />
      )}

      <UsernameFilter value={searchQuery} onChangeText={handleSearch} />

      {filteredPosts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-base">
            {searchQuery ? "No posts found" : "No posts yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
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
        />
      )}
    </SafeAreaView>
  );
}
