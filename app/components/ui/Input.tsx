import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = TextInputProps & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
};

export default function Input({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  placeholder,
  autoCapitalize = "none",
  keyboardType = "default",
  ...rest
}: InputProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2 text-sm">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        className={`border rounded-lg px-4 py-3 text-base ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white`}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
