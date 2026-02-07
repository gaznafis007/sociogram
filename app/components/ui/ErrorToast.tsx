import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type ErrorToastProps = {
  message: string;
  onRetry: () => void;
  autoHideDuration?: number;
  onDismiss?: () => void;
};

export default function ErrorToast({
  message,
  onRetry,
  autoHideDuration = 5000,
  onDismiss,
}: ErrorToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [autoHideDuration, onDismiss]);

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRetry();
  };

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <View className="bg-red-500 mx-4 mb-4 rounded-lg px-4 py-3 flex-row items-center gap-3">
      <MaterialCommunityIcons name="alert" size={20} color="white" />
      <View className="flex-1">
        <Text className="text-white font-semibold text-sm">{message}</Text>
      </View>
      <Pressable onPress={handleRetry} className="px-2 py-1">
        <Text className="text-white font-semibold text-xs">RETRY</Text>
      </Pressable>
      <Pressable onPress={handleDismiss} className="px-2 py-1">
        <MaterialCommunityIcons name="close" size={18} color="white" />
      </Pressable>
    </View>
  );
}
