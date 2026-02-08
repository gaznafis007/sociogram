import PostCard from "@/components/feed/PostCard";
import UsernameFilter from "@/components/feed/UsernameFilter";
import NotificationBell from "@/components/NotificationBell";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { useAuth } from "@/contexts/AuthContext";
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
import { postService } from "@/services/postService";
import axios from "axios";

export default function FeedScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadPosts = useCallback(async () => {
    try {
      const params: any = { page: 1, limit: 20 };
      if (searchQuery) {
        params.username = searchQuery;
      }

      const response = await postService.getPosts(params);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      let message = "Failed to load posts";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
        if (!err.response) {
          message = "Cannot connect to server";
        }
      }
      setError(message);
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const loadUnreadCount = useCallback(async () => {
    try {
      // TODO: Implement notifications API
      // For now, keep at 0
      setUnreadCount(0);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([loadPosts(), loadUnreadCount()]);
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleLike = async (postId: string) => {
    try {
      // Optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes.includes(user?._id || "");
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== user?._id)
                : [...post.likes, user?._id || ""],
              likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
            };
          }
          return post;
        }),
      );

      // API call
      await postService.likePost(postId);
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert optimistic update on error
      await loadPosts();
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
  }, [isAuthenticated, searchQuery]);

  useEffect(() => {
    if (searchQuery !== "") {
      const debounce = setTimeout(() => {
        loadPosts();
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      loadPosts();
    }
  }, [searchQuery]);

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

      {posts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-base">
            {searchQuery ? "No posts found" : "No posts yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onLike={handleLike}
              onComment={handleComment}
              onPress={() => router.push(`/post/${item._id}`)}
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
