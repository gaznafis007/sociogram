import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

type UsernameFilterProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function UsernameFilter({
  value,
  onChangeText,
}: UsernameFilterProps) {
  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View className="px-4 py-2 bg-white border-b border-gray-100">
      <View className="flex-row items-center bg-gray-50 rounded-full px-3 py-2 gap-2 border border-gray-200">
        <MaterialCommunityIcons name="magnify" size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search by username..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-sm text-gray-900"
          autoCapitalize="none"
        />
        {value ? (
          <Pressable onPress={handleClear}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#9CA3AF"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
