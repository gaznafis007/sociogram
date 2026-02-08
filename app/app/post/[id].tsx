import PostCard from "@/components/feed/PostCard";
import CommentInput from "@/components/post/CommentInput";
import CommentItem from "@/components/post/CommentItem";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ErrorToast from "@/components/ui/ErrorToast";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/post";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { postService } from "@/services/postService";
import axios from "axios";

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    if (!id) return;

    try {
      const fetchedPost = await postService.getPost(id);
      setPost(fetchedPost);
      setError(null);
    } catch (err) {
      let message = "Failed to load post";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
        if (err.response?.status === 404) {
          message = "Post not found";
        } else if (!err.response) {
          message = "Cannot connect to server";
        }
      }
      setError(message);
      console.error("Error loading post:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedPost = await postService.getPost(id!);
      setPost(fetchedPost);
      setError(null);
    } catch (err) {
      let message = "Failed to load post";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
        if (!err.response) {
          message = "Cannot connect to server";
        }
      }
      setError(message);
      console.error("Error loading post:", err);
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleLike = async () => {
    if (!post || !user) return;

    try {
      // Optimistic update
      const isLiked = post.likes.includes(user._id);
      setPost({
        ...post,
        likes: isLiked
          ? post.likes.filter((id) => id !== user._id)
          : [...post.likes, user._id],
        likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
      });

      await postService.likePost(post._id);
      setActionError(null);
    } catch (err) {
      let message = "Failed to like post";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      setActionError(message);
      console.error("Error liking post:", err);
      // Revert on error
      await loadPost();
    }
  };

  const handleCommentSubmit = async () => {
    if (!post || !user || !commentText.trim()) return;

    setSubmitLoading(true);
    try {
      const updatedPost = await postService.addComment(post._id, {
        content: commentText.trim(),
      });
      setPost(updatedPost);
      setCommentText("");
      setActionError(null);
    } catch (err) {
      let message = "Failed to add comment";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
        if (!err.response) {
          message = "Cannot connect to server";
        }
      }
      setActionError(message);
      console.error("Error adding comment:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View className="px-6 py-4 border-b border-gray-100 flex-row items-center gap-3">
          <Pressable onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#1F2937"
            />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">Post</Text>
        </View>

        {error && (
          <ErrorBanner
            message={error}
            onRetry={loadPost}
            onDismiss={() => setError(null)}
          />
        )}

        {!error && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Post not found</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]} className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View className="px-6 py-4 border-b border-gray-100 flex-row items-center gap-3">
            <Pressable onPress={() => router.back()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#1F2937"
              />
            </Pressable>
            <Text className="text-xl font-bold text-gray-900">Post</Text>
          </View>

          {/* Action Error Toast */}
          {actionError && (
            <ErrorToast
              message={actionError}
              onRetry={
                actionError.includes("like") ? handleLike : handleCommentSubmit
              }
              onDismiss={() => setActionError(null)}
            />
          )}

          <FlatList
            data={post.comments}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={
              <PostCard
                post={post}
                onLike={handleLike}
                onComment={() => {}} // No nested navigation
              />
            }
            renderItem={({ item }) => <CommentItem comment={item} />}
            ListEmptyComponent={
              <View className="px-6 py-8 items-center">
                <Text className="text-gray-500">
                  No comments yet. Be the first!
                </Text>
              </View>
            }
            scrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#3B82F6"
              />
            }
          />

          {/* Comment Input */}
          <View
            className="border-t border-gray-100 bg-white"
            style={{ paddingBottom: insets.bottom || 10 }}
          >
            <CommentInput
              value={commentText}
              onChangeText={setCommentText}
              onSubmit={handleCommentSubmit}
              loading={submitLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
