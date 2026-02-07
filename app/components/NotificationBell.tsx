import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type NotificationBellProps = {
  unreadCount: number;
  onPress: () => void;
};

export default function NotificationBell({
  unreadCount,
  onPress,
}: NotificationBellProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="relative">
        <MaterialCommunityIcons name="bell-outline" size={24} color="#1F2937" />

        {/* Badge */}
        {unreadCount > 0 && (
          <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
