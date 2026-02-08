import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { postService } from "@/services/postService";
import axios from "axios";

const MAX_CHARS = 280;

export default function CreateScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const textInputRef = useRef<TextInput>(null);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = text.trim().length === 0;

  // Auto-focus the text input when screen is focused
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }, []),
  );

  const handlePost = async () => {
    if (isEmpty || isOverLimit) return;

    setLoading(true);
    try {
      await postService.createPost({ content: text.trim() });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert("Success", "Post created successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)") },
      ]);
      setText("");
    } catch (error) {
      let errorMessage = "Failed to create post. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
        if (!error.response) {
          errorMessage = "Cannot connect to server";
        }
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Create Post</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Text Input */}
          <View className="flex-1 mb-6 mt-4">
            <TextInput
              ref={textInputRef}
              value={text}
              onChangeText={setText}
              placeholder="What's on your mind?"
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={MAX_CHARS}
              className={`flex-1 text-[15px] p-5 rounded-xl border text-gray-900 ${
                isOverLimit
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              style={{
                textAlignVertical: "top",
                minHeight: 200,
              }}
            />
          </View>

          {/* Character Counter */}
          <View className="mb-6 px-1 flex-row justify-between items-center">
            <Text className="text-sm text-gray-500">
              {isEmpty ? "Start typing..." : "Looking good!"}
            </Text>
            <Text
              className={`text-sm font-semibold ${
                isOverLimit
                  ? "text-red-500"
                  : charCount > MAX_CHARS * 0.9
                    ? "text-orange-500"
                    : "text-gray-500"
              }`}
            >
              {charCount} / {MAX_CHARS}
            </Text>
          </View>

          {/* Submit Button */}
          <View className="gap-3">
            <Button
              title={loading ? "Posting..." : "Post"}
              onPress={handlePost}
              loading={loading}
              disabled={isEmpty || isOverLimit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
