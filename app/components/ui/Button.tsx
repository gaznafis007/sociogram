import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonProps = {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button({
  onPress,
  title,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      className={`py-4 px-6 rounded-lg items-center justify-center ${
        isPrimary
          ? "bg-blue-500 active:bg-blue-600"
          : "bg-gray-200 active:bg-gray-300"
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#ffffff" : "#000000"} />
      ) : (
        <Text
          className={`font-semibold text-base ${
            isPrimary ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
