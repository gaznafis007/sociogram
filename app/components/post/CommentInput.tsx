import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

type CommentInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
};

export default function CommentInput({
  value,
  onChangeText,
  onSubmit,
  loading = false,
  placeholder = "Add a comment...",
}: CommentInputProps) {
  const handleSubmit = () => {
    if (value.trim() && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !loading;

  return (
    <View className="bg-white border-t border-gray-100 px-4 py-3">
      <View className="flex-row items-center gap-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-sm text-gray-900 border border-gray-200"
          editable={!loading}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          className={`p-2 rounded-full ${canSubmit ? "bg-blue-500" : "bg-gray-200"}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={canSubmit ? "#FFFFFF" : "#9CA3AF"}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
