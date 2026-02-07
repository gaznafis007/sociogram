import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

type ErrorBannerProps = {
  message: string;
  onRetry: () => void;
  onDismiss?: () => void;
};

export default function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: ErrorBannerProps) {
  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetry();
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss?.();
  };

  return (
    <View className="bg-red-50 border-b border-red-200 px-4 py-3">
      <View className="flex-row gap-3 items-start">
        <MaterialCommunityIcons
          name="alert-circle"
          size={20}
          color="#EF4444"
          style={{ marginTop: 2 }}
        />
        <View className="flex-1">
          <Text className="text-red-900 font-semibold mb-2">{message}</Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleRetry}
              className="flex-1 bg-red-500 rounded-lg px-3 py-2 items-center"
            >
              <Text className="text-white font-semibold text-sm">
                Try Again
              </Text>
            </Pressable>
            {onDismiss && (
              <Pressable
                onPress={handleDismiss}
                className="flex-1 bg-red-100 rounded-lg px-3 py-2 items-center"
              >
                <Text className="text-red-900 font-semibold text-sm">
                  Dismiss
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
